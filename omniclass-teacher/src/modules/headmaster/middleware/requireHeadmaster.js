export default function requireHeadmaster(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const allowed = ["headmaster", "deputy_head"];

  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Management access required" });
  }

  next();
}
