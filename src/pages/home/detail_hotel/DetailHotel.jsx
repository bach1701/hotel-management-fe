import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../baseComponent/Header";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../auth/AuthContext';
import API_BASE_URL from '../../../config/apiConfig';
import { apiRequest } from "../../../utils/api";


const DetailHotel = () => {
    const token = localStorage.getItem('accessToken');
    const { slug } = useParams(); 
    const [detailHotel, setDetailHotel] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adults, setAdults] = useState(1);
    const [childrens, setChildrens] = useState(parseInt('1'));
    const [checkin, setCheckin] = useState(''); 
    const [checkout, setCheckout] = useState('');
    const [initRoomType, setInitRoomType] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [hotelgalleries, setHotelGalleries] = useState([]);
    const [hid, setHid] = useState('');
    const [hotelId, setHotelId] = useState(null);
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState('');
    const [listHotelReviews, setListHotelReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    const baseURL = API_BASE_URL;

    const navigate = useNavigate();

    const changeQuantity = (type, quantity) => {
        if(type === 'adults') {
            setAdults(prev => Math.max(prev + quantity, 0));
        }
        else {
            setChildrens(prev => Math.max(prev + quantity, 0));
        }
    }
    const handleCheckinDate = (e) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const dateCheckin = new Date(e.target.value);
        console.log('current date: ', currentDate);
        console.log('check-in date: ', dateCheckin);

        if(dateCheckin < currentDate) {
            setCheckin('');
            Swal.fire({
                icon: 'error',
                title: 'Ngày Check in không hợp lệ!',
                text: ' Bạn vui lòng nhập lại ngày Check in',
                showConfirmButton: false,
                timer: 3000
            })
        }
        else {
            setCheckin(e.target.value); 
        }
    }
    const handleCheckoutDate = (e) => {
        const dateCheckout = e.target.value;
        if(new Date(checkin) > new Date(dateCheckout)) {
            setCheckout('');
            Swal.fire({
                icon: 'error',
                title: 'Ngày Checkout không hợp lệ!',
                text: ' Bạn vui lòng nhập lại ngày Check out',
                showConfirmButton: false,
                timer: 3000
            })
        }
        else {
            setCheckout(dateCheckout);
        }
    }
    const handleSelectRoomType = (e) => {
        setInitRoomType(e.target.value);
    }
    const handleCheckRoomAvailability = () => {
        let responseData
        if(initRoomType && checkin && checkout && adults && childrens) {
            const urlAPICheckRoomAvailability = `${baseURL}/booking/api/booking/check-room-availability/`
            const data = {
                hotel_slug: detailHotel.slug,
                room_type: initRoomType,
                checkin: checkin,
                checkout: checkout,
                adult: adults,
                children: childrens
            };
            console.log('data : ', data)
            axios.post(urlAPICheckRoomAvailability, data
            )
            .then(response => {
                responseData = response.data
                console.log('responseData : ', responseData)
                navigate(`/checkroomavailability/${encodeURIComponent(responseData.slug)}?room-type=${encodeURIComponent(responseData.room_type)}&date-checkin=${encodeURIComponent(checkin)}&date-checkout=${encodeURIComponent(checkout)}&adults=${encodeURIComponent(adults)}&childrens=${encodeURIComponent(childrens)}`);
            })
            .catch(error => {
                console.error('There was an error!', error);
            })
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Nhập thiếu thông tin!',
                text: 'Vui lòng nhập đầy đủ các thông tin cần để kiểm tra phòng trống',
                showConfirmButton: false,
                timer: 2000
            })
        }
    }
    
    useEffect(() => {
        const fetchHotelDetails = async () => {
        console.log('token :',token);
        try {
            const responseHotelDetail = await axios.get(`${baseURL}/api/hotels/${slug}`);
            console.log(responseHotelDetail.data);
            setDetailHotel(responseHotelDetail.data);
            console.log(responseHotelDetail.data.hotel_gallery);
            setHotelGalleries(responseHotelDetail.data.hotel_gallery)
            setHid(responseHotelDetail.data.hid)
            console.log(responseHotelDetail.data.hid);


            const responseRoomType = await axios.get(`${baseURL}/api/hotels/${slug}/room-types`);
            console.log(responseRoomType.data.roomtype);
            setRoomTypes(responseRoomType.data.roomtype);

            fetchHotelReview(responseHotelDetail.data.hid);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchHotelDetails();
    }, [slug]);

    const fetchHotelReview = async (hid) => {
        try {
            const responseHotelReview = await axios.get(`${baseURL}/api/reviews/hotel-reviews/${hid}`);
            setHotelId(responseHotelReview.data.hotel_id);
            setListHotelReviews(responseHotelReview.data.reviews);
            handleAverageRating(responseHotelReview.data.reviews);
            console.log(responseHotelReview.data.reviews);
            console.log(responseHotelReview.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleRoomClick = (roomType) => {
        setSelectedRoom(roomType);
    };

    const handleCloseModal = () => {
        setSelectedRoom(null);
    };

    const handleOutsideClick = (e) => {
        if (e.target.className === 'modal') {
            handleCloseModal();
        }
    };

    const handleRatingChange = (e) => {
        console.log(e.target.value);
        setRating(e.target.value);
    };
    
    const handleReviewChange = (e) => {
        console.log(e.target.value);
        setReview(e.target.value);
    };

    const handleSubmitReview = async(hotelId, rating, review) => {
        console.log(hid);
        const URL =`${baseURL}/api/reviews/post/`;
        const data = {
            hotel : hotelId,
            rating : parseInt(rating),
            review_text : review
        }

        try {
            console.log(data);
            console.log(token);
            const reponse = await axios.post(URL, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Viết đánh giá thành công.',
                showConfirmButton: false,
                timer: 2000
            })
            setRating(0);
            setReview('');
            fetchHotelReview(hid);
            console.log(reponse.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleAverageRating = (reviews) => {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / reviews.length;
        setAverageRating(avgRating);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); 
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');
    
        return `${yyyy}-${mm}-${dd} - ${hh}:${min}:${sec}`;
    };

  
    if (loading) return <p>Loading hotel details...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div id="main_wrapper">
                {/* <Header /> */}
                <div class="clearfix"></div>
                <div id="utf_listing_gallery_part" class="utf_listing_section">
                    <div class="utf_listing_slider utf_gallery_container margin-bottom-0">
                        {hotelgalleries.map(hotelgallery => (
                                <img src={`${hotelgallery.image}`} alt="" class="item utf_gallery"/>
                        ))}
                    </div>
                </div>
                <div class="container">
                    <div class="row utf_sticky_main_wrapper">
                        <div class="col-lg-8 col-md-8">
                            <div id="titlebar" class="utf_listing_titlebar">
                                <div class="utf_listing_titlebar_title">
                                    <h2>{detailHotel.name} <span class="listing-tag">Hotel</span></h2>
                                    <span> <a href="#utf_listing_location" class="listing-address"> <i class="sl sl-icon-location"></i> {detailHotel.address}</a> </span>
                                    <span class="call_now"><i class="sl sl-icon-phone"></i> {detailHotel.mobile}</span>
                                    <div class="utf_star_rating_section" data-rating="4.5">
                                        <div class="utf_counter_star_rating">(4.5) / (14 Reviews)</div>
                                    </div>
                                    <ul class="listing_item_social">
                                        <li><a href="#"><i class="fa fa-bookmark"></i> Bookmark</a></li>
                                        <li><a href="#"><i class="fa fa-star"></i> Add Review</a></li>
                                        <li><a href="#"><i class="fa fa-flag"></i> Featured</a></li>
                                        <li><a href="#"><i class="fa fa-share"></i> Share</a></li>
                                        <li><a href="#" class="now_open">Open Now</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div id="utf_listing_overview" class="utf_listing_section">
                                <h3 class="utf_listing_headline_part margin-top-30 margin-bottom-30">Description</h3>
                                <p>{detailHotel.description}</p>
                                <div id="utf_listing_tags" class="utf_listing_section listing_tags_section margin-bottom-10 margin-top-0">
                                    <a href="#"><i class="sl sl-icon-phone" aria-hidden="true"></i>(+84) {detailHotel.mobile}</a>
                                    <a href="#"><i class="fa fa-envelope-o" aria-hidden="true"></i> {detailHotel.slug}@gmail.com</a>
                                    <a href="#"><i class="sl sl-icon-globe" aria-hidden="true"></i> www.{detailHotel.slug}.com</a>
                                </div>
                                <div class="social-contact">
                                    <a href="#" class="facebook-link"><i class="fa fa-facebook"></i> Facebook</a>
                                    <a href="#" class="twitter-link"><i class="fa fa-twitter"></i> Twitter</a>
                                    <a href="#" class="instagram-link"><i class="fa fa-instagram"></i> Instagram</a>
                                    <a href="#" class="linkedin-link"><i class="fa fa-linkedin"></i> Linkedin</a>
                                    <a href="#" class="youtube-link"><i class="fa fa-youtube-play"></i> Youtube</a>
                                </div>
                            </div>

                            <div id="utf_listing_tags" class="utf_listing_section listing_tags_section">
                                <h3 class="utf_listing_headline_part margin-top-40 margin-bottom-40">Tags</h3>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Food</a>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Fruits</a>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Lunch</a>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Menu</a>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Parking</a>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Restaurant</a>
                            </div>

                            <div class="utf_listing_section">
                                <h3 class="utf_listing_headline_part margin-top-50 margin-bottom-40">Pricing</h3>
                                <div class="show-more">
                                    <div class="utf_pricing_list_section">
                                        <h4>Select Pass</h4>
                                        <ul>
                                            {roomTypes.map(roomType => (
                                                <li 
                                                key={roomType.id} 
                                                onClick={() => handleRoomClick(roomType)} 
                                                style={{ cursor: 'pointer' }}
                                                >
                                                    <h5>{roomType.type}<sub class="ppl-offer label-light-success">20% Off</sub></h5>
                                                    <p><strong>Max :</strong> {roomType.room_capacity} Persons</p>
                                                    <span>{roomType.price} VNĐ</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                {/* <a
                                href="#"
                                class="show-more-button"
                                data-more-title="Show More"
                                data-less-title="Show Less"
                                ><i class="fa fa-angle-double-down"></i>
                                </a> */}
                            </div>
                            {/* Modal for room details */}
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

                            {/* <div id="utf_listing_amenities" class="utf_listing_section">
                                <h3 class="utf_listing_headline_part margin-top-50 margin-bottom-40">Amenities</h3>
                                <ul class="utf_listing_features checkboxes margin-top-0">
                                    <li>Instant Book</li>
                                    <li>Wireless Internet</li>
                                    <li>Free Parking on Premises</li>
                                    <li>Free Parking on Street</li>
                                    <li>Live Music</li>
                                    <li>Accepting Credit Cards</li>
                                    <li>Air Conditioned</li>
                                    <li>Satellite TV</li>
                                    <li>Coffeemaker</li>
                                    <li>Free Parking</li>
                                    <li>Free Wifi</li>
                                    <li>Free Coffee</li>
                                </ul>
                            </div> */}

                            {/* <div id="utf_listing_faq" class="utf_listing_section">
                                <h3 class="utf_listing_headline_part margin-top-50 margin-bottom-40">FAQ's</h3>
                                <div class="style-2">
                                    <div class="accordion">
                                        <h3><span class="ui-accordion-header-icon ui-icon ui-accordion-icon"></span><i class="sl sl-icon-plus"></i> (1) How to Open an Account?</h3>
                                        <div>
                                            <p>Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum is simply dummy text of the printing and type setting industry.</p>
                                        </div>
                                        <h3><span class="ui-accordion-header-icon ui-icon ui-accordion-icon"></span><i class="sl sl-icon-plus"></i> (2) How to Add Listing?</h3>
                                        <div>
                                            <p>Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum is simply dummy text of the printing and type setting industry.</p>
                                        </div>
                                        <h3><span class="ui-accordion-header-icon ui-icon ui-accordion-icon"></span><i class="sl sl-icon-plus"></i> (3) What is Featured Listing?</h3>
                                        <div>
                                            <p>Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum is simply dummy text of the printing and type setting industry.</p>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {/* <div id="utf_listing_location" class="utf_listing_section">
                                <h3 class="utf_listing_headline_part margin-top-60 margin-bottom-40">Location</h3>
                                <div id="utf_single_listing_map_block">
                                    <div id="utf_single_listingmap" data-latitude="36.778259" data-longitude="-119.417931" data-map-icon="im im-icon-Hamburger"></div>
                                    <a href="#" id="utf_street_view_btn">Street View</a>
                                </div>
                            </div> */}
                            <div id="utf_listing_reviews" class="utf_listing_section">
                                <h3 class="utf_listing_headline_part margin-top-75 margin-bottom-20">Reviews <span>({listHotelReviews.length})</span></h3>
                                <div class="clearfix"></div>
                                <div class="reviews-container">
                                    <div class="row">
                                        <div class="col-lg-3">
                                            <div id="review_summary">
                                                <strong>{averageRating.toFixed(2)}</strong>
                                                {/* <em>Superb Reviews</em> */}
                                                <small>Out of {listHotelReviews.length} Reviews</small>
                                            </div>
                                        </div>
                                        <div class="col-lg-9">
                                            <div class="row">
                                                <div class="col-lg-2 review_progres_title"><small><strong>Quality</strong></small></div>
                                                <div class="col-lg-9">
                                                    <div class="progress">
                                                        <div class="progress-bar" role="progressbar" style={{ width: '95%' }} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-1 review_progres_title"><small><strong>77</strong></small></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-2 review_progres_title"><small><strong>Space</strong></small></div>
                                                <div class="col-lg-9">
                                                    <div class="progress">
                                                        <div class="progress-bar" role="progressbar" style={{ width: '90%' }} aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-1 review_progres_title"><small><strong>15</strong></small></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-2 review_progres_title"><small><strong>Price</strong></small></div>
                                                <div class="col-lg-9">
                                                    <div class="progress">
                                                        <div class="progress-bar" role="progressbar" style={{ width: '70%' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-1 review_progres_title"><small><strong>18</strong></small></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-2 review_progres_title"><small><strong>Service</strong></small></div>
                                                <div class="col-lg-9">
                                                    <div class="progress">
                                                        <div class="progress-bar" role="progressbar" style={{ width: '40%' }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-1 review_progres_title"><small><strong>10</strong></small></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-2 review_progres_title"><small><strong>Location</strong></small></div>
                                                <div class="col-lg-9">
                                                    <div class="progress">
                                                        <div class="progress-bar" role="progressbar" style={{ width: '20%' }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-1 review_progres_title"><small><strong>05</strong></small></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="comments utf_listing_reviews">
                                    <ul>
                                        {listHotelReviews.map((listHotelReview)=> (
                                            <li key={listHotelReview.id}>
                                                <div class="avatar"><img src={`${baseURL}/${listHotelReview.profile_image}`} alt="" /></div>
                                                <div class="utf_comment_content">
                                                    <div class="utf_arrow_comment"></div>
                                                    <div class="utf_star_rating_section" data-rating="5"></div>
                                                    <a href="#" class="rate-review">Helpful Review <i class="fa fa-thumbs-up"></i></a>
                                                    <div class="utf_by_comment">{listHotelReview.email}<span class="date"><i class="fa fa-clock-o"></i>{formatDate(listHotelReview.date)}</span> </div>
                                                    <p>{listHotelReview.review_text}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div class="clearfix"></div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="utf_pagination_container_part margin-top-30">
                                            <nav class="pagination">
                                                <ul>
                                                    <li><a href="#"><i class="sl sl-icon-arrow-left"></i></a></li>
                                                    <li><a href="#" class="current-page">1</a></li>
                                                    <li><a href="#">2</a></li>
                                                    <li><a href="#">3</a></li>
                                                    <li><a href="#"><i class="sl sl-icon-arrow-right"></i></a></li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                            <div id="utf_add_review" class="utf_add_review-box">
                                <h3 class="utf_listing_headline_part margin-bottom-20">Add Your Review</h3>
                                <span class="utf_leave_rating_title">Your email address will not be published.</span>
                                <div class="row">
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                        <div class="clearfix"></div>
                                        <div class="utf_leave_rating margin-bottom-30">
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <React.Fragment key={star}>
                                                <input
                                                type="radio"
                                                name="rating"
                                                id={`rating-${star}`}
                                                value={star}
                                                onChange={handleRatingChange}
                                                checked={rating === star.toString()}
                                                />
                                                <label htmlFor={`rating-${star}`} className="fa fa-star"></label>
                                            </React.Fragment>
                                        ))}
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                        <div class="add-review-photos margin-bottom-30">
                                            <div class="photoUpload"> <span>Upload Photo <i class="sl sl-icon-arrow-up-circle"></i></span>
                                                <input type="file" class="upload" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="utf_add_comment" class="utf_add_comment">
                                    <fieldset>
                                        <div>
                                            <label>Review:</label>
                                            <textarea cols="40" placeholder="Your Message..." rows="3" value={review} onChange={handleReviewChange}></textarea>
                                        </div>
                                    </fieldset>
                                    <button class="button"
                                    onClick={() => handleSubmitReview(hotelId, rating, review)}>Submit Review</button>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Sidebar --> */}
                        <div class="col-lg-4 col-md-4 margin-top-75 sidebar-search">
                            <div class="verified-badge with-tip margin-bottom-30" data-tip-content="Purchase ticket has been verified and belongs business owner or manager."> <i class="sl sl-icon-check"></i> Now Available</div>
                            <div class="utf_box_widget booking_widget_box">
                                <h3><i class="fa fa-calendar"></i> Check Room Availability</h3>
                                <div class="row with-forms margin-top-0">
                                    <div class="col-lg-12 col-md-12 select_date_box">
                                        <label for="">Name of Hotel</label>
                                        <input type="text" id="name-hotel" value={detailHotel.name} name="name-hotel"/>
                                    </div>
                                    <div class="col-lg-12 col-md-12 select_date_box">
                                        <label for="">Check-in Date</label>
                                        <input type="date" id="date-picker" value={checkin} name="checkin" placeholder="Select Date" onChange={handleCheckinDate}/>
                                    </div>
                                    <div class="col-lg-12 col-md-12 select_date_box">
                                        <label for="">Check-out Date</label>
                                        <input type="date" id="date-picker" value={checkout} name="checkout" placeholder="Select Date" onChange={handleCheckoutDate}/>
                                    </div>
                                    <div class="with-forms">
                                        <div class="col-lg-12 col-md-12 ">
                                            <label for="">Select Room Type </label>
                                            <select name="room-type" class="utf_chosen_select_single" required
                                                    onChange={handleSelectRoomType}>
                                                <option value="">Chọn loại phòng</option>
                                                {roomTypes.map(roomType => (
                                                    <option value={roomType.type}>{roomType.type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="with-forms">
                                        <div class="col-lg-12 col-md-12">
                                        <a href="#">Guests <span class="qtyTotal" name="qtyTotal">{adults + childrens}</span></a>
                                        <div class="panel-dropdown-content">
                                            <div class="qtyButtons">
                                                <div class="qtyTitle">Adults</div>
                                                <button className="btn-decrement" style={{width:'40px', border:'none' }}
                                                onClick={() => changeQuantity('adults', -1)}>-</button>
                                                <input type="text" name="adult" value={adults}/>
                                                <button className="btn-increment" style={{width:'40px', border:'none' }}
                                                onClick={() => changeQuantity('adults', 1)}>+</button>
                                            </div>
                                            <div class="qtyButtons">
                                                <div class="qtyTitle">Childrens</div>
                                                <button className="btn-decrement" style={{width:'40px', border:'none' }}
                                                onClick={() => changeQuantity('childrens', -1)}>-</button>
                                                <input type="text" name="children" value={childrens}/>
                                                <button className="btn-increment" style={{width:'40px', border:'none' }}
                                                onClick={() => changeQuantity('childrens', 1)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    
                                </div>
                                <a href="#" class="utf_progress_button button fullwidth_block margin-top-5" onClick={handleCheckRoomAvailability}>Check</a>
                                <button class="like-button add_to_wishlist"><span class="like-icon"></span> Add to Wishlist</button>
                                <div class="clearfix"></div>
                            </div>
                            <div class="utf_box_widget margin-top-35">
                                <h3><i class="sl sl-icon-phone"></i> Contact Info</h3>
                                <div class="utf_hosted_by_user_title"> <a href="#" class="utf_hosted_by_avatar_listing"><img src="images/dashboard-avatar.jpg" alt=""/></a>
                                    <h4><a href="#">Kathy Brown</a><span>Posted 3 Days Ago</span>
                                        <span><i class="sl sl-icon-location"></i> Lonsdale St, Melbourne</span>
                                    </h4>
                                </div>
                                <ul class="utf_social_icon rounded margin-top-10">
                                    <li><a class="facebook" href="#"><i class="icon-facebook"></i></a></li>
                                    <li><a class="twitter" href="#"><i class="icon-twitter"></i></a></li>
                                    <li><a class="gplus" href="#"><i class="icon-gplus"></i></a></li>
                                    <li><a class="linkedin" href="#"><i class="icon-linkedin"></i></a></li>
                                    <li><a class="instagram" href="#"><i class="icon-instagram"></i></a></li>
                                </ul>
                                <ul class="utf_listing_detail_sidebar">
                                    <li><i class="sl sl-icon-map"></i> 12345 Little Lonsdale St, Melbourne</li>
                                    <li><i class="sl sl-icon-phone"></i> +(012) 1123-254-456</li>
                                    <li><i class="sl sl-icon-globe"></i> <a href="#">www.example.com</a></li>
                                    <li><i class="fa fa-envelope-o"></i> <a href="mailto:info@example.com">info@example.com</a></li>
                                </ul>
                            </div>

                            <div class="utf_box_widget opening-hours margin-top-35">
                                <h3><i class="sl sl-icon-clock"></i> Timing</h3>
                                <ul>
                                    <li>Monday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Tuesday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Wednesday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Thursday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Friday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Saturday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Sunday <span>09:00 AM - 10:00 PM</span></li>
                                </ul>
                            </div>
                            <div class="opening-hours margin-top-35">
                                <div class="utf_coupon_widget" style={{ backgroundImage: 'url(images/coupon-bg-1.jpg)' }}>
                                    <div class="utf_coupon_overlay"></div>
                                    <a href="#" class="utf_coupon_top">
                                        <h3>Book Now & Get 50% Discount</h3>
                                        <div class="utf_coupon_expires_date">Date of Expires 05/08/2022</div>
                                        <div class="utf_coupon_used"><strong>How to use?</strong> Just show us this coupon on a screen</div>
                                    </a>
                                    <div class="utf_coupon_bottom">
                                        <p>Coupon Code</p>
                                        <div class="utf_coupon_code">DL76T</div>
                                    </div>
                                </div>
                            </div>

                            <div class="utf_box_widget opening-hours margin-top-35">
                                <h3><i class="sl sl-icon-envelope-open"></i> Sidebar Form</h3>
                                <form id="contactform">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <input name="name" type="text" placeholder="Name" required=""/>
                                        </div>
                                        <div class="col-md-12">
                                            <input name="email" type="email" placeholder="Email" required=""/>
                                        </div>
                                        <div class="col-md-12">
                                            <input name="phone" type="text" placeholder="Phone" required=""/>
                                        </div>
                                        <div class="col-md-12">
                                            <textarea name="comments" cols="40" rows="2" id="comments" placeholder="Your Message" required=""></textarea>
                                        </div>
                                    </div>
                                    <input type="submit" class="submit button" id="submit" value="Contact Agent"/>
                                </form>
                            </div>
                            <div class="utf_box_widget opening-hours margin-top-35">
                                <h3><i class="sl sl-icon-info"></i> Google AdSense</h3>
                                <span><img src="images/google_adsense.jpg" alt="" /></span>
                            </div>
                            <div class="utf_box_widget margin-top-35">
                                <h3><i class="sl sl-icon-phone"></i> Quick Contact to Help?</h3>
                                <p>Excepteur sint occaecat non proident, sunt in culpa officia deserunt mollit anim id est laborum.</p>
                                <ul class="utf_social_icon rounded">
                                    <li><a class="facebook" href="#"><i class="icon-facebook"></i></a></li>
                                    <li><a class="twitter" href="#"><i class="icon-twitter"></i></a></li>
                                    <li><a class="gplus" href="#"><i class="icon-gplus"></i></a></li>
                                    <li><a class="linkedin" href="#"><i class="icon-linkedin"></i></a></li>
                                    <li><a class="instagram" href="#"><i class="icon-instagram"></i></a></li>
                                </ul>
                                <a class="utf_progress_button button fullwidth_block margin-top-5" href="contact.html">Contact Us</a>
                            </div>
                            <div class="utf_box_widget listing-share margin-top-35 margin-bottom-40 no-border">
                                <h3><i class="sl sl-icon-pin"></i> Bookmark Listing</h3>
                                <span>1275 People Bookmarked Listings</span>
                                <button class="like-button"><span class="like-icon"></span> Login to Bookmark Listing</button>
                                <ul class="utf_social_icon rounded margin-top-35">
                                    <li><a class="facebook" href="#"><i class="icon-facebook"></i></a></li>
                                    <li><a class="twitter" href="#"><i class="icon-twitter"></i></a></li>
                                    <li><a class="gplus" href="#"><i class="icon-gplus"></i></a></li>
                                    <li><a class="linkedin" href="#"><i class="icon-linkedin"></i></a></li>
                                    <li><a class="instagram" href="#"><i class="icon-instagram"></i></a></li>
                                </ul>
                                <div class="clearfix"></div>
                            </div>
                            <div class="utf_box_widget opening-hours review-avg-wrapper margin-top-35">
                                <h3><i class="sl sl-icon-star"></i> Rating Average </h3>
                                <div class="box-inner">
                                    <div class="rating-avg-wrapper text-theme clearfix">
                                        <div class="rating-avg">4.8</div>
                                        <div class="rating-after">
                                            <div class="rating-mode">/5 Average</div>

                                        </div>
                                    </div>
                                    <div class="ratings-avg-wrapper">
                                        <div class="ratings-avg-item">
                                            <div class="rating-label">Quality</div>
                                            <div class="rating-value text-theme">5.0</div>
                                        </div>
                                        <div class="ratings-avg-item">
                                            <div class="rating-label">Location</div>
                                            <div class="rating-value text-theme">4.5</div>
                                        </div>
                                        <div class="ratings-avg-item">
                                            <div class="rating-label">Space</div>
                                            <div class="rating-value text-theme">3.5</div>
                                        </div>
                                        <div class="ratings-avg-item">
                                            <div class="rating-label">Service</div>
                                            <div class="rating-value text-theme">4.0</div>
                                        </div>
                                        <div class="ratings-avg-item">
                                            <div class="rating-label">Price</div>
                                            <div class="rating-value text-theme">5.0</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <section class="fullwidth_block padding-top-20 padding-bottom-50">
                    <div class="container">
                        <div class="row slick_carousel_slider">
                            <div class="col-md-12">
                                <h3 class="headline_part centered margin-bottom-25">Similar Listings</h3>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="simple_slick_carousel_block utf_dots_nav">
                                        <div class="utf_carousel_item">
                                            <a href="listings_single_page_1.html" class="utf_listing_item-container compact">
                                                <div class="utf_listing_item"> <img src="images/utf_listing_item-01.jpg" alt=""/> <span class="tag"><i class="im im-icon-Chef-Hat"></i> Restaurant</span> <span class="featured_tag">Featured</span>
                                                    <span class="utf_open_now">Open Now</span>
                                                    <div class="utf_listing_item_content">
                                                        <div class="utf_listing_prige_block">
                                                            <span class="utf_meta_listing_price"><i class="fa fa-tag"></i> $25 - $55</span>
                                                            <span class="utp_approve_item"><i class="utf_approve_listing"></i></span>
                                                        </div>
                                                        <h3>Chontaduro Barcelona</h3>
                                                        <span><i class="fa fa-map-marker"></i> The Ritz-Carlton, Hong Kong</span>
                                                        <span><i class="fa fa-phone"></i> (+15) 124-796-3633</span>
                                                    </div>
                                                </div>
                                                <div class="utf_star_rating_section" data-rating="4.5">
                                                    <div class="utf_counter_star_rating">(4.5)</div>
                                                    <span class="utf_view_count"><i class="fa fa-eye"></i> 822+</span>
                                                    <span class="like-icon"></span>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="utf_carousel_item">
                                            <a href="listings_single_page_1.html" class="utf_listing_item-container compact">
                                                <div class="utf_listing_item"> <img src="images/utf_listing_item-02.jpg" alt=""/> <span class="tag"><i class="im im-icon-Electric-Guitar"></i> Events</span>
                                                    <div class="utf_listing_item_content">
                                                        <div class="utf_listing_prige_block">
                                                            <span class="utf_meta_listing_price"><i class="fa fa-tag"></i> $45 - $70</span>
                                                        </div>
                                                        <h3>The Lounge & Bar</h3>
                                                        <span><i class="fa fa-map-marker"></i> The Ritz-Carlton, Hong Kong</span>
                                                        <span><i class="fa fa-phone"></i> (+15) 124-796-3633</span>
                                                    </div>
                                                </div>
                                                <div class="utf_star_rating_section" data-rating="4.5">
                                                    <div class="utf_counter_star_rating">(4.5)</div>
                                                    <span class="utf_view_count"><i class="fa fa-eye"></i> 822+</span>
                                                    <span class="like-icon"></span>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="utf_carousel_item">
                                            <a href="listings_single_page_1.html" class="utf_listing_item-container compact">
                                                <div class="utf_listing_item"> <img src="images/utf_listing_item-03.jpg" alt=""/> <span class="tag"><i class="im im-icon-Hotel"></i> Hotels</span>
                                                    <span class="utf_closed">Closed</span>
                                                    <div class="utf_listing_item_content">
                                                        <div class="utf_listing_prige_block">
                                                            <span class="utf_meta_listing_price"><i class="fa fa-tag"></i> $25 - $55</span>
                                                        </div>
                                                        <h3>Westfield Sydney</h3>
                                                        <span><i class="fa fa-map-marker"></i> The Ritz-Carlton, Hong Kong</span>
                                                        <span><i class="fa fa-phone"></i> (+15) 124-796-3633</span>
                                                    </div>
                                                </div>
                                                <div class="utf_star_rating_section" data-rating="4.5">
                                                    <div class="utf_counter_star_rating">(4.5)</div>
                                                    <span class="utf_view_count"><i class="fa fa-eye"></i> 822+</span>
                                                    <span class="like-icon"></span>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="utf_carousel_item">
                                            <a href="listings_single_page_1.html" class="utf_listing_item-container compact">
                                                <div class="utf_listing_item"> <img src="images/utf_listing_item-04.jpg" alt=""/> <span class="tag"><i class="im im-icon-Dumbbell"></i> Fitness</span>
                                                    <div class="utf_listing_item_content">
                                                        <div class="utf_listing_prige_block">
                                                            <span class="utf_meta_listing_price"><i class="fa fa-tag"></i> $45 - $70</span>
                                                            <span class="utp_approve_item"><i class="utf_approve_listing"></i></span>
                                                        </div>
                                                        <h3>Ruby Beauty Center</h3>
                                                        <span><i class="fa fa-map-marker"></i> The Ritz-Carlton, Hong Kong</span>
                                                        <span><i class="fa fa-phone"></i> (+15) 124-796-3633</span>
                                                    </div>
                                                </div>
                                                <div class="utf_star_rating_section" data-rating="4.5">
                                                    <div class="utf_counter_star_rating">(4.5)</div>
                                                    <span class="utf_view_count"><i class="fa fa-eye"></i> 822+</span>
                                                    <span class="like-icon"></span>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="utf_carousel_item">
                                            <a href="listings_single_page_1.html" class="utf_listing_item-container compact">
                                                <div class="utf_listing_item"> <img src="images/utf_listing_item-05.jpg" alt=""/> <span class="tag"><i class="im im-icon-Hotel"></i> Hotels</span> <span class="featured_tag">Featured</span>
                                                    <span class="utf_closed">Closed</span>
                                                    <div class="utf_listing_item_content">
                                                        <div class="utf_listing_prige_block">
                                                            <span class="utf_meta_listing_price"><i class="fa fa-tag"></i> $45 - $70</span>
                                                        </div>
                                                        <h3>UK Fitness Club</h3>
                                                        <span><i class="fa fa-map-marker"></i> The Ritz-Carlton, Hong Kong</span>
                                                        <span><i class="fa fa-phone"></i> (+15) 124-796-3633</span>
                                                    </div>
                                                </div>
                                                <div class="utf_star_rating_section" data-rating="4.5">
                                                    <div class="utf_counter_star_rating">(4.5)</div>
                                                    <span class="utf_view_count"><i class="fa fa-eye"></i> 822+</span>
                                                    <span class="like-icon"></span>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="utf_carousel_item">
                                            <a href="listings_single_page_1.html" class="utf_listing_item-container compact">
                                                <div class="utf_listing_item"> <img src="images/utf_listing_item-06.jpg" alt=""/> <span class="tag"><i class="im im-icon-Chef-Hat"></i> Restaurant</span>
                                                    <span class="utf_open_now">Open Now</span>
                                                    <div class="utf_listing_item_content">
                                                        <div class="utf_listing_prige_block">
                                                            <span class="utf_meta_listing_price"><i class="fa fa-tag"></i> $25 - $45</span>
                                                            <span class="utp_approve_item"><i class="utf_approve_listing"></i></span>
                                                        </div>
                                                        <h3>Fairmont Pacific Rim</h3>
                                                        <span><i class="fa fa-map-marker"></i> The Ritz-Carlton, Hong Kong</span>
                                                        <span><i class="fa fa-phone"></i> (+15) 124-796-3633</span>
                                                    </div>
                                                </div>
                                                <div class="utf_star_rating_section" data-rating="4.5">
                                                    <div class="utf_counter_star_rating">(4.5)</div>
                                                    <span class="utf_view_count"><i class="fa fa-eye"></i> 822+</span>
                                                    <span class="like-icon"></span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                <section class="utf_cta_area_item utf_cta_area2_block">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="utf_subscribe_block clearfix">
                                    <div class="col-md-8 col-sm-7">
                                        <div class="section-heading">
                                            <h2 class="utf_sec_title_item utf_sec_title_item2">Subscribe to Newsletter!</h2>
                                            <p class="utf_sec_meta">
                                                Subscribe to get latest updates and information.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-5">
                                        <div class="contact-form-action">
                                            <form method="post">
                                                <span class="la la-envelope-o"></span>
                                                <input class="form-control" type="email" placeholder="Enter your email" required=""/>
                                                <button class="utf_theme_btn" type="submit">Subscribe</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <!-- Footer --> */}
                <div id="footer" class="footer_sticky_part">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-2 col-sm-3 col-xs-6">
                                <h4>Useful Links</h4>
                                <ul class="social_footer_link">
                                    <li><a href="#">Home</a></li>
                                    <li><a href="#">Listing</a></li>
                                    <li><a href="#">Blog</a></li>
                                    <li><a href="#">Privacy Policy</a></li>
                                    <li><a href="#">Contact</a></li>
                                </ul>
                            </div>
                            <div class="col-md-2 col-sm-3 col-xs-6">
                                <h4>My Account</h4>
                                <ul class="social_footer_link">
                                    <li><a href="#">Dashboard</a></li>
                                    <li><a href="#">Profile</a></li>
                                    <li><a href="#">My Listing</a></li>
                                    <li><a href="#">Favorites</a></li>
                                </ul>
                            </div>
                            <div class="col-md-2 col-sm-3 col-xs-6">
                                <h4>Pages</h4>
                                <ul class="social_footer_link">
                                    <li><a href="#">Blog</a></li>
                                    <li><a href="#">Our Partners</a></li>
                                    <li><a href="#">How It Work</a></li>
                                    <li><a href="#">Privacy Policy</a></li>
                                </ul>
                            </div>
                            <div class="col-md-2 col-sm-3 col-xs-6">
                                <h4>Help</h4>
                                <ul class="social_footer_link">
                                    <li><a href="#">Sign In</a></li>
                                    <li><a href="#">Register</a></li>
                                    <li><a href="#">Add Listing</a></li>
                                    <li><a href="#">Pricing</a></li>
                                    <li><a href="#">Contact Us</a></li>
                                </ul>
                            </div>
                            <div class="col-md-4 col-sm-12 col-xs-12">
                                <h4>About Us</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="footer_copyright_part">Copyright © 2022 All Rights Reserved.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="bottom_backto_top"><a href="#"></a></div>
            </div>

            {/* <!-- Style Switcher --> */}
            <div id="color_switcher_preview">
                <h2>Choose Your Color <a href="#"><i class="fa fa-gear fa-spin (alias)"></i></a></h2>
                <div>
                    <ul class="colors" id="color1">
                        <li><a href="#" class="stylesheet"></a></li>
                        <li><a href="#" class="stylesheet_1"></a></li>
                        <li><a href="#" class="stylesheet_2"></a></li>
                        <li><a href="#" class="stylesheet_3"></a></li>
                        <li><a href="#" class="stylesheet_4"></a></li>
                        <li><a href="#" class="stylesheet_5"></a></li>
                    </ul>
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

export default DetailHotel