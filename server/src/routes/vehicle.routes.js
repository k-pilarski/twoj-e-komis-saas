import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { 
  getVehicles, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle 
} from "../controllers/vehicle.controller.js";

const router = Router();

router.use(requireAuth);

router.get('/', getVehicles);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;