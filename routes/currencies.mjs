import express from "express";
import { Currency } from "../models/Currency.mjs";

const router = express.Router();

// получить все валюты
router.get("", async (req, res) => {
    const allCurrencies = await Currency.findAll();
    res.send(allCurrencies).status(200);
});

export default router