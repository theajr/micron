import "babel-polyfill";

import { GraphQLServer } from "graphql-yoga";
import User from "./Model/User";
import Post from "./Model/Post";
import Comment from "./Model/Comment";
import connectToDB from "./db";

var console = require("manakin").local;

const defaultQueryParameters = {
  skip: 0,
  limit: 100
};

const resolvers = {
  Query: {
    getPosts: (obj, args, context, info) => {
      return Post.find({})
        .populate("author")
        .exec();
    },
    getUsers: (obj, args, context, info) => {
      const { input = {} } = args;
      return User.find({}, null, input);
    },
    getComments: (obj, args, context, info) => {
      const { input = {} } = args;
      return Comment.find({}, null, input);
    }
  },
  Post: {
    author: (parent, args) => {
      return User.findOne({
        _id: parent.authorId
      });
    },
    comments: (parent, args) => {
      return Comment.find({ postId: parent._id });
    }
  },
  User: {
    posts: (p, a) => {
      const { input = {} } = a;
      return Post.find({ authorId: p._id }, null, input);
    },
    comments: (p, a) => {
      const { input = {} } = a;
      return Comment.find({ authorId: p._id }, null, input);
    }
  },
  Comment: {
    post: (p, a) => {
      return Post.findById(p.postId)
        .then(post => post)
        .catch(error => {
          throw new Error("Post Not Found!");
        });
    },
    author: (p, a) => {
      return User.findById(p.authorId)
        .then(author => {
          return author;
        })
        .catch(error => {
          throw new Error("Author Not Found!");
        });
    }
  },
  Mutation: {
    createUser: (parent, { input }) => {
      return User.create(input);
    },
    createPost: (parent, { input }) => {
      return User.findOne({ _id: input.authorId })
        .then(user => {
          let post = new Post(input);
          post.authorId = input.authorId;
          return post
            .save()
            .then(dbPost => {
              user.postsIds.push(dbPost._id);
              user.save();
              return dbPost;
            })
            .catch(e => {
              throw new Error("Oopss!", e);
            });
        })
        .catch(e => {
          throw new Error("User not found!");
        });
    },
    createComment: (parent, args, context, info) => {
      const { input } = args;

      return Post.findOne({ _id: input.postId })
        .then(post => {
          // authorId will be replaced by authentication soon!
          return User.findOne({ _id: input.authorId })
            .then(user => {
              let comment = new Comment(input);
              return comment
                .save()
                .then(nComment => {
                  user.commentsIds.push(nComment._id);
                  user.save();
                  post.commentsIds.push(nComment._id);
                  post.save();
                  return nComment;
                })
                .catch(e => {
                  throw new Error("Unable to save comment!");
                });
            })
            .catch(e => {
              throw new Error("User not found!");
            });
        })
        .catch(error => {
          throw new Error("Post not found!");
        });
    },
    deletePost: async (parent, args, context, info) => {
      const post = await Post.findById(args.id);
      if (post) return post.delete();
      throw new Error("Post Not Found");
    }
  }
};
const options = {
  port: 1396,
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  },
  formatError: err => {
    console.warn(err.path);
    return { message: err.message, path: err.path };
  }
};
const server = new GraphQLServer({
  typeDefs: "src/graphql/schema.graphql",
  resolvers,
  context: {
    appName: "AJ's FB"
  }
});

connectToDB
  .then(() => {
    console.log("Connected To MongoDatabase!");
    server
      .start(options)
      .then(opt => {
        console.log("Server is up and running!", options.port);
      })
      .catch(e => {
        console.log("Unbale to start the server", e);
      });
  })
  .catch(e => {
    console.log("Unable to connect to db!");
  });
