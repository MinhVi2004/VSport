const QRCode = require("qrcode");
const cloudinary = require("../utils/cloudinary");

const generateQRCodeAndUpload = async (productId) => {
  try {
    const qrData = `${productId}`; // Tạo mã QR dựa theo ID
    const qrImageDataURL = await QRCode.toDataURL(qrData);

    const uploadResponse = await cloudinary.uploader.upload(qrImageDataURL, {
      folder: "product_qr",
      public_id: `QR_${productId}`,
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Lỗi tạo mã QR:", error);
    return null;
  }
};

module.exports = generateQRCodeAndUpload;
