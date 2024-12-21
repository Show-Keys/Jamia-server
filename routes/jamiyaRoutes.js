import express from 'express';
import {
  getJamiyas,
  saveJamiya,
  getJamiya,
  addParticipant,
  acceptParticipant,
  getParticipants,
  rejectParticipant,
} from '../controllers/jamiyaController.js';

const router = express.Router();

router.get('/getJamiyas', getJamiyas);
router.post('/saveJamiya', saveJamiya);
router.post('/getJamiya', getJamiya);
router.put('/addParticipant', addParticipant);
router.put('/acceptParticipant', acceptParticipant);
router.post('/getParticipants', getParticipants);
router.put('/rejectParticipant', rejectParticipant);

export default router;