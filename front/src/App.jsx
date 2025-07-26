import { Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ? ACCOUNT
import UserLayout from './layouts/UserLayout';
import UserRoute from './layouts/UserRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './layouts/AdminRoute';
import StaffLayout from './layouts/StaffLayout';
import StaffRoute from './layouts/StaffRoute';
import SigninPage from './pages/user/SigninPage';
import SignupPage from './pages/user/SignupPage';
import ForgetPasswordPage from './pages/user/ForgetPasswordPage';
import ResetPasswordPage from './pages/user/ResetPasswordPage';
import VerifyEmail from './pages/user/VerifyEmail';

//? USER
import HomePage from './pages/user/HomePage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import AddressPage from './pages/user/AddressPage';
import ProfilePage from './pages/user/ProfilePage';
import ChangePasswordPage  from './pages/user/ChangePasswordPage';
import OrderPage from './pages/user/OrderPage';
import OrderDetailPage from './pages/user/OrderDetailPage';
import PaymentResult from './pages/user/PaymentResult';
import ContactPage from './pages/user/ContactPage';
//? STAFF
import POSMainPage from './pages/staff/POSMainPage';
import OrderToday from './pages/staff/OrderToday';
import OrderStaffDetail from './pages/staff/OrderStaffDetail';

//? ADMIN
import Dashboard from './pages/admin/AdminDashboard';

import Banner from './pages/admin/banner/Banner';
import AddBanner from './pages/admin/banner/AddBanner';
import UpdateBanner from './pages/admin/banner/UpdateBanner';

import Category from './pages/admin/category/Category';
import AddCategory from './pages/admin/category/AddCategory';
import UpdateCategory from './pages/admin/category/UpdateCategory';

import Product from './pages/admin/product/Product';
import ProductDetail from './pages/admin/product/ProductDetail';
import AddProduct from './pages/admin/product/AddProduct';
import UpdateProduct from './pages/admin/product/UpdateProduct';
import AddVariant from './pages/admin/product/AddVariant';

import Order from './pages/admin/order/Order';
import OrderDetail from './pages/admin/order/OrderDetail';

import User from './pages/admin/user/User';
import UserDetail from './pages/admin/user/UserDetail';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <ToastContainer position="top-right" autoClose={2500} />
            <main className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/signin" element={<SigninPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forget-password" element={<ForgetPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    
                    {/* ADMIN  */}
                    <Route path="/admin" element={<AdminRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="" element={<Dashboard />} />

                            <Route path="banner" element={<Banner />} />
                            <Route path="banner/add" element={<AddBanner />} />
                            <Route path="banner/update/:id" element={<UpdateBanner />} />

                            <Route path="category" element={<Category />} />
                            <Route path="category/add" element={<AddCategory />} />
                            <Route path="category/update/:id" element={<UpdateCategory />} />

                            <Route path="product" element={<Product />} />
                            <Route path="product/:id" element={<ProductDetail />} />
                            <Route path="product/add" element={<AddProduct />} />
                            <Route path="product/update/:id" element={<UpdateProduct />}
                            />
                            <Route path="product/variant/:id" element={<AddVariant />} />

                            <Route path="order" element={<Order />} />
                            <Route path="order/:id" element={<OrderDetail />} />

                            <Route path="user" element={<User />} />
                            <Route path="user/:id" element={<UserDetail />} />
                        </Route>
                    </Route>
                    {/* USER */}
                    <Route path="/" element={<UserRoute />}>
                        <Route element={<UserLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="contact" element={<ContactPage />} />
                            <Route path="product/:id" element={<ProductDetailPage />} />
                            <Route path="cart" element={<CartPage />} />
                            <Route path="checkout" element={<CheckoutPage />} />
                            <Route path="order" element={<OrderPage />} />
                            <Route path="order/:id" element={<OrderDetailPage />} />
                            <Route path="payment-result" element={<PaymentResult />} />
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="profile/address" element={<AddressPage />} />
                            <Route path="change-password" element={<ChangePasswordPage/>} />
                        </Route>
                    </Route>
                    {/* STAFF */}
                    <Route path="/staff" element={<StaffRoute />}>
                        <Route element={<StaffLayout />}>
                            <Route path="" element={<POSMainPage />} />
                            <Route path="order" element={<OrderToday/>}/>
                            <Route path="order/:id" element={<OrderStaffDetail/>} />
                        </Route>
                    </Route>

                </Routes>
            </main>
        </div>
    );
}
export default App;
