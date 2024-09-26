import React from 'react';
import './App.css'; 
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AdminPanel from './component/AdminPanel/AdminPanel';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import { CartProvider } from './contexts/CartContext';
import Login from './pages/Login/Login';
import SignUp from './pages/Signup/Signup';
import ForgetPassword from './pages/Login/ForgotPassword';
import Navbar from './component/Navbar/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import About from './pages/About/About'
import Dashboard from './pages/Dashboard/Dashboard';
import ResetPassword from './pages/Login/ResetPassword';
import SingleProductPage from './pages/SingleProductPage/SingleProductPage';
import Category from './pages/Category/Category';
import AllProducts from './component/AdminPanel/AllProducts/AllProducts';
import AllAdmins from './component/AdminPanel/AllAdmins/AllAdmins';
import AllUsers from './component/AdminPanel/AllUsers/AllUsers';
import Checkout from './pages/Checkout/Checkout';
import Thankyou from './pages/Thankyou/Thankyou';
import Orders from './component/AdminPanel/Orders/Orders';
import DeliveredOrders from './component/AdminPanel/DeliveredOrders/DeliveredOrders';
import OnDelivery from './component/AdminPanel/OnDelivery/OnDelivery';
import Footer from './component/Footer/Footer';
import Trendings from './component/AdminPanel/Trendings/Trendings';
import AllCategory from './component/AdminPanel/AllCategory/AllCategory';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <div className="App-content">
              <Routes>
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/" element={<Home />} />
                <Route path="/:userId" element={<Home />} />
                <Route path="/category" element={<Category />} />
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cart" element={<Cart />} />

                {/* Admin Panel */}
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/alladmins" element={<AllAdmins />} />
                <Route path="/allusers" element={<AllUsers />} />
                <Route path="/allproducts" element={<AllProducts />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/ondelivery" element={<OnDelivery />} />
                <Route path="/deliveredorders" element={<DeliveredOrders />} />
                <Route path="/trendings" element={<Trendings />} />
                <Route path="/allcategory" element={<AllCategory/>} />

                {/* Login-Signup */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgetPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/product/:id" element={<SingleProductPage />} />

                <Route path="/checkout" element={<Checkout />} />
                <Route path="/thankyou" element={<Thankyou />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
