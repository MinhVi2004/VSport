import { Routes, Route } from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./layouts/AdminRoute";
// import StaffLayout from "./layouts/StaffLayout";
import SigninPage from "./pages/user/SigninPage";
import SignupPage from "./pages/user/SignupPage";
import ForgetPasswordPage from "./pages/user/ForgetPasswordPage";



import HomePage from "./pages/user/HomePage";
import ProductDetailPage from "./pages/user/ProductDetailPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import AddressPage from "./pages/user/AddressPage";
import ProfilePage from "./pages/user/ProfilePage";

import Dashboard from "./pages/admin/Dashboard";

import ListBanner from "./pages/admin/banner/ListBanner";
import AddBanner from "./pages/admin/banner/AddBanner";
import UpdateBanner from "./pages/admin/banner/UpdateBanner";

import ListCategory from "./pages/admin/category/ListCategory";
import AddCategory from "./pages/admin/category/AddCategory";
import UpdateCategory from "./pages/admin/category/UpdateCategory";

import ListProduct from "./pages/admin/product/ListProduct";
import AddProduct from "./pages/admin/product/AddProduct";
import UpdateProduct from "./pages/admin/product/UpdateProduct";
import AddVariant from "./pages/admin/product/AddVariant";


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />
      <main className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />



          {/* USER */}
          <Route path="/" element={<UserLayout />} >
            <Route index element={<HomePage/>} /> 
            <Route path="product/:id" element={<ProductDetailPage/>}/>
            <Route path="cart" element={<CartPage/>}/>
            <Route path="/profile/address" element={<AddressPage/>}/>
            <Route path="/checkout" element={<CheckoutPage/>}/>
            <Route path="/profile" element={<ProfilePage/>} />
          </Route>


          {/* ADMIN  */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
                <Route path="" element={<Dashboard />} />

                <Route path="banner" element={<ListBanner/>} />
                <Route path="banner/add" element={<AddBanner />} />
                <Route path="banner/update/:id" element={<UpdateBanner />} />


                <Route path="category" element={<ListCategory />} />
                <Route path="category/add" element={<AddCategory />} />
                <Route path="category/update/:id" element={<UpdateCategory />} />

                <Route path="/admin/product" element={<ListProduct />} />
                <Route path="/admin/product/add" element={<AddProduct />} />
                <Route path="/admin/product/update/:id" element={<UpdateProduct />} />
                <Route path="/admin/product/variant/:id" element={<AddVariant />} />

          </Route>
          </Route>
        </Routes>
      </main>
    </div>
  );
}
export default App;
