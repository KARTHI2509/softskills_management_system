/*
------------------------------------------------
File: certificateRoutes.js
Purpose: Maps certified verification actions.
Dependencies: express, certificateController, authMiddleware
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, certificateController.listCertificates);
router.post('/claim', protect, certificateController.claimCertificate);

module.exports = router;
