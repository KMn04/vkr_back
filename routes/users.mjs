import express from "express";
import { Users } from "../models/Users.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  const allUsers = await Users.findAll();
  res.send(allUsers).status(200);
});

export default router