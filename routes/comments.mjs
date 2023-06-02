import express from "express";
import {Comment} from '../models/Comment.mjs'

const prepareComment = (comment) => ({
  commentId: comment._id,
  commentText: comment.info.text,
  authorName: comment.info.author,
  createdAt: comment.info.createdAt
})

const router = express.Router();

router.get("", async (req, res) => {
  const taskId = req.query.taskId;

  let results = await Comment.find(taskId ? {taskId: taskId} : {});
  const preparedResult = results.map(prepareComment)
  res.send(preparedResult).status(200);
});

router.post("", async (req, res) => {
  const authorName = [req.body.user.firstName, req.body.user.secondName].join(' ');
  const taskId = req.body.taskId;

  if(!taskId){
    res.status(400).send('Не найден параметр taskId');
    return;
  }

  const commentPayload = {
    taskId: taskId,
    info: {
      author: authorName,
      text: req.body.comment,
      createdAt: Date.now()
    }
  }
  const newComment = new Comment(commentPayload)
  await newComment.save()
  res.send(newComment).status(200);
});

export default router