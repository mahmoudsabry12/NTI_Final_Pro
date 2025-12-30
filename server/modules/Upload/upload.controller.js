const uploadService = require('./upload.service');

class UploadController {
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file provided',
        });
      }

      const result = await uploadService.uploadFile(req.file.path);
      res.json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  async deleteFile(req, res) {
    const { publicId } = req.body;

    try {
      if (!publicId) {
        return res.status(400).json({
          success: false,
          error: 'Public ID is required',
        });
      }

      const result = await uploadService.deleteFile(publicId);
      res.json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
}

module.exports = new UploadController();
