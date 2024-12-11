import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useRoomCount } from '../home/RoomCountContext/RoomCountContext'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API_BASE_URL from "../../config/apiConfig";
import { apiRequest } from "../../utils/api";
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    
    const [profileUser, setProfileUser] = useState({});
    const [inforUser, setInforUser] = useState({});
    const { roomCount } = useRoomCount();
    const navigate = useNavigate();
    const location = useLocation();
    const { setRoomCount } = useRoomCount();
    const baseURL = API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    useEffect (() => {
        const fetchProfile = async () => {
            console.log("1");
            const URL = `${API_BASE_URL}/user/api/userauths/profile/`;
            try {
                const response = await apiRequest(URL);
                setProfileUser(response.data.profile);
                setInforUser(response.data.user);
                console.log(response.data);
                console.log("2");
            }
            catch (err) {
                console.error(err);
                console.log("3");
            }
        }
        if (token) {
            console.log('access token:', token);
            fetchCartItemCount();
        }
        fetchProfile();
    },[location]);

    const fetchCartItemCount = async () => {
        const urlAPIGetCartCount = `${baseURL}/api/get_cart_item_count`; 
        try {
            const response = await axios.get(urlAPIGetCartCount, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const totalItems = response.data.total_items_in_cart; 
            console.log('Total items in cart:', totalItems); 
            setRoomCount(totalItems);
        } catch (error) {
            console.error('Error fetching cart count', error);
        }
    };

    const toggleMenuUser = () => {
        <Link to="/user-profile"></Link>
    }


    return (
        <>
            <header id="header_part" class="fullwidth">
                <div id="header">
                    <div class="container">
                        <div class="utf_left_side">
                            <div id="logo"><img src="images/logo-booking-hotel.png" alt=""/></div>
                            <div class="mmenu-trigger">
                                <button class="hamburger utfbutton_collapse" type="button">
                                    <span class="utf_inner_button_box">
                                        <span class="utf_inner_section"></span>
                                    </span>
                                </button>
                            </div>
                            <nav id="navigation" class="style_one">
                                <ul id="responsive">
                                    <li><a href="/">Home</a></li>
                                    <li><a href="#">User Panel</a>
                                        <ul>
                                            <li><a href="dashboard_bookings.html">Bookings</a></li>
                                            <li><a href="dashboard_visitor_review.html">Reviews</a></li>
                                            <li><a href="dashboard_my_profile.html">My Profile</a></li>
                                            <li><a href="dashboard_change_password.html">Change Password</a></li>
                                            <li><a href="dashboard_invoice.html">Invoice</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="#">About Us</a></li>
                                    <li><a href="#">Contact</a></li>
                                    <li><a href="page_coming_soon.html">Coming Soon</a></li>       
                                </ul>
                            </nav>
                            <div class="clearfix"></div>
                        </div>
                        <div class="utf_right_side">
                            <div class="header_widget"> 
                                <Link to={`/selected_room`} class="button border sign-in popup-with-zoom-anim"><i class="fa fa-bed"></i>{roomCount}</Link>
                                <div class="utf_user_menu">
                                    <Link to="/user-profile/my-profile"><div class="utf_user_name" onClick={toggleMenuUser}><span><img src={API_BASE_URL + profileUser.image} alt=""/></span>Hi, {inforUser.username}!</div></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header 