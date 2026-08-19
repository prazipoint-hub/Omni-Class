import { getDashboard } from "../services/headmasterDashboard.service.js";
import { Approval } from "../../models/index.js";
import { assert } from "../../utils/http.js";

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

// ==================================================
// APPROVALS
// ==================================================

export async function listApprovals(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const rows = await Approval.findAll({ where: { schoolId }, order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to list approvals" });
  }
}

export async function getApproval(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const id = req.params.id;
    const row = await Approval.findOne({ where: { id, schoolId } });
    assert(row, "Approval not found", 404);
    res.json({ success: true, data: row });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to get approval" });
  }
}

export async function approveApproval(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const id = req.params.id;

    const row = await Approval.findOne({ where: { id, schoolId } });
    assert(row, "Approval not found", 404);

    assert(row.status !== "approved", "Approval already approved", 409);
    assert(row.status !== "rejected", "Approval already rejected", 409);

    row.status = "approved";
    row.reviewedBy = req.user.userId;
    row.reviewedAt = new Date();

    await row.save();

    // TODO: emit notification/event for requester

    res.json({ success: true, data: row });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to approve" });
  }
}

export async function rejectApproval(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const id = req.params.id;

    const row = await Approval.findOne({ where: { id, schoolId } });
    assert(row, "Approval not found", 404);

    assert(row.status !== "approved", "Approval already approved", 409);
    assert(row.status !== "rejected", "Approval already rejected", 409);

    row.status = "rejected";
    row.reviewedBy = req.user.userId;
    row.reviewedAt = new Date();

    await row.save();

    // TODO: emit notification/event for requester

    res.json({ success: true, data: row });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to reject" });
  }
}
