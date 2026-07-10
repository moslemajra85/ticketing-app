import mongoose, { Mongoose } from "mongoose";
import { string } from "zod";

// interface to described required properties to create a new user
interface UserAttributes {
  email: string;
  password: string;
}


// interface describing properties required to create a user
interface UserModel extends mongoose.Model<UserDoc> {


  build: (attrs: UserAttributes) => UserDoc


}


// interface describing properties a user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string

}
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: string,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
};



const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

const user  = User.build({

  email: "test@test.com",
  password: "test"

})
export { User };
