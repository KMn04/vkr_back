import express from "express";
import mongo_db from "../db/mongo_connection.mjs";

const router = express.Router();

router.get("/wiki", async (req, res) => {
    let collection = await mongo_db.collection("wiki");
    let results = await collection.find({})
        .limit(50)
        .toArray();

    res.send(results).status(200);
});

export default router