import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User, Teacher, Parent, Student } from "../models/index.js";
import { assert } from "../utils/http.js";

export async function register(req, res) {
  const { email, password, role = "teacher", schoolId, firstName, lastName, employeeNumber } = req.body;

  assert(email && password && schoolId, "email, password and schoolId are required");

  const existing = await User.findOne({ where: { email } });
  assert(!existing, "User with that email already exists", 409);

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  let relatedId = null;

  if (role === "teacher") {
    const teacher = await Teacher.create({ schoolId, userId: null, employeeNumber: employeeNumber || `EMP-${Date.now()}`, firstName: firstName || "", lastName: lastName || "", email });
    relatedId = { teacherId: teacher.id };
  } else if (role === "parent") {
    // create a parent record if desired, but default policy is admin-created; skip automatic parent creation here
  } else if (role === "student") {
    // students are normally created via admin flows; skip here
  }

  const user = await User.create({ email, passwordHash, role, schoolId, teacherId: relatedId?.teacherId || null });

  if (relatedId && relatedId.teacherId) {
    await Teacher.update({ userId: user.id }, { where: { id: relatedId.teacherId } });
  }

  res.status(201).json({ id: user.id, email: user.email, role: user.role, teacherId: user.teacherId });
}

export async function login(req, res) {
  const { email, password } = req.body;

  assert(email && password, "email and password required");

  const user = await User.findOne({ where: { email } });
  assert(user, "Invalid credentials", 401);

  const ok = await bcrypt.compare(password, user.passwordHash);
  assert(ok, "Invalid credentials", 401);

  // Attempt to find related parent/student records to include in token
  const parent = await Parent.findOne({ where: { userId: user.id } });
  const student = await Student.findOne({ where: { userId: user.id } });

  const payload = {
    userId: user.id,
    role: user.role,
    schoolId: user.schoolId,
    teacherId: user.teacherId || null,
    parentId: parent ? parent.id : null,
    studentId: student ? student.id : null
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "8h" });

  res.json({ token, user: { id: user.id, email: user.email, role: user.role, teacherId: user.teacherId, parentId: payload.parentId, studentId: payload.studentId } });
}
