import express from 'express';
import { allBookings, allfavs, bookVisit, cancelBookings, createUser, toFav } from '../controllers/userController.js';

const router = express.Router();

router.post("/register", createUser);
router.post("/bookVisit/:id", bookVisit)
router.post("/allBookings", allBookings)
router.post("/remove_booking/:id",cancelBookings)
router.post("/toFav/:rid", toFav)
router.post("/AllFavs", allfavs)

export {router as userRoute};
