import { Router } from "express";
import { requireAuth, requireActiveTenant } from "../middleware/auth.middleware.js";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";

const router = Router();

// Zabezpieczenie ścieżek - wymaga poprawnego tokenu i opłaconego konta
router.use(requireAuth, requireActiveTenant);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;