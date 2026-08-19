import { sequelize } from "../config/database.js";

import User from "./User.js";
import Teacher from "./Teacher.js";
import Class from "./Class.js";
import Subject from "./Subject.js";
import TeachingAssignment from "./TeachingAssignment.js";

import Student from "./Student.js";
import Enrollment from "./Enrollment.js";

import AttendanceSession from "./AttendanceSession.js";
import AttendanceRecord from "./AttendanceRecord.js";

import Assessment from "./Assessment.js";
import Mark from "./Mark.js";

import SchemeOfWork from "./SchemeOfWork.js";
import LessonPlan from "./LessonPlan.js";

import Homework from "./Homework.js";
import HomeworkSubmission from "./HomeworkSubmission.js";

// --------------------------------------------------
// TEACHING ASSIGNMENTS
// --------------------------------------------------

Teacher.hasMany(TeachingAssignment, { foreignKey: "teacherId" });
TeachingAssignment.belongsTo(Teacher, { foreignKey: "teacherId" });

Class.hasMany(TeachingAssignment, { foreignKey: "classId" });
TeachingAssignment.belongsTo(Class, { foreignKey: "classId" });

Subject.hasMany(TeachingAssignment, { foreignKey: "subjectId" });
TeachingAssignment.belongsTo(Subject, { foreignKey: "subjectId" });

// --------------------------------------------------
// ENROLLMENT
// --------------------------------------------------

Class.hasMany(Enrollment, { foreignKey: "classId" });
Enrollment.belongsTo(Class, { foreignKey: "classId" });

Student.hasMany(Enrollment, { foreignKey: "studentId" });
Enrollment.belongsTo(Student, { foreignKey: "studentId" });

// --------------------------------------------------
// ATTENDANCE
// --------------------------------------------------

Class.hasMany(AttendanceSession, { foreignKey: "classId" });
AttendanceSession.belongsTo(Class, { foreignKey: "classId" });

Subject.hasMany(AttendanceSession, { foreignKey: "subjectId" });
AttendanceSession.belongsTo(Subject, { foreignKey: "subjectId" });

AttendanceSession.hasMany(AttendanceRecord, { foreignKey: "attendanceSessionId" });
AttendanceRecord.belongsTo(AttendanceSession, { foreignKey: "attendanceSessionId" });

Student.hasMany(AttendanceRecord, { foreignKey: "studentId" });
AttendanceRecord.belongsTo(Student, { foreignKey: "studentId" });

// --------------------------------------------------
// ASSESSMENTS
// --------------------------------------------------

TeachingAssignment.hasMany(Assessment, { foreignKey: "teachingAssignmentId" });
Assessment.belongsTo(TeachingAssignment, { foreignKey: "teachingAssignmentId" });

Assessment.hasMany(Mark, { foreignKey: "assessmentId" });
Mark.belongsTo(Assessment, { foreignKey: "assessmentId" });

Student.hasMany(Mark, { foreignKey: "studentId" });
Mark.belongsTo(Student, { foreignKey: "studentId" });

// --------------------------------------------------
// SCHEMES
// --------------------------------------------------

TeachingAssignment.hasMany(SchemeOfWork, { foreignKey: "teachingAssignmentId" });
SchemeOfWork.belongsTo(TeachingAssignment, { foreignKey: "teachingAssignmentId" });

// --------------------------------------------------
// LESSON PLANS
// --------------------------------------------------

TeachingAssignment.hasMany(LessonPlan, { foreignKey: "teachingAssignmentId" });
LessonPlan.belongsTo(TeachingAssignment, { foreignKey: "teachingAssignmentId" });

// --------------------------------------------------
// HOMEWORK
// --------------------------------------------------

TeachingAssignment.hasMany(Homework, { foreignKey: "teachingAssignmentId" });
Homework.belongsTo(TeachingAssignment, { foreignKey: "teachingAssignmentId" });

Homework.hasMany(HomeworkSubmission, { foreignKey: "homeworkId" });
HomeworkSubmission.belongsTo(Homework, { foreignKey: "homeworkId" });

Student.hasMany(HomeworkSubmission, { foreignKey: "studentId" });
HomeworkSubmission.belongsTo(Student, { foreignKey: "studentId" });

export {
  sequelize,
  User,
  Teacher,
  Class,
  Subject,
  TeachingAssignment,
  Student,
  Enrollment,
  AttendanceSession,
  AttendanceRecord,
  Assessment,
  Mark,
  SchemeOfWork,
  LessonPlan,
  Homework,
  HomeworkSubmission
};
