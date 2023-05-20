import express from "express";
import {WikiPage} from '../models/Wiki.mjs'

const router = express.Router();

router.get("/wiki", async (req, res) => {
    let results = await WikiPage.find({})
        .limit(50)
        .toArray();

    res.send(results).status(200);
});

export default router