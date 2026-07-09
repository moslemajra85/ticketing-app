export class DatabaseConnectionError extends Error {
  statusCode = 500;
  reason = "Error connecting to Database";
  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serilizeError() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
