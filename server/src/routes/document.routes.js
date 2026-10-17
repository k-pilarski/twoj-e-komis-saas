// server/src/routes/document.routes.js
import { Router } from "express";
import { requireAuth, requireActiveTenant } from "../middleware/auth.middleware.js";
import { createSaleAgreement } from "../controllers/document.controller.js";

const router = Router();

// Tylko zalogowany właściciel z opłaconym komisem może generować dokumenty
router.use(requireAuth, requireActiveTenant);

router.post('/sale-agreement', createSaleAgreement);

export default router;