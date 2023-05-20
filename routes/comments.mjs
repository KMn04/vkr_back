import express from "express";
import {Comment} from '../models/Comment.mjs'

const router = express.Router();

router.get("", async (req, res) => {
  let results = await Comment.find();
  res.send(results).status(200);
});

export default router