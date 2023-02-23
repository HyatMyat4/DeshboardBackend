const express = require('express');
const router = express.Router();

const { CheckOut } = require('../controllers/CheckOut')
const { WEb_Hook } = require('../controllers/Webhook')

router.post("/", CheckOut)
router.post("/WebHook",express.raw({type: 'application/json'}) , WEb_Hook)

module.exports = router