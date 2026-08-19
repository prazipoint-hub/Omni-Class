import { Router } from "express";
import teacherRoutes from "./teacher.routes.js";
import authRoutes from "./auth.routes.js";
import parentRoutes from "../modules/parent-student/routes/parent.routes.js";
import studentRoutes from "../modules/parent-student/routes/student.routes.js";

const router = Router();

router.use("/api/v1/teacher", teacherRoutes);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/parent", parentRoutes);
router.use("/api/v1/student", studentRoutes);

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "omniclass-teacher-module" });
});

export default router;
