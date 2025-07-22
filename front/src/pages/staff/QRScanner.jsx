import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import axios from "axios";

const QRScanner = ({ onProductScanned }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(async (text) => {
      try {
        const productId = text.split("/").pop();
        const res = await axios.get(`/api/product/${productId}`);
        onProductScanned(res.data);
      } catch (err) {
        console.error("Lỗi khi quét mã QR:", err);
      }
    });

    return () => scanner.clear();
  }, []);

  return <div id="reader" className="w-full h-full" />;
};

export default QRScanner;
