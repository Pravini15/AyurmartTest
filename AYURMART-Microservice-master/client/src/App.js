import React from "react";
import Header from "./components/buyerComponents/Header";
import Home from "./components/buyerComponents/Home";
import Footer from "./components/buyerComponents/Footer";
import Product from "./components/buyerComponents/Product";
import Cart from "./components/buyerComponents/Cart";
import Contact from "./components/buyerComponents/Contact";
import About from "./components/buyerComponents/About";
import { Routes,Route,Navigate} from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import HomeLogin from './pages/Home';
import ForgetPassword from "./pages/ForgetPassowrd";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./components/buyerComponents/UserProfile";
import CheckoutSuccess from "./components/buyerComponents/CheckoutSuccess";
import NotFound from "./components/buyerComponents/NotFound";
import SellerDashboard from "./components/sellerComponents/SellerDashboard";
import AddProductForm from "./components/sellerComponents/AddProductForm";
import AdminDashboard from "./components/adminComponents/AdminDashboard"
import Payment from "./components/buyerComponents/Payment";
import SellerSignup from "./pages/SellerSignup";
import SellerLogin from "./pages/SellerLogin";
import { useSellerAuthContext } from "./hooks/useSellerAuthContext";

function App() {
  const { user } = useAuthContext()
  const { seller } = useSellerAuthContext()
    return (
        <React.Fragment>
            <Header>
                <Header />
            </Header>

            <main style={{ marginBottom: "50px" }}>
                <Routes>
                    <Route path="/" element={<Home />} exact></Route>
                    <Route path="/product/:id" element={<Product />} exact></Route>
                    <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login"></Navigate>} exact></Route>
                    <Route path="/" element={user ? <HomeLogin /> : <Navigate to="/login"></Navigate>}/>
                    <Route path="/signup" element={!user ? <Signup /> :<Navigate to="/login"></Navigate>}/>
                    <Route path="/login" element={!user ? <Login /> :<Navigate to="/"></Navigate>}/>
                    <Route path="/reset-password" element={!user ? <ForgetPassword /> :<Navigate to="/"></Navigate>}/>
                    <Route path="/api/user/reset-password/:token" element={<ResetPassword />} exact></Route>
                    <Route path="/user-profile" element={user ? <UserProfile /> :<Navigate to="/"></Navigate>} exact></Route>
                    <Route path="/contact" element={<Contact />} exact></Route>
                    <Route path="/about" element={<About />} exact></Route>
                    <Route path="/payment/:cart" element={<Payment/>} exact></Route>
                    <Route path="/checkout-success" element={<CheckoutSuccess/>} exact></Route>
                    <Route path="*" element={<NotFound/>} exact></Route>
                    <Route path="/seller-dashboard" element={<SellerDashboard/>} exact></Route>
                    <Route path="/addProduct" element={<AddProductForm/>} exact></Route>
                    <Route path="/admin-dashboard" element={user ? <AdminDashboard /> :<Navigate to="/login"></Navigate>} exact></Route>
                    <Route path="/sign-up/seller" element={<SellerSignup/>} exact></Route>
                    <Route path="/sellerSignup" element={!seller ? <SellerSignup/>: <Navigate to="/seller-dashboard"></Navigate>} exact></Route>
                    <Route path="/sellerLogin" element={!seller ?<SellerLogin/>: <Navigate to="/seller-dashboard"></Navigate>} exact></Route>
                </Routes>
            </main>

            <Footer>
                <Footer />
            </Footer>

        </React.Fragment>
    );
}

export default App;