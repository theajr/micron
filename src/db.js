import mongoose from "mongoose";
mongoose.Promise = Promise;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true
};

const connectToDB = new Promise((resolve, reject) => {
  mongoose
    .connect(
      "mongodb://localhost:27017/demoApp",
      options
    )
    .then(o => {
      resolve(o);
    })
    .catch(e => {
      reject(e);
    });
});

export default connectToDB;
