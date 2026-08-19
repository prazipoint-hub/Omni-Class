import { Router } from "express";
import { asyncHandler } from "../../../utils/http.js";
import * as studentCtrl from "../controllers/student.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import requireStudent from "../middleware/requireStudent.js";

const router = Router();

router.use(authenticate);
router.use(requireStudent);

router.get("/dashboard", asyncHandler(studentCtrl.dashboard));

export default router;
