const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
        <p className="text-sm">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
      </div>
    </footer>
  );
};

export default Footer;
