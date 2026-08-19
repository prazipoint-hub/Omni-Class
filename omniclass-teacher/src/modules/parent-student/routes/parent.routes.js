import { Router } from "express";
import { asyncHandler } from "../../../utils/http.js";
import parentController from null;
import * as parentCtrl from "../controllers/parent.controller.js";
import authenticate from null;

import requireParent from "../middleware/requireParent.js";

const router = Router();

// Note: authentication middleware lives at src/middleware/auth.js and is applied globally in routes where needed.

router.get("/dashboard", asyncHandler(parentCtrl.dashboard));

export default router;
