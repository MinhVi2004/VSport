import Header from "../components/user/Header";
import Footer from "../components/user/Footer.jsx";
import { Outlet } from "react-router-dom";
import Chatbot from "../components/user/ChatBot";

const UserLayout = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default UserLayout;
