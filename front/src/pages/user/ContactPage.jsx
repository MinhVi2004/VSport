import { useState } from "react";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  MessageCircle
} from "lucide-react";
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);

  const isValid = formData.name && formData.email && formData.message;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      toast.warn("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setIsSending(true);
      await axiosInstance.post("/api/email", formData);
       toast.success("Gửi thành công! Cảm ơn bạn đã liên hệ.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Gửi thất bại. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center text-blue-700">
        Liên hệ với chúng tôi
      </h1>

      <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-xl shadow-lg">
        {/* Thông tin liên hệ */}
        <div className="space-y-5 text-gray-800">
          <h2 className="text-2xl font-semibold mb-2">Thông tin liên hệ</h2>
          <a
  href="https://maps.app.goo.gl/NoMTMFnsjyMvvSsu8"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 hover:underline text-black-700"
>
  <MapPin  className="w-8"/> Trường Đại học Sài Gòn, Quận 5, TP.HCM
</a>

          <a
  href="https://zalo.me/0772912452"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 hover:underline text-black-700"
>
  <img src="website/zalo.png" className="w-8"/> 0772 912 452
</a>
<a href="tel:0772912452" className="flex items-center gap-2 hover:underline text-black-700">
  <Phone  className="w-8"/> 0772 912 452
</a>

          <a
  href="mailto:dvmv2017@gmail.com"
  className="flex items-center gap-2 hover:underline text-black-700"
>
  <Mail className="w-8"/> dvmv2017@gmail.com
</a>
          <p className="flex items-center gap-2">
            <Clock className="text-black-600 w-8" /> Thời gian: 8h - 18h (T2 - T7)
          </p>
        </div>

        {/* Form gửi ý kiến */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">Gửi ý kiến cho chúng tôi</h2>

          <div>
            <label className="block text-sm font-medium text-gray-600">Tên của bạn</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Nội dung</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-3 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Nhập ý kiến của bạn..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
              !isValid || isSending ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={!isValid || isSending}
          >
            {isSending ? "Đang gửi..." : "Gửi ý kiến"}
          </button>

          {status && (
            <p className="mt-2 text-sm text-center text-gray-600">
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
