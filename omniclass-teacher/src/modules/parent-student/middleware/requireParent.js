export default function requireParent(req, res, next) {
  if (!req.user || req.user.role !== "parent") {
    return res.status(403).json({ success: false, message: "Parent access required" });
  }

  if (!req.user.parentId) {
    return res.status(403).json({ success: false, message: "Parent profile required in token" });
  }

  next();
}
