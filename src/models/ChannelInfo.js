import mongoose, {
  Schema
} from "mongoose";

var mongoosePaginate = require('mongoose-paginate');


const schema = new Schema({
  rank: {
    type: String
  },
  grade: {
    type: String
  },
  channelName: {
    type: String
  },
  videoUploads: {
    type: String
  },
  subscribers: {
    type: String
  },
  videoViews: {
    type: Number
  }
}, {
  timestamps: true
});
schema.plugin(mongoosePaginate);

export default mongoose.model("ChannelInfo", schema);;