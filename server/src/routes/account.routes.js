// server/src/routes/account.routes.js
import { Router } from "express";
import { requireAuth, requireActiveTenant } from "../middleware/auth.middleware.js";
import {
  getAccountDetails,
  updateAccountProfile,
  changeAccountPassword
} from "../controllers/account.controller.js";

const router = Router();

router.use(requireAuth, requireActiveTenant);

router.get('/', getAccountDetails);
router.put('/profile', updateAccountProfile);
router.put('/password', changeAccountPassword);

export default router;