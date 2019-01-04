import mongoose, { Schema } from "mongoose";
import Post from "./Post";

const schema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post"
    },
    comment: String,
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

schema.pre("save", async function(next) {
  // console.log("Pre save comment", this);
  const post = await Post.findById(this.postId);
  if (!post) next("Post Not Found");
  next();
});
schema.post("save", async function() {
  // console.log("After save comment", this);
  const resultPost = await Post.findById(this.postId);
  resultPost.commentsIds.push(this._id);
  const finalPost = await resultPost.save();
  // console.log("RES ", finalPost);
});
export default mongoose.model("Comment", schema);
