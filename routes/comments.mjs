import express from "express";
import mongo_db from "../db/mongo_connection.mjs";

const router = express.Router();

router.get("/comments", async (req, res) => {
  let collection = await mongo_db.collection("comments");
  let results = await collection.find({
    where: {
      
    }
  })
    .limit(50)
    .toArray();

  res.send(results).status(200);
});

export default router