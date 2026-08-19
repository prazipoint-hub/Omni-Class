import { Parent } from "../models/index.js";

export async function findParentIdByUserId(userId) {
  const parent = await Parent.findOne({ where: { userId } });
  return parent ? parent.id : null;
}
