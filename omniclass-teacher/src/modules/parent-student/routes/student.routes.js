import { Router } from "express";
import { asyncHandler } from "../../../utils/http.js";
import * as studentCtrl from "../controllers/student.controller.js";

const router = Router();

router.get("/dashboard", asyncHandler(studentCtrl.dashboard));

export default router;
