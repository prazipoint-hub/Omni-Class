import {
  Teacher,
  TeachingAssignment,
  Class,
  Subject,
  Enrollment,
  Student,
  AttendanceSession,
  AttendanceRecord,
  Assessment,
  Mark,
  SchemeOfWork,
  LessonPlan,
  Homework,
  HomeworkSubmission
} from "../models/index.js";

import { getDashboard } from "../services/teacherDashboard.service.js";
import { assert } from "../utils/http.js";

// DASHBOARD
export async function dashboard(req, res) {
  const data = await getDashboard(req.user.teacherId, req.user.schoolId);

  assert(data, "Teacher not found", 404);

  res.json(data);
}

// TEACHING ASSIGNMENTS
export async function assignments(req, res) {
  const rows = await TeachingAssignment.findAll({
    where: { teacherId: req.user.teacherId, schoolId: req.user.schoolId },
    include: [Class, Subject],
    order: [["createdAt", "DESC"]]
  });

  res.json(rows);
}

// LEARNERS
export async function learners(req, res) {
  const { assignmentId } = req.params;

  const assignment = await TeachingAssignment.findOne({
    where: { id: assignmentId, teacherId: req.user.teacherId, schoolId: req.user.schoolId }
  });

  assert(assignment, "Teaching assignment not found", 404);

  const rows = await Enrollment.findAll({
    where: { schoolId: req.user.schoolId, classId: assignment.classId },
    include: [
      {
        model: Student,
        where: { status: "active" }
      }
    ]
  });

  res.json(rows.map((row) => row.Student));
}

// ATTENDANCE
export async function createAttendanceSession(req, res) {
  const { classId, subjectId, date, period, records = [] } = req.body;

  const session = await AttendanceSession.create({
    schoolId: req.user.schoolId,
    teacherId: req.user.teacherId,
    classId,
    subjectId,
    date,
    period
  });

  if (records.length) {
    await AttendanceRecord.bulkCreate(
      records.map((record) => ({
        attendanceSessionId: session.id,
        studentId: record.studentId,
        status: record.status,
        note: record.note || null
      }))
    );
  }

  const result = await AttendanceSession.findByPk(session.id, { include: [AttendanceRecord] });

  res.status(201).json(result);
}

export async function updateAttendance(req, res) {
  const { sessionId } = req.params;

  const session = await AttendanceSession.findOne({
    where: { id: sessionId, teacherId: req.user.teacherId, schoolId: req.user.schoolId }
  });

  assert(session, "Attendance session not found", 404);
  assert(session.status !== "locked", "Attendance session is locked", 409);

  await AttendanceRecord.destroy({ where: { attendanceSessionId: sessionId } });

  await AttendanceRecord.bulkCreate((req.body.records || []).map((record) => ({
    attendanceSessionId: sessionId,
    studentId: record.studentId,
    status: record.status,
    note: record.note || null
  })));

  session.status = "submitted";
  await session.save();

  const result = await AttendanceSession.findByPk(sessionId, { include: [AttendanceRecord] });

  res.json(result);
}

// ASSESSMENTS
export async function createAssessment(req, res) {
  const assignment = await TeachingAssignment.findOne({
    where: { id: req.body.teachingAssignmentId, teacherId: req.user.teacherId, schoolId: req.user.schoolId }
  });

  assert(assignment, "Teaching assignment not found", 404);

  const assessment = await Assessment.create({ ...req.body, schoolId: req.user.schoolId });

  res.status(201).json(assessment);
}

export async function getAssessment(req, res) {
  const assessment = await Assessment.findOne({
    where: { id: req.params.assessmentId, schoolId: req.user.schoolId },
    include: [
      {
        model: TeachingAssignment,
        where: { teacherId: req.user.teacherId },
        include: [Class, Subject]
      }
    ]
  });

  assert(assessment, "Assessment not found", 404);

  const marks = await Mark.findAll({ where: { assessmentId: assessment.id }, include: [Student] });

  res.json({ assessment, marks });
}

export async function saveMarks(req, res) {
  const assessment = await Assessment.findOne({
    where: { id: req.params.assessmentId, schoolId: req.user.schoolId },
    include: [
      {
        model: TeachingAssignment,
        where: { teacherId: req.user.teacherId }
      }
    ]
  });

  assert(assessment, "Assessment not found", 404);
  assert(assessment.status !== "locked", "Assessment is locked", 409);

  for (const item of req.body.marks || []) {
    assert(item.mark === null || Number(item.mark) >= 0, "Mark cannot be negative");
    assert(item.mark === null || Number(item.mark) <= Number(assessment.maxMark), `Mark exceeds maximum of ${assessment.maxMark}`);

    await Mark.upsert({
      assessmentId: assessment.id,
      studentId: item.studentId,
      mark: item.mark,
      comment: item.comment || null,
      enteredBy: req.user.teacherId
    });
  }

  assessment.status = "submitted";
  await assessment.save();

  const marks = await Mark.findAll({ where: { assessmentId: assessment.id }, include: [Student] });

  res.json(marks);
}

// SCHEMES
export async function createSchemeItem(req, res) {
  const assignment = await TeachingAssignment.findOne({
    where: { id: req.body.teachingAssignmentId, teacherId: req.user.teacherId, schoolId: req.user.schoolId }
  });

  assert(assignment, "Teaching assignment not found", 404);

  const scheme = await SchemeOfWork.create({ ...req.body, schoolId: req.user.schoolId });

  res.status(201).json(scheme);
}

export async function listScheme(req, res) {
  const assignment = await TeachingAssignment.findOne({
    where: { id: req.params.assignmentId, teacherId: req.user.teacherId, schoolId: req.user.schoolId }
  });

  assert(assignment, "Teaching assignment not found", 404);

  const schemes = await SchemeOfWork.findAll({ where: { teachingAssignmentId: assignment.id }, order: [["term", "ASC"], ["week", "ASC"]] });

  res.json(schemes);
}

export async function updateSchemeItem(req, res) {
  const row = await SchemeOfWork.findOne({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    include: [
      {
        model: TeachingAssignment,
        where: { teacherId: req.user.teacherId }
      }
    ]
  });

  assert(row, "Scheme item not found", 404);

  await row.update(req.body);

  if (req.body.status === "completed") {
    row.completedAt = new Date();
    await row.save();
  }

  res.json(row);
}

// LESSON PLANS
export async function createLessonPlan(req, res) {
  const assignment = await TeachingAssignment.findOne({
    where: { id: req.body.teachingAssignmentId, teacherId: req.user.teacherId, schoolId: req.user.schoolId }
  });

  assert(assignment, "Teaching assignment not found", 404);

  const lesson = await LessonPlan.create({ ...req.body, schoolId: req.user.schoolId });

  res.status(201).json(lesson);
}

export async function listLessonPlans(req, res) {
  const assignment = await TeachingAssignment.findOne({
    where: { id: req.params.assignmentId, teacherId: req.user.teacherId, schoolId: req.user.schoolId }
  });

  assert(assignment, "Teaching assignment not found", 404);

  const lessons = await LessonPlan.findAll({ where: { teachingAssignmentId: assignment.id }, order: [["lessonDate", "DESC"]] });

  res.json(lessons);
}

// HOMEWORK
export async function createHomework(req, res) {
  const assignment = await TeachingAssignment.findOne({
    where: { id: req.body.teachingAssignmentId, teacherId: req.user.teacherId, schoolId: req.user.schoolId }
  });

  assert(assignment, "Teaching assignment not found", 404);

  const homework = await Homework.create({ ...req.body, schoolId: req.user.schoolId });

  res.status(201).json(homework);
}

export async function listHomework(req, res) {
  const assignment = await TeachingAssignment.findOne({
    where: { id: req.params.assignmentId, teacherId: req.user.teacherId, schoolId: req.user.schoolId }
  });

  assert(assignment, "Teaching assignment not found", 404);

  const homework = await Homework.findAll({ where: { teachingAssignmentId: assignment.id }, include: [HomeworkSubmission], order: [["dueDate", "DESC"]] });

  res.json(homework);
}

export async function publishHomework(req, res) {
  const homework = await Homework.findOne({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    include: [
      {
        model: TeachingAssignment,
        where: { teacherId: req.user.teacherId }
      }
    ]
  });

  assert(homework, "Homework not found", 404);

  homework.status = "published";
  await homework.save();

  res.json(homework);
}

export async function markHomework(req, res) {
  const submission = await HomeworkSubmission.findOne({
    where: { id: req.params.submissionId },
    include: [
      {
        model: Homework,
        where: { schoolId: req.user.schoolId },
        include: [
          {
            model: TeachingAssignment,
            where: { teacherId: req.user.teacherId }
          }
        ]
      }
    ]
  });

  assert(submission, "Submission not found", 404);

  await submission.update({ mark: req.body.mark, feedback: req.body.feedback || null, status: "marked" });

  res.json(submission);
}
