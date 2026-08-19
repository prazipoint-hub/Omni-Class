import { Student, StudentAttendance, StudentResult } from "../../../models/index.js";

export async function dashboard(req, res) {
  try {
    const student = await Student.findOne({ where: { id: req.user.studentId, schoolId: req.user.schoolId } });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const attendance = await StudentAttendance.findAll({ where: { studentId: student.id }, order: [["date", "DESC"]], limit: 30 });

    const results = await StudentResult.findAll({ where: { studentId: student.id }, order: [["createdAt", "DESC"]], limit: 20 });

    res.json({
      success: true,
      data: {
        student: {
          id: student.id,
          admissionNumber: student.admissionNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          photo: student.photo,
          classId: student.classId
        },
        attendance,
        results
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to load student dashboard" });
  }
}
