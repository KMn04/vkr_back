import express from "express";
import { User } from "../models/User.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  const allUsers = await User.findAll();
  res.send(allUsers).status(200);
});

// каскадное удаление проектов, перевод задач на автора задачи

export default router