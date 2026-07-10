import mongoose from "mongoose";
import { Password } from "../services/password.js";

// interface to described required properties to create a new user
interface UserAttributes {
  email: string;
  password: string;
}

// interface describing properties required to create a user
interface UserModel extends mongoose.Model<UserDoc> {
  build: (attrs: UserAttributes) => UserDoc;
}

// interface describing properties a user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
};

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashed = await Password.toShash(this.get("password"));
    this.set("password", hashed);
  }
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

const user = User.build({
  email: "test@test.com",
  password: "test",
});
export { User };
