const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { verifyToken } = require('../middleware/verifyToken');

// Route for shortening URL (both logged-in and guest users)
router.post('/shorten', verifyToken, urlController.shortenUrl);

// Route for fetching user URLs (only for logged-in users)
router.get('/getUrl', verifyToken, urlController.getUserUrls);

router.get('/:shortUrlCode', urlController.redirectToOriginalUrl);
router.post('/check',verifyToken, urlController.checkUrl);

module.exports = router;
