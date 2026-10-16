// server/src/routes/vehicle.routes.js
import { Router } from "express";
import { requireAuth, requireActiveTenant } from "../middleware/auth.middleware.js";
import { 
  getVehicles,
  getVehicle,
  createVehicle, 
  updateVehicle, 
  deleteVehicle 
} from "../controllers/vehicle.controller.js";

const router = Router();

// Wymaga poprawnego tokenu JWT ORAZ aktywnego statusu konta (ACTIVE)
router.use(requireAuth, requireActiveTenant);

router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;