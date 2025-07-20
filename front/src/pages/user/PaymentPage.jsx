import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const PaymentPage = () => {
  const [qrUrl, setQrUrl] = useState('');

  const handlePay = async () => {
    const res = await axios.post('http://localhost:8080/create-payment', {
      amount: 50000,
      orderId: String(Date.now()),
      orderDesc: 'Thanh toán đơn hàng ABC',
    });

    setQrUrl(res.data.url);
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Thanh toán với VNPay</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handlePay}
      >
        Tạo mã QR thanh toán
      </button>

      {qrUrl && (
        <div className="mt-6">
          <QRCode value={qrUrl} size={256} />
          <p className="mt-2 text-gray-600">Quét mã QR bằng app ngân hàng</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
