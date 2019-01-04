import "babel-polyfill";
import User from "../src/Model/User";
import Post from "../src/Model/Post";
import Comment from "../src/Model/Comment";
import connectToDB from "../src/db";
import f from "faker";

function del() {
  console.log("Inside del function");
  return Promise.all([
    User.deleteMany(),
    Post.deleteMany(),
    Comment.deleteMany()
  ]);
}

const populate = async () => {
  let users = [];
  let userIds = [];
  for (let index = 0; index < 3; index++) {
    let user = {
      firstName: f.name.firstName(),
      lastName: f.name.lastName(),
      username: f.random.uuid(),
      dob: f.date.past()
    };
    users.push(user);
  }
  const docs = await User.create(users);
  //   console.log(docs);
  const us = await User.find({}, "_id");
  userIds = await us.map(i => i._id);
  //   console.log(userIds);
  /* const remUser = await docs[0].remove();
  let c = new Post({
    title: f.lorem.sentence(),
    description: f.lorem.paragraph(),
    authorId: docs[0]._id
  });
  c.save()
    .then(s => {
      console.log("OPS SAVED!??");
    })
    .catch(e => console.log(e)); */
  let posts = [];
  for (let index = 0; index < 10; index++) {
    const element = {
      title: f.lorem.sentence(),
      description: f.lorem.paragraph(),
      authorId: userIds[Math.floor(Math.random() * userIds.length)]
    };
    posts.push(element);
  }
  const dbPosts = await Post.create(posts);
  //   await dbPosts[0].remove();
  //   console.log("removed");
  // await dbPosts[1].updateOne({}, { $set: { title: "Hey Baby!" } });

  // await Post.updateOne(
  //   { _id: dbPosts[2]._id },
  //   { $set: { title: "Updated!" } }
  // );
  const postIds = await dbPosts.map(i => i._id);

  let comments = [];
  for (let index = 0; index < 3; index++) {
    const element = {
      postId: postIds[Math.floor(Math.random() * postIds.length)],
      comment: "COM: " + f.lorem.sentence(),
      authorId: userIds[Math.floor(Math.random() * userIds.length)]
    };
    comments.push(element);
  }
  const dbCom = await Comment.create(comments);
  const commentIds = await dbCom.map(i => i._id);
  //   console.log(commentIds);

  const dbP = await Post.find({}, { _id: 1, commentsIds: 1, title: 1 });
  //   console.log(dbP);
  return Promise.resolve("Seeding completed...");
};

connectToDB
  .then(async () => {
    console.log("Connected To MongoDatabase!");

    await del();
    console.log("Cleaned Up!");

    let msg = await populate();
  })
  .catch(e => {
    console.log("Unable to connect to db!", e);
  });
