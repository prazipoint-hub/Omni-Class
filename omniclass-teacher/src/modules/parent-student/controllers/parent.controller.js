import { Parent, ParentStudent, Student, StudentAttendance, StudentResult } from "../../../models/index.js";

export async function dashboard(req, res) {
  try {
    const parent = await Parent.findOne({ where: { id: req.user.parentId, schoolId: req.user.schoolId } });

    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent profile not found" });
    }

    const relationships = await ParentStudent.findAll({ where: { parentId: parent.id } });

    const students = [];

    for (const relationship of relationships) {
      const student = await Student.findOne({ where: { id: relationship.studentId, schoolId: req.user.schoolId } });
      if (!student) continue;

      const attendance = await StudentAttendance.findAll({ where: { studentId: student.id }, limit: 30, order: [["date", "DESC"]] });

      const results = await StudentResult.findAll({ where: { studentId: student.id }, limit: 10, order: [["createdAt", "DESC"]] });

      students.push({
        id: student.id,
        name: `${student.firstName || ""} ${student.lastName || ""}`,
        admissionNumber: student.admissionNumber,
        photo: student.photo,
        classId: student.classId,
        relationship: relationship.relationship,
        attendance,
        recentResults: results
      });
    }

    res.json({ success: true, data: { parent: { id: parent.id }, children: students } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to load dashboard" });
  }
}
