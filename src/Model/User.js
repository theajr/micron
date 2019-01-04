import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: {
      type: String,
      required: true,
      unique: true
    },
    dob: { type: Date },
    postsIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    commentsIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: true }
);

schema.pre("save", function() {
  // console.log("Pre Saving user");
});
schema.post("save", function() {
  console.log(
    `${this.isNew ? "New " : "Updated "} User: "${this.firstName}, ${
      this.lastName
    }"!`
  );
});
const Subscription = mongoose.model("User", schema);
export default Subscription;
