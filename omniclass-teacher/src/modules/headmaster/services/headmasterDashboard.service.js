import { Student, Teacher, Class, Subject, AttendanceSession, AttendanceRecord, Assessment, Mark, Homework, HomeworkSubmission, Approval } from "../../models/index.js";
import { Op } from "sequelize";

export async function getDashboard(schoolId) {
  const today = new Date().toISOString().slice(0, 10);

  // Basic counts
  const [studentsCount, teachersCount, classesCount, subjectsCount] = await Promise.all([
    Student.count({ where: { schoolId, status: "active" } }),
    Teacher.count({ where: { schoolId, status: "active" } }),
    Class.count({ where: { schoolId } }),
    Subject.count({ where: { schoolId } })
  ]);

  // Attendance today (students)
  const attendanceRecords = await AttendanceRecord.findAll({
    include: [
      {
        model: AttendanceSession,
        where: { schoolId, date: today }
      }
    ]
  });

  const presentCount = attendanceRecords.filter((r) => r.status === "present").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "absent").length;
  const lateCount = attendanceRecords.filter((r) => r.status === "late").length;

  // Teachers present today: distinct teacherIds with attendance sessions today
  const teacherSessions = await AttendanceSession.findAll({ where: { schoolId, date: today } });
  const teachersPresent = Array.from(new Set(teacherSessions.map((s) => s.teacherId))).length;
  const teachersAbsent = Math.max(0, teachersCount - teachersPresent);

  // Classes missing attendance (classes with no attendance session today)
  const classesWithSessions = Array.from(new Set(teacherSessions.map((s) => s.classId)));
  const classesMissingAttendance = await Class.count({ where: { schoolId, id: { [Op.notIn]: classesWithSessions.length ? classesWithSessions : [null] } } });

  // Assignments overdue
  const overdueAssignments = await Homework.count({ where: { schoolId, dueDate: { [Op.lt]: today }, status: "published" } });

  // Lessons recorded vs expected
  const expectedLessons = await TeachingAssignment.count({ where: { schoolId } });
  // approximate: lessons recorded = attendance sessions created today
  const lessonsRecorded = teacherSessions.length;
  const lessonCompletion = expectedLessons > 0 ? Math.round((lessonsRecorded / expectedLessons) * 1000) / 10 : 100;

  // Pending approvals summary
  const approvalsSummary = {};
  const approvalCounts = await Approval.findAll({ where: { schoolId }, attributes: ["type", ["status", "status"], [Approval.sequelize.fn("COUNT", Approval.sequelize.col("id")), "count"]], group: ["type", "status"] });
  // Convert into a map
  for (const row of approvalCounts) {
    const t = row.get("type");
    const s = row.get("status");
    const c = row.get("count");
    approvalsSummary[t] = approvalsSummary[t] || {};
    approvalsSummary[t][s] = Number(c);
  }

  // Academic averages (simple approach): fetch marks and compute average percentage
  const marks = await Mark.findAll({ include: [{ model: Assessment }] });
  let overallAvg = null;
  if (marks.length) {
    let totalPct = 0;
    let count = 0;
    for (const m of marks) {
      if (m.mark !== null && m.Assessment && m.Assessment.maxMark) {
        totalPct += (Number(m.mark) / Number(m.Assessment.maxMark)) * 100;
        count++;
      }
    }
    overallAvg = count ? Math.round((totalPct / count) * 10) / 10 : null;
  }

  // Top performing classes: compute average per student's class
  const classAggregates = {};

  for (const m of marks) {
    if (!m.mark) continue;
    const student = m.Student; // Mark model may not include Student here; skip if missing
    if (!student) continue;
    const classId = student.classId || "unknown";
    classAggregates[classId] = classAggregates[classId] || { totalPct: 0, count: 0 };
    if (m.Assessment && m.Assessment.maxMark) {
      classAggregates[classId].totalPct += (Number(m.mark) / Number(m.Assessment.maxMark)) * 100;
      classAggregates[classId].count++;
    }
  }

  const classAverages = [];
  for (const cid of Object.keys(classAggregates)) {
    const ag = classAggregates[cid];
    if (ag.count) classAverages.push({ classId: cid, average: Math.round((ag.totalPct / ag.count) * 10) / 10 });
  }

  classAverages.sort((a, b) => b.average - a.average);

  const topClasses = classAverages.slice(0, 5);
  const bottomClasses = classAverages.slice(-5).reverse();

  // Compose alerts
  const alerts = [];
  if (teachersAbsent > 0) alerts.push({ type: "teachers_absent", message: `${teachersAbsent} teachers absent today`, value: teachersAbsent });
  if (absentCount > 0) alerts.push({ type: "students_absent", message: `${absentCount} students absent today`, value: absentCount });
  if (overdueAssignments > 0) alerts.push({ type: "assignments_overdue", message: `${overdueAssignments} assignments overdue`, value: overdueAssignments });
  if (classesMissingAttendance > 0) alerts.push({ type: "classes_missing_attendance", message: `${classesMissingAttendance} classes missing attendance`, value: classesMissingAttendance });

  return {
    date: today,
    counts: {
      students: studentsCount,
      studentsPresent: presentCount,
      studentsAbsent: absentCount,
      studentsLate: lateCount,
      teachers: teachersCount,
      teachersPresent,
      teachersAbsent
    },
    academics: {
      overallAverage: overallAvg,
      topClasses,
      bottomClasses
    },
    lessons: {
      expectedLessons,
      lessonsRecorded,
      lessonCompletion
    },
    approvals: approvalsSummary,
    alerts
  };
}
