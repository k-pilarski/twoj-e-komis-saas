// server/src/routes/public.routes.js
import { Router } from "express";
import { getPublicStorefront } from "../controllers/public.controller.js";

const router = Router();

// Publiczny endpoint: GET /api/public/komis/:slug
router.get('/komis/:slug', getPublicStorefront);

export default router;