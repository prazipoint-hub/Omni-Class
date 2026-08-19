import { Router } from "express";
import { asyncHandler } from "../utils/http.js";
import * as teacher from "../controllers/teacher.controller.js";

import { authenticate, requireTeacher } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);
router.use(requireTeacher);

router.get("/dashboard", asyncHandler(teacher.dashboard));

router.get("/assignments", asyncHandler(teacher.assignments));
router.get("/assignments/:assignmentId/learners", asyncHandler(teacher.learners));

router.post("/attendance", asyncHandler(teacher.createAttendanceSession));
router.put("/attendance/:sessionId", asyncHandler(teacher.updateAttendance));

router.post("/assessments", asyncHandler(teacher.createAssessment));
router.get("/assessments/:assessmentId", asyncHandler(teacher.getAssessment));
router.put("/assessments/:assessmentId/marks", asyncHandler(teacher.saveMarks));

router.post("/schemes", asyncHandler(teacher.createSchemeItem));
router.get("/assignments/:assignmentId/schemes", asyncHandler(teacher.listScheme));
router.put("/schemes/:id", asyncHandler(teacher.updateSchemeItem));

router.post("/lesson-plans", asyncHandler(teacher.createLessonPlan));
router.get("/assignments/:assignmentId/lesson-plans", asyncHandler(teacher.listLessonPlans));

router.post("/homework", asyncHandler(teacher.createHomework));
router.get("/assignments/:assignmentId/homework", asyncHandler(teacher.listHomework));
router.put("/homework/:id/publish", asyncHandler(teacher.publishHomework));
router.put("/homework/submissions/:submissionId", asyncHandler(teacher.markHomework));

export default router;
