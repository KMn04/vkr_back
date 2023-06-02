import express from "express";
import {Notification} from "../models/Notification.mjs";
import {Comment} from "../models/Comment.mjs";

const router = express.Router();

/*router.get("/:projectId/notifications", async (req, res) => {
    const projectId = req.params.projectId;
    let results = await Notification.find({subject.id: taskId} : {});
    const preparedResult = results.map(prepareComment)
    res.send(preparedResult).status(200);
});*/

export default router