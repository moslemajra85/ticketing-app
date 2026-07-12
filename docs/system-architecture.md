# System Architecture

This document is the living system diagram for the ticketing app. Update it whenever a new service, database, route group, infrastructure component, or cross-service communication pattern is added.

## Current System

```txt
┌─────────────────────────────┐
│ Browser / API Client        │
│ Host: ticketing.dev         │
└──────────────┬──────────────┘
               │ HTTP
               ▼
┌─────────────────────────────┐
│ Minikube                    │
│ Local Kubernetes Cluster    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Ingress NGINX               │
│ ingress-service             │
│ /api/users/?(.*)            │
└──────────────┬──────────────┘
               │ routes to
               ▼
┌─────────────────────────────┐
│ auth-srv                    │
│ Kubernetes Service          │
│ port 3000                   │
└──────────────┬──────────────┘
               │ forwards to
               ▼
┌─────────────────────────────┐
│ auth-depl                   │
│ Deployment                  │
│ 1 auth Pod                  │
└──────────────┬──────────────┘
               │ runs
               ▼
┌─────────────────────────────┐
│ auth container              │
│ Node.js / Express / TS      │
│ routes: /api/users/*        │
└──────────────┬──────────────┘
               │ connects to
               ▼
┌─────────────────────────────┐
│ auth-mongo-srv              │
│ Kubernetes Service          │
│ port 27017                  │
└──────────────┬──────────────┘
               │ forwards to
               ▼
┌─────────────────────────────┐
│ auth-mongo-depl             │
│ MongoDB Pod                 │
│ auth database               │
└─────────────────────────────┘
```

## Build And Deploy Flow

```txt
┌─────────────────────────────┐
│ Developer changes code      │
│ auth/src/**/*.ts            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Skaffold                    │
│ skaffold.yaml               │
└──────────────┬──────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
┌───────────────┐   ┌────────────────────┐
│ Docker build  │   │ kubectl apply      │
│ mossajross/auth│  │ infra/k8s/*        │
└───────┬───────┘   └─────────┬──────────┘
        │                     │
        └──────────┬──────────┘
                   ▼
┌─────────────────────────────┐
│ Minikube cluster updates    │
│ Pods / Services / Ingress   │
└─────────────────────────────┘
```

## Auth Service Responsibility

The `auth` service owns user identity concerns:

- signup
- signin
- signout
- current user lookup
- password hashing
- user persistence in MongoDB
- auth-related request validation and error handling

Current route group:

```txt
GET  /api/users/currentuser
POST /api/users/signup
POST /api/users/signin
POST /api/users/signout
```

## Runtime Request Flow

```txt
Client request
  -> ticketing.dev resolves to Minikube IP through /etc/hosts
  -> Ingress NGINX receives the HTTP request
  -> Ingress rule matches /api/users/?(.*)
  -> request is sent to auth-srv
  -> auth-srv forwards to the current auth Pod
  -> Express route handler runs
  -> auth service reads/writes auth data through auth-mongo-srv
  -> response returns through the same path
```

## Current Kubernetes Resources

```txt
infra/k8s/ingress-srv.yaml
  Ingress: ingress-service
  Host: ticketing.dev
  Path: /api/users/?(.*)
  Backend: auth-srv:3000

infra/k8s/auth-depl.yaml
  Deployment: auth-depl
  Service: auth-srv
  Container image: mossajross/auth
  Container port: 3000

infra/k8s/auth-mongo-depl.yaml
  Deployment: auth-mongo-depl
  Service: auth-mongo-srv
  Container image: mongo
  MongoDB port: 27017
```

## Update Rules

When adding a new service, update this document in the same change.

For each new service, document:

- service name and responsibility
- public route prefix, if exposed through Ingress
- Kubernetes Deployment name
- Kubernetes Service name
- database or external dependency, if any
- sync/build entry in `skaffold.yaml`
- request flow changes
- new cross-service communication, if any

For example, when a future `tickets` service is added, this diagram should show:

```txt
Ingress NGINX
  ├─ /api/users/*   -> auth-srv
  └─ /api/tickets/* -> tickets-srv

tickets service
  -> tickets-mongo-srv
```

## Design Notes

Each service should own its own data. The `auth` service talks to `auth-mongo-srv`; future services should not directly read or write the auth database.

Ingress is the only public HTTP entry point in the current local architecture. Internal services should talk to each other through Kubernetes Services only when a real cross-service use case exists.

Skaffold is the local development orchestrator. If a new service is added, it needs its own build artifact entry so code changes rebuild or sync correctly.
