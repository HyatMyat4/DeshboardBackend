const express = require('express');
const router = express.Router();
const {
    Login,
    Verify
} = require('../controllers/auth')

router.post("/login", Login)
router.post("/Verify", Verify)

module.exports = router
