import { Router } from 'express';
import multer from 'multer';
import { ExplanationController } from '../controllers/explanation.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/explain
// Expects multipart/form-data with 'text' field and optional 'image' file
router.post('/', upload.single('file'), ExplanationController.explain);

export default router;
