const express = require('express');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('imgUrl'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);

        fs.unlinkSync(req.file.path);

        res.json({ success: true, url: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
