import express from 'express';
import { getResults, addResult } from '../controllers/resultController.js';

const router = express.Router();

router.get('/getresult', getResults);
router.post('/addresult', addResult);

export default router;