export default function requireStudent(req, res, next) {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({ success: false, message: "Student access required" });
  }

  if (!req.user.studentId) {
    return res.status(403).json({ success: false, message: "Student profile required in token" });
  }

  next();
}
