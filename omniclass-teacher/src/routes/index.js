import { Router } from "express";
import teacherRoutes from "./teacher.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/api/v1/teacher", teacherRoutes);
router.use("/api/v1/auth", authRoutes);

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "omniclass-teacher-module" });
});

export default router;
