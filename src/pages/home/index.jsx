import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRoomCount } from './RoomCountContext/RoomCountContext';
import API_BASE_URL from '../../config/apiConfig';
import { Link } from 'react-router-dom';


const Index = ()=>{
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hotelName, setHotelName] = useState('');
    const { setRoomCount } = useRoomCount();
    const token = localStorage.getItem('accessToken');
    const baseURL = API_BASE_URL;

    const handleSearch = () => {
        if(hotelName != '')
            navigate(`/listhotel?name=${encodeURIComponent(hotelName)}`); 
        else navigate(`/listhotel`);
    };

    useEffect(() => {
        const fetchHotels = async () => {
            console.log('baseURL: ' + baseURL);
            try {
                const response = await axios.get(`${baseURL}/api/hotels/`);
                console.log(response.data);
                setHotels(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

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
        if (token) {
            console.log('access token:', token);
            fetchCartItemCount();
        }
        fetchHotels();
      }, []);
    
      if (loading) return <p>Loading hotels...</p>;
      if (error) return <p>Error: {error}</p>;
      
    return (
        <div id="main_wrapper">
            {/* <Header /> */}
            <div class="clearfix"></div>

            {/* Banner */}
            <div class="search_container_block main_search_block" data-background-image="images/home_section_1.jpg" style={{ backgroundImage: 'url("images/home_section_1.jpg")' }}>
                <div class="main_inner_search_block">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
                                <h2>Book Unique Experiences</h2>
                                <h4>Discover top rated hotels, shops and restaurants around the world</h4>
                                <div class="main_input_search_part">
                                    <div class="main_input_search_part_item">
                                        <input type="text" placeholder="Type name of hotel..." 
                                        value={hotelName} onChange={(e)=>setHotelName(e.target.value)} 
                                        />
                                    </div>
                                    <div class="main_input_search_part_item main-search-input-item search-input-icon">
                                        <input type="text" placeholder="Select Booking Date" id="booking-date-search"/>
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                    <div class="main_input_search_part_item intro-search-field">
                                        <select data-placeholder="All Categories" class="selectpicker default" title="All Categories" data-live-search="true" data-selected-text-format="count" data-size="5">
                                <option>Food & Restaurants </option>
                                <option>Shop & Education</option>
                                <option>Education</option>
                                <option>Business</option>
                                <option>Events</option>
                                </select>
                                    </div>
                                    <button class="button" onclick="window.location.href='listings_half_screen_map_list.html'" onClick={handleSearch}>Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="fullwidth_block search_categorie_block">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <h3 class="headline_part centered margin-top-75 margin-bottom-45">Top Featured Locations <span>What do you want to do today</span> </h3>
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a href="#" class="category_item_box">
                                        <div class="featured-type featured">
                                            Top <br/>Featured
                                        </div>
                                        <img src="images/category-box-01.jpg" alt="" />
                                        <span class="category_item_box_btn">Browse</span>
                                        <div class="category_content_box_part">
                                            <h3>New York City</h3>
                                            <span>15 listings</span>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a href="#" class="category_item_box"> 
                        <img src="images/category-box-02.jpg" alt=""/>
                        <span class="category_item_box_btn">Browse</span>
                        <div class="category_content_box_part">
                            <h3>Chicago</h3>
                            <span>27 Listings</span> 
                        </div>
                        </a>
                                </div>
                            </div>

                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a href="#" class="category_item_box"> 
                        <img src="images/category-box-03.jpg" alt=""/>
                        <span class="category_item_box_btn">Browse</span>
                            <div class="category_content_box_part">
                            <h3>Los Angeles</h3>
                            <span>22 Listings</span> 
                            </div>
                        </a>
                                </div>
                            </div>

                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a href="#" class="category_item_box"> 
                        <img src="images/category-box-04.jpg" alt=""/> 
                        <span class="category_item_box_btn">Browse</span>
                        <div class="category_content_box_part">
                            <h3>San Francisco</h3>
                            <span>15 Listings</span> 
                        </div>
                        </a>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a href="#" class="category_item_box">
                                        <div class="featured-type featured">
                                            Top <br/>Rated City
                                        </div>
                                        <img src="images/category-box-05.jpg" alt="" />
                                        <span class="category_item_box_btn">Browse</span>
                                        <div class="category_content_box_part">
                                            <h3>Washington</h3>
                                            <span>26 Listings</span>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a href="#" class="category_item_box"> 
                        <img src="images/category-box-06.jpg" alt=""/>
                        <span class="category_item_box_btn">Browse</span>
                        <div class="category_content_box_part">
                            <h3>Seattle</h3>
                            <span>27 Listings</span> 
                        </div>
                        </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>

            <section class="fullwidth_block margin-top-65 padding-top-75 padding-bottom-70" data-background-color="#f9f9f9">
                <div class="container">
                    <div class="row slick_carousel_slider">
                        <div class="col-md-12">
                            <h3 class="headline_part centered margin-bottom-45">Our Popular Tours <span>Explore the greates places in the city</span> </h3>
                        </div>
                        <div class="row">     
                            <div class="col-md-12">
                                <div class="simple_slick_carousel_block utf_dots_nav">
                                    <ul className="hotels-list">
                                        {hotels.map(hotel=>(
                                            <li>
                                                <div class="utf_carousel_item">
                                                    <Link to={`/detailhotel/${hotel.slug}`} class="utf_listing_item-container compact">
                                                        <div class="utf_listing_item"> <img src={hotel.map_image} alt=""/> <span class="tag"><i class="im im-icon-Chef-Hat"></i> Restaurant</span> <span class="featured_tag">Featured</span>
                                                            <span class="utf_open_now">Open Now</span>
                                                            <div class="utf_listing_item_content">
                                                                <div class="utf_listing_prige_block">
                                                                    <span class="utf_meta_listing_price"><i class="fa fa-tag"></i> $25 - $55</span>
                                                                    <span class="utp_approve_item"><i class="utf_approve_listing"></i></span>
                                                                </div>
                                                                <h3>{hotel.name}</h3>
                                                                <span><i class="fa fa-map-marker"></i>{hotel.address}</span>
                                                                <span><i class="fa fa-phone"></i>{hotel.mobile}</span>
                                                            </div>
                                                        </div>
                                                        <div class="utf_star_rating_section" data-rating="4.5">
                                                            <div class="utf_counter_star_rating">(4.6)</div>
                                                            <span class="utf_view_count"><i class="fa fa-eye"></i>{hotel.views}</span>
                                                            <span class="like-icon"></span>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="fullwidth_block padding-bottom-75">
                <div class="container">
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2">
                            <h2 class="headline_part centered margin-top-80">How It Works? <span class="margin-top-10">Discover & connect with great local businesses</span> </h2>
                        </div>
                    </div>
                    <div class="row container_icon">
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="box_icon_two box_icon_with_line"> <i class="im im-icon-Map-Marker2"></i>
                                <h3>Find Interesting Place</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque Nulla finibus.</p>
                            </div>
                        </div>

                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="box_icon_two box_icon_with_line"> <i class="im im-icon-Mail-Add"></i>
                                <h3>Contact a Few Owners</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque Nulla finibus.</p>
                            </div>
                        </div>

                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="box_icon_two"> <i class="im im-icon-Administrator"></i>
                                <h3>Make a Reservation</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque Nulla finibus.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="utf_testimonial_part fullwidth_block padding-top-75 padding-bottom-75">
                <div class="container">
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2">
                            <h3 class="headline_part centered"> What Say Our Customers <span class="margin-top-15">Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy text ever since...</span> </h3>
                        </div>
                    </div>
                </div>
                <div class="fullwidth_carousel_container_block margin-top-20">
                    <div class="utf_testimonial_carousel testimonials">
                        <div class="utf_carousel_review_part">
                            <div class="utf_testimonial_box">
                                <div class="testimonial">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae lectus suscipit, et pulvinar nisi tincidunt. Aliquam
                                    erat volutpat. Curabitur convallis fringilla diam sed aliquam. Sed tempor iaculis massa faucibus feugiat. In fermentum facilisis massa, a consequat purus viverra.</div>
                            </div>
                            <div class="utf_testimonial_author"> <img src="images/happy-client-01.jpg" alt=""/>
                                <h4>Denwen Evil <span>Web Developer</span></h4>
                            </div>
                        </div>
                        <div class="utf_carousel_review_part">
                            <div class="utf_testimonial_box">
                                <div class="testimonial">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae lectus suscipit, et pulvinar nisi tincidunt. Aliquam
                                    erat volutpat. Curabitur convallis fringilla diam sed aliquam. Sed tempor iaculis massa faucibus feugiat. In fermentum facilisis massa, a consequat purus viverra.</div>
                            </div>
                            <div class="utf_testimonial_author"> <img src="images/happy-client-02.jpg" alt=""/>
                                <h4>Adam Alloriam <span>Web Developer</span></h4>
                            </div>
                        </div>
                        <div class="utf_carousel_review_part">
                            <div class="utf_testimonial_box">
                                <div class="testimonial">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae lectus suscipit, et pulvinar nisi tincidunt. Aliquam
                                    erat volutpat. Curabitur convallis fringilla diam sed aliquam. Sed tempor iaculis massa faucibus feugiat. In fermentum facilisis massa, a consequat purus viverra.</div>
                            </div>
                            <div class="utf_testimonial_author"> <img src="images/happy-client-03.jpg" alt=""/>
                                <h4>Illa Millia <span>Project Manager</span></h4>
                            </div>
                        </div>
                        <div class="utf_carousel_review_part">
                            <div class="utf_testimonial_box">
                                <div class="testimonial">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae lectus suscipit, et pulvinar nisi tincidunt. Aliquam
                                    erat volutpat. Curabitur convallis fringilla diam sed aliquam. Sed tempor iaculis massa faucibus feugiat. In fermentum facilisis massa, a consequat purus viverra.</div>
                            </div>
                            <div class="utf_testimonial_author"> <img src="images/happy-client-01.jpg" alt=""/>
                                <h4>Denwen Evil <span>Web Developer</span></h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="fullwidth_block padding-top-75 padding-bottom-75" data-background-color="#ffffff">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <h3 class="headline_part centered margin-bottom-50"> Letest Tips & Blog<span>Discover & connect with top-rated local businesses</span></h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <a href="blog_detail_left_sidebar.html" class="blog_compact_part-container">
                                <div class="blog_compact_part"> <img src="images/blog-compact-post-01.jpg" alt=""/>
                                    <div class="blog_compact_part_content">
                                        <h3>The Most Popular New top Places Listing</h3>
                                        <ul class="blog_post_tag_part">
                                            <li>22 January 2022</li>
                                        </ul>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <a href="blog_detail_left_sidebar.html" class="blog_compact_part-container">
                                <div class="blog_compact_part"> <img src="images/blog-compact-post-02.jpg" alt=""/>
                                    <div class="blog_compact_part_content">
                                        <h3>Greatest Event Places in Listing</h3>
                                        <ul class="blog_post_tag_part">
                                            <li>18 January 2022</li>
                                        </ul>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <a href="blog_detail_left_sidebar.html" class="blog_compact_part-container">
                                <div class="blog_compact_part"> <img src="images/blog-compact-post-03.jpg" alt=""/>
                                    <div class="blog_compact_part_content">
                                        <h3>Top 15 Greatest Ideas for Health & Body</h3>
                                        <ul class="blog_post_tag_part">
                                            <li>10 January 2022</li>
                                        </ul>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <a href="blog_detail_left_sidebar.html" class="blog_compact_part-container">
                                <div class="blog_compact_part"> <img src="images/blog-compact-post-04.jpg" alt=""/>
                                    <div class="blog_compact_part_content">
                                        <h3>Top 10 Best Clothing Shops in Sydney</h3>
                                        <ul class="blog_post_tag_part">
                                            <li>18 January 2022</li>
                                        </ul>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-12 centered_content"> <a href="blog_page.html" class="button border margin-top-20">View More Blog</a> </div>
                    </div>
                </div>
            </section>

            <section class="fullwidth_block margin-bottom-0 padding-top-50 padding-bottom-50" data-background-color="linear-gradient(to bottom, #f9f9f9 0%, rgba(255, 255, 255, 1))">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="companie-logo-slick-carousel utf_dots_nav">
                                <div class="item">
                                    <img src="images/brand_logo_01.png" alt=""/>
                                </div>
                                <div class="item">
                                    <img src="images/brand_logo_02.png" alt=""/>
                                </div>
                                <div class="item">
                                    <img src="images/brand_logo_03.png" alt=""/>
                                </div>
                                <div class="item">
                                    <img src="images/brand_logo_04.png" alt=""/>
                                </div>
                                <div class="item">
                                    <img src="images/brand_logo_05.png" alt=""/>
                                </div>
                                <div class="item">
                                    <img src="images/brand_logo_06.png" alt=""/>
                                </div>
                                <div class="item">
                                    <img src="images/brand_logo_07.png" alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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

            {/* Footer */}
            <div id="footer" class="footer_sticky_part">
                <div class="container">
                    <div class="row">
                        <div class="col-md-4 col-sm-12 col-xs-12">
                            <h4>About Us</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore</p>
                        </div>
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
    )
}
export default Index