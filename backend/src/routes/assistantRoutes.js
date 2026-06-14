const express = require('express');
const router = express.Router();
const { assistantQuery } = require('../controllers/assistantController');

router.post('/query', assistantQuery);

module.exports = router;
