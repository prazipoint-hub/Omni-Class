#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { sequelize, User, Teacher, Student, Parent, ParentStudent } from "./src/models/index.js";

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const schoolId = process.env.SEED_SCHOOL_ID || null;

    // Create admin user
    const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
    const existing = await User.findOne({ where: { email: adminEmail } });
    if (!existing) {
      const hash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "password", 10);
      const admin = await User.create({ email: adminEmail, passwordHash: hash, role: "admin", schoolId: schoolId || null });
      console.log("Created admin user:", admin.email);
    } else {
      console.log("Admin already exists");
    }

    // Create demo headmaster
    const headEmail = process.env.SEED_HEADMASTER_EMAIL || "headmaster@example.com";
    const existingHead = await User.findOne({ where: { email: headEmail } });
    if (!existingHead) {
      const hash = await bcrypt.hash(process.env.SEED_HEADMASTER_PASSWORD || "password", 10);
      const head = await User.create({ email: headEmail, passwordHash: hash, role: "headmaster", schoolId: schoolId || null });
      console.log("Created demo headmaster:", head.email);
    } else {
      console.log("Headmaster already exists");
    }

    // Optionally create sample student and parent for testing
    const student = await Student.create({ schoolId: schoolId || null, admissionNumber: `S-${Date.now()}`, firstName: "Demo", lastName: "Student" });
    const parentUser = await User.create({ email: `parent+${Date.now()}@example.com`, passwordHash: await bcrypt.hash("password", 10), role: "parent", schoolId: schoolId || null });
    const parent = await Parent.create({ schoolId: schoolId || null, userId: parentUser.id, relationship: "GUARDIAN" });
    await ParentStudent.create({ parentId: parent.id, studentId: student.id, relationship: "GUARDIAN", isPrimary: true });

    console.log("Seeded demo student and parent");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
