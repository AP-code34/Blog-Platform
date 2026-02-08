import express from "express";
import { getCategories, createCategory } from "../controllers/categorycontroller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", verifyToken, createCategory); // Optional: for creating categories

export default router;