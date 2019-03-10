import 'babel-polyfill';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { connectToDB } from './db';
import ChannelInfo from './models/ChannelInfo';
import routes from './routes';
var fs = require('fs');

const app = express();
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use('/', routes);
const dump = fs.readFileSync(__dirname + '/Data.json', 'utf8');
const loadDump = async () => {
  await ChannelInfo.deleteMany();
  await ChannelInfo.insertMany(JSON.parse(dump));
};
loadDump();

const PORT = 1396;
connectToDB
  .then(async () => {
    console.log('Connected To MongoDatabase!');
    app.listen(1396, () => {
      console.log(`Express Server Running at ${PORT}`);
    });
  })
  .catch((e) => {
    console.log('Unable to connect to db!');
  });
