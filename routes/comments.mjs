import express from "express";
import {Comment} from '../models/Comment.mjs'
import {WikiPage} from '../models/Wiki.mjs'

const prepareComment = (comment) => ({
  commentId: comment._id,
  commentText: comment.text,
  authorName: comment.author,
  createdAt: comment.createdAt,
  pageId: comment.pageId
})

const router = express.Router();

router.get("/:taskId/comments", async (req, res) => {
  const taskId = req.params.taskId;
  let results = await Comment.find(taskId ? {taskId: taskId} : {});
  const preparedResult = results.map(prepareComment)
  res.send(preparedResult).status(200);
});

router.post("/:taskId/comments", async (req, res) => {
  const authorName = [req.body.user.firstName, req.body.user.secondName].join(' ');
  const taskId = req.params.taskId;

  if(!taskId){
    res.status(400).send('Не найден параметр taskId');
    return;
  }

  const commentPayload = {
    taskId: taskId,
    author: authorName,
    text: req.body.comment,
    createdAt: Date.now(),
    pageId: req.body.pageId ?? null
  }

  const newComment = new Comment(commentPayload)
  await newComment.save()
  res.send(newComment).status(200);

  if(commentPayload.pageId) {
    const page = await WikiPage.updateOne(
        {_id: commentPayload.pageId},
        {$set: {content: page.content + "/n" + commentPayload.text}}
    );
  }
});

export default router