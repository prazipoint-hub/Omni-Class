import { getDashboard } from "../services/headmasterDashboard.service.js";

export async function dashboard(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const data = await getDashboard(schoolId);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to load dashboard" });
  }
}

export async function attendanceSummary(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const data = await getDashboard(schoolId); // reuse for now; could add more detailed breakdown
    res.json({ success: true, data: data.counts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to load attendance summary" });
  }
}
