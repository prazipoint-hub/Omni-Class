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

// Approvals
router.get("/approvals", asyncHandler(headmasterCtrl.listApprovals));
router.get("/approvals/:id", asyncHandler(headmasterCtrl.getApproval));
router.post("/approvals/:id/approve", asyncHandler(headmasterCtrl.approveApproval));
router.post("/approvals/:id/reject", asyncHandler(headmasterCtrl.rejectApproval));

export default router;
