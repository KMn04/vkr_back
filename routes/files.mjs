import express from "express";
import { ImageModel } from "../models/ImageModel.mjs";

const router = express.Router();

// получить все статусы
router.get("/:fileId", async (req, res) => {
  try{
    const result = await ImageModel.findById(req.params.fileId)
    res.contentType = result.img.contentType;
    res.write(result.img.data, 'binary');
    res.end(null, 'binary')
} catch (err) {
    res.status(500).send(err);
}
});

export default router