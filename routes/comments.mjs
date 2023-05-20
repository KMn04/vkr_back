import express from "express";
import {Comment} from '../models/Comment.mjs'

const router = express.Router();

router.get("", async (req, res) => {
  let results = await Comment.find();
  res.send(results).status(200);
});

router.post("", async (req, res) => {
  const commentPayload = {  
    taskId: req.body.taskId,
    info: {
      author: req.body.user.firstName,
      text: req.body.comment
    }
  }
  const newComment = new Comment(commentPayload)
  await newComment.save()
  res.send(newComment).status(200);
});

export default router