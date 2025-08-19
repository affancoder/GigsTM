const cloudinary = require('cloudinary').v2;

// CLOUDINARY_URL can be used directly (cloudinary://<key>:<secret>@<cloud_name>)
// or set individual env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
} else if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  console.warn('Cloudinary is not configured. Please set CLOUDINARY_URL or individual Cloudinary env vars.');
}

module.exports = cloudinary;
