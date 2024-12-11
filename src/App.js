import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home'
import Login from './pages/auth/Login.jsx'
import './styles/index.css';
import Register from "./pages/auth/Register";
import ListHotel from "./pages/home/list_hotel/ListHotel";
import DetailHotel from "./pages/home/detail_hotel/DetailHotel";
import CheckRoomAvailability from "./pages/home/check_room_availability/CheckRoomAvailability";
import CheckoutCartItem from "./pages/home/check_out/CheckOutCartItem";
import SelectedRoom from "./pages/home/selected_rooms/SelectedRoom";
import { RoomCountProvider } from './pages/home/RoomCountContext/RoomCountContext';
import Header from './pages/baseComponent/Header';
import SuccessPayment from "./pages/home/check_out/SuccessPayment";
import HistoryBooking from "./pages/user_profile/HistoryBooking";
import HistoryReview from "./pages/user_profile/HistoryReview";
import ChangePassword from "./pages/user_profile/ChangePassword";
import ProfilePage from "./pages/user_profile/ProfilePage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

export default function App() {
  
  return (
    <RoomCountProvider>
      <BrowserRouter>
      <Header key={window.location.pathname} />
        <Routes>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password/" element={<ForgotPassword />} />
            <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
            <Route path="selected_room" element={<SelectedRoom />} />
            <Route path="user-profile/my-profile" element={<ProfilePage />} />
            <Route path="user-profile/history-booking" element={<HistoryBooking/>} />
            <Route path="user-profile/history-review" element={<HistoryReview/>} />
            <Route path="user-profile/change-password" element={<ChangePassword />} />
            <Route path="success-payment" element={<SuccessPayment />} />
            <Route path="checkout-cart-item" element={<CheckoutCartItem />} />
            <Route path="register" element={<Register />} />
            <Route path="listhotel" element={<ListHotel />} />
            <Route path="detailhotel/:slug" element={<DetailHotel />} />
            <Route path="checkroomavailability/:slug" element={<CheckRoomAvailability />} />
            <Route path="contact" element={<div>Contact</div>} />
            <Route path="*" element={<div>1</div>} />
        </Routes>
      </BrowserRouter>
    </RoomCountProvider>
  );
}

