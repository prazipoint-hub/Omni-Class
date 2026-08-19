import { Router } from "express";
import { asyncHandler } from "../../../utils/http.js";
import * as parentCtrl from "../controllers/parent.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import requireParent from "../middleware/requireParent.js";

const router = Router();

// Protect parent endpoints
router.use(authenticate);
router.use(requireParent);

// Dashboard
router.get("/dashboard", asyncHandler(parentCtrl.dashboard));

// Additional parent endpoints may be added here

export default router;
