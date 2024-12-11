import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { apiRequest } from '../../../utils/api';
import API_BASE_URL from '../../../config/apiConfig';
import { useRoomCount } from '../RoomCountContext/RoomCountContext';

const SuccessPayment = () => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const sessionId = query.get('session_id');
    const bookingId = query.get('booking_id');
    const cartItemId = query.get('cart_item_id');
    const baseURL = API_BASE_URL;
    const { setRoomCount } = useRoomCount();

    const fetchCart = async() => {
        const URL = `${baseURL}/api/view_cart`;
        try {
            const response = await apiRequest(URL);
            console.log(response);
            setRoomCount(response.data.total_items_in_cart);
            console.log(response.data.hotels);
        } 
        catch (error) {
            console.error(error);
        }
    }
    
    useEffect(() => {
        const handleChangeStatusPayment = async (sessionId, bookingId) => {
            const URL = `${baseURL}/api/payment-success/${bookingId}/`;
            const data = {
                sessionId : sessionId
            }
            try {
                const response = await apiRequest(URL, 'POST', data)
                console.log(response.data);
            }
            catch (error) {
                console.error(error);
            }
        }
        const handleDeleteCartItem = async (id) => {
            const URL = `${baseURL}/api/delete_cart_item`;
            const data = {
                item_cart_id: id
            }
            try {
                const response = await apiRequest(URL, 'POST', data);
                fetchCart();
            } 
            catch (error) {
                console.error(error);
            }
        }
        handleChangeStatusPayment(sessionId, bookingId);
        handleDeleteCartItem(cartItemId)
    },[])

    return (
        <div class="not_found_block">
            <div class="container">
            <div class="row">
                <div class="col-md-12">
                <section id="not-found" class="center">
                    <h2 class="margin-bottom-10"><i class="fas fa-check-circle" style={{ color: 'green' }}></i></h2>
                    <p style={{ marginTop: '10px', color: 'black' }}><b>Checkout - Payment Successfull!</b></p>
                    <div class="utf_error_description_part utf_ferror_description">  
                        <span class="f-primary animated v fadeInRight">We have sent your booking summary to <b>Thank you.</b></span> 
                    </div>
                    <a href="/user-profile/history-booking" class="button margin-top-20">Visit History Booking</a>
                    <a href="/user-profile/history-booking/detail-invoice" target="_blank" class="button margin-top-20">View Invoice 🧾</a>
                    <div class="row">
                    <div class="col-lg-6 col-lg-offset-3">
                        <div class="gray-style margin-top-50 margin-bottom-10">
                        </div>
                    </div>
                    </div>
                </section>
                </div>
            </div>
            </div>
        </div>
    )
}

export default SuccessPayment;