const { nanoid } = require('nanoid');
const Url = require('../models/Url');

exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }

    // Generate a short URL using nanoid
    const shortUrlCode = nanoid(8); // 8 characters long
    const shortUrl = shortUrlCode;

    // Create the URL document
    const urlData = {
      originalUrl,
      shortUrl,
      user: req.user ? req.user.userId : null // Attach user ID if authenticated
    };

    const url = new Url(urlData);
    await url.save();

    res.json({ message: 'URL shortened successfully', shortUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkUrl = async (req, res) => {

  if (!req.user || !req.user.userId) {
    res.json({ shortUrl: null });
  } else {
    const { originalUrl } = req.body;

    try {
      const url = await Url.findOne({ originalUrl });

      if (url) {
        res.json({ shortUrl: url.shortUrl });
      } else {
        res.json({ shortUrl: null });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
    }
};


exports.getUserUrls = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(403).json({ message: 'Not authenticated' });
    }

    const urls = await Url.find({ user: req.user.userId });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortUrlCode } = req.params; // Extract short URL code from request parameters
    const url = await Url.findOne({ shortUrl: shortUrlCode });
    
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
