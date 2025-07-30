//import { login } from '../controllers/authController.js'; 
//import { Router } from 'express';      

const { login } = require('../controllers/authController.cjs')
const { Router } = require('express');
const router = Router();

// POST /api/auth/login
router.post('/login', login)

module.exports = router;