import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utils/axios";

const QRScanner = ({ onProductScanned  }) => {
  const scannerRef = useRef(null);
  const lastScannedRef = useRef("");
  const timeoutRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);
  const [productId, setProductId] = useState("");
  // Phát âm thanh khi quét thành công
  const playSuccessSound = () => {
    const audio = new Audio("/success.mp3");
    audio.play();
  };

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(
      async (decodedText, decodedResult) => {
        if (!isScanning) return;

        // Cho phép quét lại sản phẩm cũ để tăng số lượng
        setIsScanning(false);
        lastScannedRef.current = decodedText;
        playSuccessSound();

        try {
          const res = await axiosInstance.get(`/api/product/${decodedText}`);
          console.log("Sản phẩm:", res.data);
          onProductScanned(res.data);
        } catch (err) {
          console.error("Lỗi khi lấy sản phẩm:", err);
        }

        // Tạm dừng quét 1.5s rồi bật lại
        timeoutRef.current = setTimeout(() => {
          setIsScanning(true);
        }, 1000);
      },
      (errorMessage) => {
        // Có thể log lỗi nếu cần: console.warn("QR scan error", errorMessage);
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
      clearTimeout(timeoutRef.current);
    };
  }, [isScanning]);

  return (
    <div className="border p-2 rounded-md">
      {/* <h2 className="text-center font-bold mb-2">Quét mã QR</h2> */}
      <div id="reader" className="w-full" />
    </div>
  );
};

export default QRScanner;
