import { Router } from "express";
import { asyncHandler } from "../utils/http.js";
import * as auth from "../controllers/auth.controller.js";

const router = Router();

// Public auth routes
router.post("/register", asyncHandler(auth.register));
router.post("/login", asyncHandler(auth.login));

export default router;
