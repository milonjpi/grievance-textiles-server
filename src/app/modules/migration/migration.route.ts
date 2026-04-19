import express from 'express';
import { MigrationController } from './migration.controller';

const router = express.Router();

// employee
router.post('/employee', MigrationController.insertEmployee);

// card
router.post('/card', MigrationController.insertCard);

export const MigrationRoutes = router;
