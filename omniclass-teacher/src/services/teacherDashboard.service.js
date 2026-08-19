import {
  Teacher,
  TeachingAssignment,
  Class,
  Subject,
  Enrollment,
  Assessment,
  AttendanceSession,
  Homework
} from "../models/index.js";

import { Op } from "sequelize";

export async function getDashboard(teacherId, schoolId) {
  const teacher = await Teacher.findOne({ where: { id: teacherId, schoolId } });

  if (!teacher) return null;

  const assignments = await TeachingAssignment.findAll({ where: { teacherId, schoolId }, include: [Class, Subject] });

  const assignmentIds = assignments.map((a) => a.id);

  const today = new Date().toISOString().slice(0, 10);

  const [pendingAssessments, todayAttendance, upcomingHomework, learners] = await Promise.all([
    Assessment.count({ where: { teachingAssignmentId: { [Op.in]: assignmentIds }, status: { [Op.in]: ["open", "draft"] } } }),
    AttendanceSession.count({ where: { teacherId, schoolId, date: today, status: { [Op.ne]: "locked" } } }),
    Homework.findAll({ where: { teachingAssignmentId: { [Op.in]: assignmentIds }, dueDate: { [Op.gte]: today }, status: "published" }, limit: 5, order: [["dueDate", "ASC"]] }),
    Enrollment.count({ where: { schoolId } })
  ]);

  return {
    teacher: { id: teacher.id, name: `${teacher.firstName} ${teacher.lastName}`, employeeNumber: teacher.employeeNumber },
    metrics: { classes: assignments.length, pendingAssessments, attendanceToday: todayAttendance, learnersInSchool: learners },
    teachingAssignments: assignments.map((assignment) => ({ id: assignment.id, class: assignment.Class?.name, subject: assignment.Subject?.name, isClassTeacher: assignment.isClassTeacher })),
    upcomingHomework
  };
}
