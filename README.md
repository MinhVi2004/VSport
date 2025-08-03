
# 🏀 VSport – Nền tảng Thương mại Điện tử

VSport là một nền tảng thương mại điện tử chuyên về sản phẩm thể thao. Người dùng có thể đăng ký, đăng nhập, duyệt sản phẩm, đặt hàng, thanh toán và quản lý đơn hàng. Admin có thể quản lý người dùng, sản phẩm, đơn hàng, và thống kê doanh thu.

## 🔗 Demo

- 🌐 Website: [https://v-sport.vercel.app/](https://v-sport.vercel.app/)
- 📦 GitHub: [https://github.com/MinhVi2004/VSport](https://github.com/MinhVi2004/VSport)

---

## 🗂️ Cấu trúc dự án

```
VSport/
├── client/             # Giao diện người dùng (React + Vite + Tailwind)
│   ├── src/
│   │   ├── pages/      # Các trang (home, product, cart, profile...)
│   │   ├── components/ # Component dùng chung
│   │   ├── utils/      # Axios config, helper functions
│   │   └── ...
│   └── ...
│
├── server/             # Backend API (Node.js + Express)
│   ├── controllers/    # Xử lý logic
│   ├── routes/         # Định tuyến
│   ├── models/         # Schema mongoose
│   ├── middlewares/    # Middleware (Auth, Error Handler)
│   └── ...
│
├── .env                # Biến môi trường
├── README.md
└── package.json
```

---

## ⚙️ Công nghệ sử dụng

| Loại              | Công nghệ chính                                |
|-------------------|--------------------------------------------------|
| **Frontend**      | React, Vite, Tailwind CSS, React Router, Axios  |
| **Backend**       | Node.js, Express.js, MongoDB, Mongoose          |
| **Auth**          | JWT (JSON Web Token)                            |
| **Thanh toán**    | VNPAY API                                       |
| **Media**         | Cloudinary                                      |
| **Khác**          | Toastify, Lucide Icons, SweetAlert, Dotenv      |

---

## 🚀 Các tính năng nổi bật

### 👤 Người dùng:
- Đăng ký, đăng nhập, xác thực bằng JWT
- Cập nhật địa chỉ giao hàng
- Duyệt sản phẩm, tìm kiếm, lọc theo danh mục
- Thêm vào giỏ hàng, đặt hàng
- Thanh toán bằng COD hoặc VNPAY
- Xem và theo dõi trạng thái đơn hàng

### 🛒 Admin:
- Quản lý sản phẩm (thêm, sửa, xóa, ảnh theo màu)
- Quản lý người dùng (bật/tắt tài khoản)
- Quản lý đơn hàng (duyệt, xác nhận giao hàng)
- Thống kê doanh thu theo ngày/tháng

### 👷 Nhân viên (Staff):
- Tạo đơn hàng trực tiếp tại cửa hàng
- Quét mã QR sản phẩm để thêm nhanh vào đơn hàng
- Truy cập hệ thống đơn hàng tạo bởi mình

---

## 🧪 Hướng dẫn cài đặt

### 1. Clone dự án
```bash
git clone https://github.com/MinhVi2004/VSport.git
cd VSport
```

### 2. Cài đặt Frontend
```bash
cd client
npm install
npm run dev
```

### 3. Cài đặt Backend
```bash
cd ../server
npm install
npm run dev
```

### 4. Tạo file `.env` cho backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.mongodb.net/vsport
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

VNPAY_TMN_CODE=your_vnpay_code
VNPAY_HASH_SECRET=your_vnpay_secret
VNPAY_RETURN_URL=http://localhost:5173/payment-success
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```


## 📌 Một số lưu ý

- 💳 Tích hợp thanh toán VNPAY sandbox
- ☁️ Ảnh sản phẩm, avatar, cover, video đều được lưu trên Cloudinary
- 🔐 Tất cả các route quan trọng đều được bảo vệ bằng JWT và role-based access

---

## 👨‍💻 Tác giả

- **Dương Văn Minh Vi** – [GitHub](https://github.com/MinhVi2004)

---

## 📜 Giấy phép

Dự án được phát hành theo giấy phép [MIT](LICENSE).

---

## 💳 Hướng dẫn Thanh toán VNPAY (Chế độ Test)

### ✅ Thông tin thẻ test (NCB)

| Trường             | Giá trị mẫu              |
|--------------------|--------------------------|
| **Ngân hàng**      | NCB                      |
| **Số thẻ**         | 9704198526191432198      |
| **Chủ thẻ**        | NGUYEN VAN A             |
| **Ngày phát hành** | 07/15                    |
| **Mật khẩu OTP**   | 123456                   |

### 🧾 Các bước thanh toán

1. Tại trang thanh toán, chọn phương thức **VNPAY**.
2. Hệ thống sẽ chuyển hướng đến trang VNPAY sandbox:  
   `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
3. Chọn **Thẻ nội địa** (ATM).
4. Nhập thông tin thẻ test ở trên.
5. Nhập mã OTP: `123456` để hoàn tất thanh toán.
6. Kết quả sẽ trả về trang `payment-success` trên hệ thống.

💡 Lưu ý: Đây là môi trường thử nghiệm, không thực hiện giao dịch thật.
