import { Router } from "express";
import { asyncHandler } from "../../../utils/http.js";
import * as headmasterCtrl from "../controllers/headmaster.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import requireHeadmaster from "../middleware/requireHeadmaster.js";

const router = Router();

router.use(authenticate);
router.use(requireHeadmaster);

router.get("/dashboard", asyncHandler(headmasterCtrl.dashboard));
router.get("/attendance/summary", asyncHandler(headmasterCtrl.attendanceSummary));

export default router;
