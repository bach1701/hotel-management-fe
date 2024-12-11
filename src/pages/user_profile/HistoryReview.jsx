import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import API_BASE_URL from "../../config/apiConfig";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const HistoryReview = () => {

    const [listReviews, setListReviews] = useState([]);
    const navigate = useNavigate();

    const fetchMyReviews =  async () => {
        const URL = `${API_BASE_URL}/api/reviews/my-reviews/`;
        try {
            const response = await apiRequest(URL);
            setListReviews(response.data);
            console.log(response.data); 
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchMyReviews();
    },[]);

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

    const handleDeleteReview = async (reviewId) => {
        const URL = `${API_BASE_URL}/api/reviews/delete/${reviewId}/`;
        try {
            const response = await apiRequest(URL, 'DELETE');
            fetchMyReviews();
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Bạn đã xoá review thành công!',
                timer: 2000,
                showConfirmButton: false,
            })
        }
        catch (error) {
            console.error(error);
        }
    }

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
                        <Link to="/user-profile/history-booking"><li style={{ borderBottom: '1px solid #ccc' }}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-docs"></i>History Booking</a></li></Link>	  
                        <Link to="/user-profile/history-review"><li  class="active" style={{ borderBottom: '1px solid #ccc' }}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-star"></i>History Reviews</a></li></Link>
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
                        <h2>Reviews</h2>
                        <nav id="breadcrumbs">
                        <ul>
                            <li><a href="index_1.html">Home</a></li>
                            <li><a href="dashboard.html">Dashboard</a></li>
                            <li> History Reviews</li>
                        </ul>
                        </nav>
                    </div>
                    </div>
                </div>
                <div class="row"> 
                    <div class="col-lg-12 col-md-12">
                    <div class="utf_dashboard_list_box margin-top-0">
                        <div class="sort-by my_sort_by">
                            <div class="utf_sort_by_select_item">
                            </div>
                        </div>
                        <h4><i class="sl sl-icon-star"></i> History Reviews</h4>
                        <div id="small-dialog" class="zoom-anim-dialog mfp-hide">
                        <div class="small_dialog_header">
                            <h3>Reply to Review</h3>
                        </div>
                        <div class="utf_message_reply_block margin-top-0">
                            <textarea cols="40" rows="3" placeholder="Your Message..."></textarea>
                            <button class="button">Reply Message</button>
                        </div>
                        </div>
                        <ul>
                            <li>
                                {listReviews.map(listReview => (
                                    <li>
                                        <div class="comments utf_listing_reviews dashboard_review_item">
                                            <ul>
                                                <li>
                                                    <div class="avatar"><img src={`${API_BASE_URL}/${listReview.profile_image}`} alt="" /></div>
                                                    <div class="utf_comment_content">
                                                        <div class="utf_arrow_comment"></div>
                                                        <div class="utf_by_comment">{listReview.email}
                                                        <div class="utf_by_comment-listing"> on <a href="#">{listReview.hotel_name}</a></div>
                                                        <span class="date"><i class="fa fa-clock-o"></i>{formatDate(listReview.date)}</span>
                                                        <div class="utf_star_rating_section" data-rating="5"></div>
                                                        <a href="" class="rate-review popup-with-zoom-anim" onClick={()=>handleDeleteReview(listReview.id)}>Delete<i class="fa fa-remove"></i></a> 
                                                        </div>
                                                        <p>{listReview.review_text}</p>						
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                ))}
                            </li>			  
                        </ul>
                    </div>          
                    <div class="clearfix"></div>
                    <div class="utf_pagination_container_part margin-top-30 margin-bottom-30">
                        <nav class="pagination">
                        <ul>
                            <li><a href="#"><i class="sl sl-icon-arrow-left"></i></a></li>
                            <li><a href="#" class="current-page">1</a></li>
                            <li><a href="#">2</a></li>
                            <li><a href="#">3</a></li>
                            <li><a href="#">4</a></li>
                            <li><a href="#"><i class="sl sl-icon-arrow-right"></i></a></li>
                        </ul>
                        </nav>
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

export default HistoryReview;