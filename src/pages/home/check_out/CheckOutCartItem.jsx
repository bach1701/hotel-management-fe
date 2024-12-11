import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router-dom";
import { useRoomCount } from '../RoomCountContext/RoomCountContext';
import API_BASE_URL from '../../../config/apiConfig';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "../../../utils/api";

const CheckOutCartItem = () => {

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showDetailHotel, setShowDetailHotel] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orialPrice, setOrialPrice] = useState('');
    const [bookingID, setBookingID] = useState('');
    const [priceDiscount, setPriceDiscount] = useState(0)
    const [finalPrice, setFinalPrice] = useState(0)
    const [isClickConfirmInfor, setIsClickConfirmInfor] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [cartItemCheckout, setCartItemCheckout] = useState('');

    const stripePromise = loadStripe('pk_test_51Q7TR2B1Dpb6dXWmD5g6dAuCHf5Co92kXqxZOI2yTOuC4lnZYSa6EGmYaZjAhfYVqMAXlPWft1HaIJT01qW29RVF0009iOraPk');

    const query = new URLSearchParams(useLocation().search);
    const cartItemId = query.get('cart-item-id');
    const { setRoomCount } = useRoomCount();
    const { token } = useAuth();
    const baseURL = API_BASE_URL;

    const fetchCartItem = async() => {
        const URL = `${baseURL}/api/cart/view_cart_item/${cartItemId}`;
        try {
            const response = await apiRequest(URL);
            console.log(response.data);
            setCartItemCheckout(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const fetchCoupon = async(code, bookingID) => {
        if (bookingID === null) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Vui lòng xác nhận thông tin đặt phòng.',
                showConfirmButton: false,
                timer: 2000
            });
        }
        else {
            const data = {
                code: code 
            }
            const URL =`${baseURL}/api/checkout-api/${bookingID}/`;
            try {
                const response = await apiRequest(URL, 'POST', data);
                if(response.data.message === 'Coupon activated') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: 'Sử dụng coupon thành công.',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    setPriceDiscount(response.data.discount);
                    setFinalPrice(response.data.booking_total);
                }
                else (
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Coupon không tồn tại.',
                        showConfirmButton: false,
                        timer: 2000
                    })
                )
            }
            catch (error) {
                console.error('Error response:', error.response); 
            }
        }
    }

    const fetchTypeRoom = async(slugHotel, slugRoomtype) => {
        const URL = `${baseURL}/api/hotels/${slugHotel}/room-types/${slugRoomtype}/rooms/`;
        try {
            const response = await apiRequest(URL);
            setSelectedRoom(response.data.roomtype);
        }
        catch (error) {
            console.error(error);
        }
    }

    const createBooking = async(fullname, email, phone) => {
        const URL = `${baseURL}/api/bookings/create/`;
            const data = {
                hotel_id: cartItemCheckout.hotel_id,
                room_id: cartItemCheckout.room_id,
                checkin: cartItemCheckout.check_in_date,
                checkout: cartItemCheckout.check_out_date,
                adult: cartItemCheckout.adults_count,
                children: cartItemCheckout.childrens_count,
                room_type: cartItemCheckout.slug_room_type,
                before_discount: cartItemCheckout.price,
                full_name: fullname,
                email: email,
                phone: phone
            };
            try {
                const response = await apiRequest(URL, 'POST', data);
                setBookingID(response.data.booking_id);
            }
            catch (error) {
                console.error(error);
            }
    }

    useEffect(() => {
        fetchCartItem();
    },[]);

    const handleRoomClick = (slugHotel, slugRoomtype) => {
        fetchTypeRoom(slugHotel, slugRoomtype);
    };

    const handleCloseModal = () => {
        setSelectedRoom(null);
    };

    const handleOutsideClick = (e) => {
        if (e.target.className === 'modal') {
            handleCloseModal();
        }
    };

    const handleFullNameBilling = (e) => {
        setFullName(e.target.value);
    }

    const handleEmailBilling = (e) => {
        setEmail(e.target.value);
    }

    const handlePhoneNumberBilling = (e) => {
        setPhoneNumber(e.target.value);
    }

    const handleSaveInforBill = () => {
        if (fullName === "" || email === "" || phoneNumber === "") {
            Swal.fire({
                icon: 'error',
                title: 'Nhập thiếu thông tin!',
                text: 'Vui lòng nhập đầy đủ các thông tin cần để kiểm tra phòng trống',
                showConfirmButton: false,
                timer: 2000
            });
        } else {
            Swal.fire({
                icon: 'question',
                title: 'Xác nhận đặt phòng!',
                text: 'Kiểm tra thông tin đã điền chính xác!',
                showCancelButton: true, // Hiển thị nút Cancel
                confirmButtonText: 'Ok',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    createBooking(fullName, email, phoneNumber);
                    console.log(fullName, email, phoneNumber);
                    console.log("totalPrice:", totalPrice);
                    setOrialPrice(totalPrice);
                    setIsClickConfirmInfor(true);
                    setIsButtonDisabled(true);
                    console.log("isClickConfirmInfor set to true");
                    console.log(isClickConfirmInfor, "isClickConfirmInfor set to true");
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!!',
                        text: 'Tạo booking thành công!',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
                else {
                    setIsClickConfirmInfor(false);
                    setIsButtonDisabled(false);
                    console.log("Booking cancelled.");
                }
            });
        }
    };

    const handleApplyCoupon = () => {
        if (couponCode) {
            fetchCoupon(couponCode, bookingID);
        } else {
            alert('Please enter a coupon code.');
        }
    };

    const handleCheckout = async () => {
        const URL =`${baseURL}/api/checkout/${bookingID}/`;
        const stripe = await stripePromise;
        const data = {
            email : email,
            cart_item_id : cartItemId,
        }
        try {
            const response = await apiRequest(URL, 'POST', data);
            console.log(response.data);
            const session = response.data;
            const { error } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
            if (error) {
                alert(error.message);
            }
        }
        catch (error) {
            console.error(error);
        }
        // try {
        //     const response = await axios.post(URL, data, {
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //             'Server-Domain': baseURL
        //         }
                
        //     });
        //     const session = response.data;
        //     const { error } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
        //     if (error) {
        //         alert(error.message);
        //     }
        // }
        // catch (error) {
        //     console.error('Error:', error);
        // }
    }

    return (
        <>
            <div id="main_wrapper" class="selection-list">
                <div id="titlebar" class="gradient">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12 padding-top-60">
                            <h2>Check out Room</h2>
                            <nav id="breadcrumbs">
                                <ul>
                                    <li><a>Home</a></li>
                                    <li><a>Hotel</a></li>
                                    <li><a>Rooms</a></li>
                                    <li>Check out room</li>
                                </ul>
                            </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container margin-bottom-75">
                    <div class="row">
                        <div class="col-lg-8 col-md-8 utf_listing_payment_section">
                            <form class="utf_booking_listing_section_form margin-bottom-40" method="POST">
                                <h3><i class="fas fa-user"></i> Billing Information</h3>
                                <div class="row">
                                    <div className="col-md-12">
                                        <label>Full Name</label>
                                        <input 
                                            name="full_name" 
                                            type="text" 
                                            value={fullName} 
                                            onChange={(e) => handleFullNameBilling(e)} 
                                            placeholder="Full Name..."
                                            readOnly={isClickConfirmInfor} 
                                            style={{ backgroundColor: isClickConfirmInfor ? 'rgb(227, 227, 227 !important)' : 'white' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="medium-icons">
                                            <label>E-Mail</label>
                                            <input 
                                                name="email" 
                                                type="text" 
                                                value={email} 
                                                onChange={(e) => handleEmailBilling(e)} 
                                                placeholder="Email..."
                                                readOnly={isClickConfirmInfor} 
                                                style={{ backgroundColor: isClickConfirmInfor ? 'rgb(227, 227, 227 !important)' : 'white' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="medium-icons">
                                            <label>Phone Number</label>
                                            <input 
                                                name="phone" 
                                                type="text" 
                                                value={phoneNumber} 
                                                onChange={(e) => handlePhoneNumberBilling(e)} 
                                                placeholder="Phone Number..."
                                                readOnly={isClickConfirmInfor} 
                                                style={{ backgroundColor: isClickConfirmInfor ? 'rgb(227, 227, 227 !important)' : 'white' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                                        <div class="utf_booking_listing_section_form margin-bottom-40">
                                            <Link to={`/detailhotel/${cartItemCheckout.hotel_slug}`}>
                                                <div>
                                                    <h3>
                                                        <i class="fas fa-bed"></i>
                                                        {cartItemCheckout.hotel_name}
                                                        {(() => {
                                                            const checkInDate = new Date(cartItemCheckout.check_in_date);
                                                            const checkOutDate = new Date(cartItemCheckout.check_out_date);
                                                            const timeDifference = checkOutDate - checkInDate;
                                                            const dayDifference = timeDifference / (1000 * 3600 * 24);
                                                            const totalPrice = cartItemCheckout.price * (dayDifference > 0 ? dayDifference : 0);
                                                            return <div class="utf_listing_section" >
                                                            <div class="utf_pricing_list_section" >
                                                                <ul>
                                                                    <li style={{ backgroundColor: '#FDFDFD' }}>
                                                                        <h5>Total:</h5>
                                                                        <span className="">{totalPrice} VNĐ</span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        })()}
                                                    </h3>
                                                </div>
                                            </Link>
                                            {/* {showDetailHotels[hotel.id] && ( */}
                                            {showDetailHotel && (
                                                <div class="utf_listing_section">
                                                <div class="utf_pricing_list_section">
                                                    <ul>
                                                        <li>
                                                                    <h5>Room Type: {cartItemCheckout.room_type} <small><a style={{ cursor: 'pointer' }} class="delete-item" data-item="{{ id }}"></a></small> </h5>
                                                                    <h5>Room Number: {cartItemCheckout.room_number}<small><a style={{ cursor: 'pointer' }} class="delete-item" data-item="{{ id }}"></a></small> </h5>
                                                                    <h5>Check-in Date: {cartItemCheckout.check_in_date}<small><a style={{ cursor: 'pointer' }} class="delete-item" data-item="{{ id }}"></a></small> </h5>
                                                                    <h5>Check-in Date: {cartItemCheckout.check_out_date}<small><a style={{ cursor: 'pointer' }} class="delete-item" data-item="{{ id }}"></a></small> </h5>
                                                                    <h5>
                                                                        Sum of Days: {(() => {
                                                                            const checkInDate = new Date(cartItemCheckout.check_in_date);
                                                                            const checkOutDate = new Date(cartItemCheckout.check_out_date);
                                                                            const timeDifference = checkOutDate - checkInDate;
                                                                            const dayDifference = timeDifference / (1000 * 3600 * 24);
                                                                            return dayDifference > 0 ? dayDifference : 0; 
                                                                        })()} days
                                                                        <small>
                                                                            <a style={{ cursor: 'pointer' }} className="delete-item" data-item="{{ id }}"></a>
                                                                        </small>
                                                                    </h5>
                                                                    <h5>Adults: {cartItemCheckout.adults_count}<small><a style={{ cursor: 'pointer' }} class="delete-item" data-item="{{ id }}"></a></small> </h5>
                                                                    <h5>Childrens: {cartItemCheckout.childrens_count}<small><a style={{ cursor: 'pointer' }} class="delete-item" data-item="{{ id }}"></a></small> </h5>
                                                                    <p 
                                                                        onClick={() => handleRoomClick(cartItemCheckout.hotel_slug, cartItemCheckout.slug_room_type)} 
                                                                        style={{ 
                                                                            cursor: 'pointer', 
                                                                            textDecoration: 'underline', 
                                                                            // color: 'red'  
                                                                        }}
                                                                    >
                                                                        <strong>View detail Type Room</strong>
                                                                    </p>
                                                                    <span> {cartItemCheckout.price} VNĐ </span>
                                                                </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            )}
                                            <a
                                            href="#"
                                            class="show-more-button"
                                            
                                            onClick={(e) => {
                                                e.preventDefault(); 
                                                setShowDetailHotel(!showDetailHotel); 
                                            }}
                                            >
                                                {showDetailHotel ? "Hidden detail room" : "Show detail room"}
                                                <i className={showDetailHotel ? "fa fa-angle-double-up" : "fa fa-angle-double-down"}></i>
                                            </a>
                                            {/* <a
                                                href="#"
                                                className="show-more-button"
                                                onClick={(e) => {
                                                    e.preventDefault(); 
                                                    toggleShowDetail(hotel.id); // Gọi hàm để chuyển đổi trạng thái cho khách sạn cụ thể
                                                }}
                                            >
                                                {showDetailHotels[hotel.id] ? "Hidden detail list room" : "Show detail list room"}
                                                <i className={showDetailHotels[hotel.id] ? "fa fa-angle-double-up" : "fa fa-angle-double-down"}></i>
                                            </a> */}
                                        </div>

                            {selectedRoom && (
                                <div className="modal" onClick={handleOutsideClick} style={modalStyles}>
                                    <div className="modal-content" style={modalContentStyles}>
                                        <span className="close" onClick={handleCloseModal} style={closeButtonStyles}>&times;</span>
                                        <h2>{selectedRoom.type}</h2>
                                        <img 
                                            src={`${baseURL}${selectedRoom.image}`} 
                                            alt={selectedRoom.type} 
                                            style={{ 
                                                maxWidth: '100%',  
                                                maxHeight: '400px', 
                                                objectFit: 'contain' 
                                            }}  
                                        />
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '20px' }}>
                                            <div style={{ flex: '0 0 48%', marginBottom: '10px' }}>
                                                <p><strong>Price:</strong> {selectedRoom.price} VNĐ</p>
                                            </div>
                                            <div style={{ flex: '0 0 48%', marginBottom: '10px' }}>
                                                <p><strong>Description:</strong> {selectedRoom.description}</p>
                                            </div>
                                            <div style={{ flex: '0 0 48%', marginBottom: '10px' }}>
                                                <p><strong>Number of Beds:</strong> {selectedRoom.number_of_beds}</p>
                                            </div>
                                            <div style={{ flex: '0 0 48%', marginBottom: '10px' }}>
                                                <p><strong>Room Capacity:</strong> {selectedRoom.room_capacity} Persons</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '10px' }}>
                                <button 
                                    type="submit" 
                                    className="button utf_booking_confirmation_button"
                                    style={{ margin: '0' }} 
                                    onClick={() => handleSaveInforBill()}
                                    disabled={isButtonDisabled}
                                >
                                    Continue to checkout<i className="fas fa-right-arrow"></i>
                                </button>
                            </div>
                            {/* <div class="col-lg-12">
                                    <button type="submit" class="button utf_booking_confirmation_button margin-top-20 margin-bottom-10"><i class="fas fa-right-arrow"></i></button> 		
                            </div> */}
                        </div>
                        <div class="col-lg-4 col-md-4 margin-top-0 utf_listing_payment_section">
                            <div class="utf_booking_listing_item_container compact utf_order_summary_widget_section">
                            <div class="listing-item">
                                <div class="utf_listing_item_content">   							
                                </div>
                            </div>
                            </div>
                            <div class="boxed-widget opening-hours summary margin-top-0">
                                <h3><i class="fa fa-calendar-check-o"></i> Booking Summary</h3>
                                <ul>
                                {(() => 
                                {
                                    const checkInDate = new Date(cartItemCheckout.check_in_date);
                                    const checkOutDate = new Date(cartItemCheckout.check_out_date);
                                    const timeDifference = checkOutDate - checkInDate;
                                    const dayDifference = timeDifference / (1000 * 3600 * 24);
                                    const totalPrice = cartItemCheckout.price * (dayDifference > 0 ? dayDifference : 0);
                                    return (
                                        <div>
                                            <ul>
                                                <li>Check-in<span>{cartItemCheckout.check_in_date}</span></li>
                                                <li>Check-out<span>{cartItemCheckout.check_in_date}</span></li>
                                                <li>Total Days<span> {dayDifference} days</span></li>
                                                <li>Adults<span>{cartItemCheckout.adults_count}</span></li>
                                                <li>Childrens<span>{cartItemCheckout.childrens_count}</span></li>
                                                <li>Original Price<span>{totalPrice} VNĐ</span></li>
                                                <li>Discount<span>-{priceDiscount} VNĐ</span></li>
                                            </ul>
                                        </div>
                                    )
                                })()}
                                    <li className="total-costs">
                                        <div className="col-md-8">
                                            <input 
                                                id="couponCode" 
                                                name="code" 
                                                placeholder="Have a coupon enter here..." 
                                                required 
                                                type="text" 
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)} 
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <input 
                                                type="submit" 
                                                class="coupon_code" 
                                                onClick={handleApplyCoupon}
                                                value="Apply"
                                            >   
                                            </input>
                                        </div>
                                    </li>
                                    <div class="clearfix"></div>
                                    <li class="total-costs">Total Cost <span>{finalPrice} VNĐ</span></li>                            
                                </ul>
                                <form method="POST" action="https://checkout.flutterwave.com/v3/hosted/pay">
                                    <input type="hidden" name="public_key" value="FLWPUBK_TEST-a2c377d3cf56b37b9e660f85e26d2f8f-X" />
                                    <input type="hidden" name="customer[email]" value="{{booking.email}}" />
                                    <input type="hidden" name="customer[name]" value="{{booking.full_name}}" />
                                    <input type="hidden" name="tx_ref" value="ID-{{booking.booking_id}}" />
                                    <input type="hidden" name="amount" value="{{booking.total}}" />
                                    <input type="hidden" name="currency" value="USD" />
                                    <input type="hidden" name="meta[token]" value="54" />
                                    <input type="hidden" name="redirect_url" value="{{website_address}}/success/{{booking.booking_id}}/?success_id={{booking.success_id}}&booking_total={{booking.total}}" />
                                    <button id="flutter-btn" class="button utf_booking_confirmation_button margin-top-20 w-100 " style={{ backgroundColor: "orange", color: "rgb(37, 28, 3)" }}>Pay with Flutterwave <img src="https://asset.brandfetch.io/iddYbQIdlK/idmlgmHt_3.png" style={{width: "40px"}} alt=""/></button> 		
                                </form>
                                <button 
                                    id="checkout-button" 
                                    className="button utf_booking_confirmation_button margin-top-10 margin-bottom-10 w-100"
                                    onClick={handleCheckout}
                                >
                                    Pay with Stripe <i class="fas fa-credit-card"></i>
                                </button> 		
                                <div id="paypal-button-container"></div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const modalStyles = {
    display: 'flex',
    position: 'fixed',
    zIndex: 1000, // Đảm bảo modal ở trên cùng
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
};

const modalContentStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
    width: '80%',  // Thay đổi độ rộng modal
    maxWidth: '600px', // Thiết lập độ rộng tối đa
    height: 'auto', // Tự động điều chỉnh chiều cao
};

const closeButtonStyles = {
    cursor: 'pointer',
    float: 'right',
    fontSize: '28px',
    fontWeight: 'bold',
};

const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
};

// CSS cho làm mờ
const styles = `
    .blurred {
        filter: blur(5px);
        pointer-events: none; /* Ngăn chặn tương tác với các phần tử mờ */
    }
`;

// Thêm CSS vào trang (có thể thực hiện trong file CSS riêng hoặc trong component)
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default CheckOutCartItem;