import express from "express";
import { updateProfile, changePassword } from "../controllers/usercontroller.js";
import { verifyToken } from "../middleware/verifyToken.js"; //

const router = express.Router();

router.patch("/update", verifyToken, updateProfile);
router.patch("/change-password", verifyToken, changePassword);

export default router;