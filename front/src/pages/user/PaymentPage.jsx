import React from 'react';
import QRCode from 'react-qr-code';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const qrUrl = location.state?.qrUrl;
  const navigate = useNavigate();

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Thanh toán với VNPay</h1>

      {qrUrl ? (
        <>
          <QRCode value={qrUrl} size={256} />
          <p className="mt-2 text-gray-600">Quét mã QR bằng app ngân hàng</p>
        </>
      ) : (
        <>
          <p className="text-red-600">Không có mã QR để hiển thị</p>
          <button
            className="mt-4 text-blue-600 underline"
            onClick={() => navigate('/checkout')}
          >
            Quay lại trang đặt hàng
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentPage;
