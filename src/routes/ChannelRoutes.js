import {
    Router
} from "express";
import ChannelInfo from "../models/ChannelInfo";
const router = new Router();

const channels = async (req, res) => {
    console.log(req.query);
    const pagination = req.query;
    pagination.limit = parseInt(pagination.limit || 100)
    pagination.offset = parseInt(pagination.offset || 0)

    const result = await ChannelInfo.paginate({}, pagination);
    res.json(result)
}
router.get("/channels", channels)
export default router;