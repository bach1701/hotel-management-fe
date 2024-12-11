import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";
import { apiRequest } from "../../utils/api";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const HistoryBooking = () => {

    const [listBookings, setListBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistoryBooking = async () => {
            const URL = `${API_BASE_URL}/api/bookings/my-bookings/`;
            try {
                const response = await apiRequest(URL);
                console.log(response.data);
                setListBookings(response.data);
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchHistoryBooking();
    },[]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
        Swal.fire({
            icon: 'success',
            title: 'Đăng xuất thành công!',
            showConfirmButton: false,
            timer: 15000
        });
    };

    return (
        <div id="main_wrapper"> 
            <div class="clearfix"></div>
            {/* <!-- Dashboard --> */}
            <div id="dashboard"> 
                <a href="#" class="utf_dashboard_nav_responsive"><i class="fa fa-reorder"></i> Dashboard Sidebar Menu</a>
                <div class="utf_dashboard_navigation js-scrollbar">
                <div class="utf_dashboard_navigation_inner_block" style={{ backgroundColor: 'white' }}>
                    <ul>
                        <Link to="/user-profile/history-booking"><li class="active" style={{ borderBottom: '1px solid #ccc' }}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-docs"></i>History Booking</a></li></Link>	  
                        <Link to="/user-profile/history-review"><li  style={{ borderBottom: '1px solid #ccc' }}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-star"></i>History Reviews</a></li></Link>
                        <Link to="/user-profile/my-profile"><li style={{ borderBottom: '1px solid #ccc'}} ><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-user"></i> My Profile</a></li></Link>
                        <Link to="/user-profile/change-password"><li style={{ borderBottom: '1px solid #ccc' }}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-key"></i> Change Password</a></li></Link>
                        <li style={{ borderBottom: '1px solid #ccc' }} onClick={handleLogout}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-power"></i> Logout</a></li>
                    </ul>
                </div>
                </div>
                <div class="utf_dashboard_content"> 
                <div id="titlebar" class="dashboard_gradient">
                    <div class="row">
                    <div class="col-md-12">
                        <h2>Bookings</h2>
                        <nav id="breadcrumbs">
                        <ul>
                            <li><a href="index_1.html">Home</a></li>
                            <li><a href="dashboard.html">Dashboard</a></li>
                            <li>Bookings</li>
                        </ul>
                        </nav>
                    </div>
                    </div>
                </div>
                
                <div class="row"> 
                    <div class="col-lg-10 col-md-6">
                    <div class="utf_dashboard_list_box margin-top-0">
                        <div class="sort-by my_sort_by">
                            <div class="utf_sort_by_select_item">
                            </div>
                        </div>
                        <h4>Recent Bookings</h4>
                        <ul>	
                            {listBookings.map(listBooking => (
                                <li className="utf_approved_booking_listing" key={listBooking.id}>
                                    <div class="utf_list_box_listing_item bookings">
                                    <div class="utf_list_box_listing_item-img"><img src={`${API_BASE_URL}/${listBooking.profile_image}`} alt=""/></div>
                                    <div class="utf_list_box_listing_item_content">
                                        <div class="inner">
                                        <h3>{listBooking.full_name}<span class="utf_booking_listing_status">{listBooking.payment_status.toUpperCase()}</span></h3>
                                        <div class="utf_inner_booking_listing_list">
                                            <h5>Hotel:</h5>
                                            <ul class="utf_booking_listing_list">
                                            <li>{listBooking.hotel_name} - {listBooking.room_type_name}</li>						  						  
                                            </ul>
                                        </div>
                                        <div class="utf_inner_booking_listing_list">
                                            <h5>Checkin Date: </h5>
                                            <ul class="utf_booking_listing_list">
                                            <li class="highlighted">{listBooking.check_in_date}</li>
                                            </ul>
                                        </div>
                                        <div class="utf_inner_booking_listing_list">
                                            <h5>Checkout Date: </h5>
                                            <ul class="utf_booking_listing_list">
                                            <li class="highlighted">{listBooking.check_out_date}</li>
                                            </ul>
                                        </div>
                                        <div class="utf_inner_booking_listing_list">
                                            <h5>Booking Details: </h5>
                                            <ul class="utf_booking_listing_list">
                                            <li class="highlighted">{listBooking.num_adults} Adults, {listBooking.num_adults} Children</li>
                                            </ul>
                                        </div>
                                        <div class="utf_inner_booking_listing_list">
                                            <h5>Email Address: </h5>
                                            <ul class="utf_booking_listing_list">
                                            <li class="highlighted"> {listBooking.email}</li>
                                            </ul>
                                        </div>
                                        <div class="utf_inner_booking_listing_list">
                                            <h5>Phone Number:</h5>
                                            <ul class="utf_booking_listing_list">
                                            <li class="highlighted">{listBooking.phone}</li>
                                            </ul>
                                        </div>
                                        <div class="utf_inner_booking_listing_list">
                                            <h5>Price:</h5>
                                            <ul class="utf_booking_listing_list">
                                            <li class="highlighted">$ {listBooking.total}</li>
                                            </ul>
                                        </div>					  					  
                                        </div>
                                    </div>
                                    </div>
                                    <div class="buttons-to-right"> <a href="#" class="button gray reject"> View Invoice</a> </div>
                                </li>
                            ))}		  
                        </ul>
                    </div>		  
                    </div>
                    <div class="col-md-12">
                    <div class="footer_copyright_part">Copyright © 2022 All Rights Reserved.</div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default HistoryBooking;