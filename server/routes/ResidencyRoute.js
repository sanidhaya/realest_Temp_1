import { getAllResidencies,createResidency, getResidency } from '../controllers/residency_controller.js';

import express from 'express';

const router = express.Router();

router.post("/create", createResidency)
router.get("/allresd", getAllResidencies)
router.get("/:id",getResidency)

export {router as residencyRoute};