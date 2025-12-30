const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('./upload.controller');

const upload = multer({ dest: 'uploads/' });

// Upload File
router.post('/upload', upload.single('imgUrl'), (req, res) =>
  uploadController.uploadFile(req, res)
);

// Delete File
router.delete('/delete', (req, res) =>
  uploadController.deleteFile(req, res)
);

module.exports = router;
