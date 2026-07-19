/*
------------------------------------------------
File: storageService.js
Purpose: Manages Cloudinary resource uploads.
Responsibilities: Routes local multipart image, video, and document buffers to Cloudinary assets.
Dependencies: cloudinary config
------------------------------------------------
*/

const cloudinary = require('../config/cloudinary');

module.exports = {
  /*
  Uploads local files directly to Cloudinary.
  Params: localFilePath (string), folderName (string).
  Returns: Cloudinary upload result object containing public URL.
  */
  uploadFile: async (localFilePath, folderName = 'softskills') => {
    try {
      const isPlaceholder = !process.env.CLOUDINARY_CLOUD_NAME || 
                            process.env.CLOUDINARY_CLOUD_NAME.includes('placeholder') ||
                            process.env.CLOUDINARY_CLOUD_NAME === '';

      if (isPlaceholder) {
        console.warn('Using local uploads storage fallback because Cloudinary keys are missing.');
        const filename = require('path').basename(localFilePath);
        return {
          success: true,
          url: `http://localhost:5000/uploads/${filename}`,
          publicId: 'local-placeholder'
        };
      }

      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: folderName,
        resource_type: 'auto'
      });
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Cloudinary upload failure:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }
};
