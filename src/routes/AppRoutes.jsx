// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Index from "../pages/Index";
import RestaurantPage from "../pages/RestaurantPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import NotFound from "../pages/NotFound";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PaymentSuccess from "../pages/PaymentSuccess";
import AllRestaurants from "../pages/AllRestaurants";

const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <>
          <LoginPage />
        </>
      }
    />
    <Route
      path="/register"
      element={
        <>
          <RegisterPage />
        </>
      }
    />
    {/* Default routes */}
    <Route
      path="/"
      element={
        <>
          <Navbar />
          <Index />
          <Footer />
        </>
      }
    />
    <Route
      path="/restaurant/:id"
      element={
        <>
          <Navbar />
          <RestaurantPage />
          <Footer />
        </>
      }
    />
    <Route
      path="/restaurants"
      element={
        <>
          <Navbar />
          <AllRestaurants />
          <Footer />
        </>
      }
    />
    <Route
      path="/cart"
      element={
        <>
          <Navbar />
          <CartPage />
          <Footer />
        </>
      }
    />
    <Route
      path="/checkout"
      element={
        <>
          <Navbar />
          <CheckoutPage />
          <Footer />
        </>
      }
    />
    <Route
      path="/return"
      element={
        <>
          <Navbar />
          <PaymentSuccess />
          <Footer />
        </>
      }
    />
    <Route
      path="/delivery-progress/:orderId"
      element={
        <>
          <Navbar />
          <PaymentSuccess />
          <Footer />
        </>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
