const cloudinary = require('../../config/cloudinary');
const fs = require('fs');

class UploadService {
  async uploadFile(filePath) {
    try {
      if (!filePath) {
        throw new Error('File path is required');
      }

      const result = await cloudinary.uploader.upload(filePath);
      fs.unlinkSync(filePath);

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (err) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw new Error(`Upload failed: ${err.message}`);
    }
  }

  async deleteFile(publicId) {
    try {
      if (!publicId) {
        throw new Error('Public ID is required');
      }

      await cloudinary.uploader.destroy(publicId);
      return { success: true };
    } catch (err) {
      throw new Error(`Deletion failed: ${err.message}`);
    }
  }
}

module.exports = new UploadService();
