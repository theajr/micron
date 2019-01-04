import mongoose, { Schema } from "mongoose";
import Comment from "./Comment";
import User from "./User";

const schema = new Schema(
  {
    title: String,
    description: String,
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    commentsIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: true }
);

schema.pre("save", async function(next) {
  console.log(this.isNew);
  console.log("Pre save Post", this._id, this.authorId);
  const user = await User.findById(this.authorId);

  if (!user) next("User Not Found");

  // if (!user.postsIds.includes(this._id)) user.postsIds.push(this._id);
  // user.postsIds = Array.from(new Set(user.postsIds));
  const updatedUser = await user.update({
    $addToSet: { postsIds: this._id }
  });
  if (!updatedUser) next("Couldn't add post id to authos's post list!");
  next();
});
schema.pre("remove", async function(next) {
  console.log("-------------REMOVING POST", this);
  const removedComments = await Comment.deleteMany({ postId: this._id });
  console.log("REMOVED", removedComments);
  if (!removedComments) next("Failed to delete comments!");
  next();
});

schema.post("remove", async function() {
  console.log("-------------REMOVED POST", this);
  const user = await User.findOneAndUpdate(
    { _id: this.authorId },
    {
      $pull: { postsIds: this._id }
    }
  );
  if (!user) next("Failed to delete post from user's posts list!");
});

schema.pre("updateOne", { query: false, document: true }, function(next) {
  console.log("Updating !!", this._id);
  next();
});

schema.post("updateOne", (a, b, c) => {
  console.log(a, b, c);
});
export default mongoose.model("Post", schema);
