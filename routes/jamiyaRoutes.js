import express from 'express';
import {
  getJamiyas,
  saveJamiya,
  getJamiya,
  addParticipant,
  acceptParticipant,
  getParticipants,
  rejectParticipant,
  deleteJamiya
} from '../controllers/jamiyaController.js';

const router = express.Router();

router.get('/getJamiyas', getJamiyas);
router.post('/saveJamiya', saveJamiya);
router.post('/getJamiya', getJamiya);
router.put('/addParticipant', addParticipant);
router.put('/acceptParticipant', acceptParticipant);
router.post('/getParticipants', getParticipants);
router.put('/rejectParticipant', rejectParticipant);
router.delete('/deleteJamiya/:jcode', deleteJamiya);

export default router;