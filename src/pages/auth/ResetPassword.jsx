import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';

const ForgotPassword = () => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassWord] = useState('');

    const { id, token } = useParams();
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register'); 
    };

    const handleResetPassword = async(e) => {
        e.preventDefault();
        const URL = `${API_BASE_URL}/user/api/userauths/auth/reset-password/${id}/${token}/`;
        const data = {
            new_password: password
        }
        console.log(data);
        if (password !== confirmPassword) {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Mật khẩu không trùng khớp.',
              showConfirmButton: false,
              timer: 1500
            });
            return;
          }
        try {
            const reponse = await axios.post(URL, data);
            console.log(reponse.data);
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Reset mật khẩu thành công.',
                showConfirmButton: false,
                timer: 1500
            });
              return;
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Reset mật khẩu thất bại.',
                showConfirmButton: false,
                timer: 1500
              });
              return;
            console.log(error);
        }
    };

    return (
        <>
            <div id="main_wrapper">
                <header id="header_part" className="fullwidth">
                    <div id="header">
                        <div className="container">
                            <div className="utf_left_side">
                                <div id="logo"> <a href="/"><img src="images/logo-booking-hotel.png" alt=""/></a> </div>
                                <div className="mmenu-trigger">
                                    <button className="hamburger utfbutton_collapse" type="button">
                                        <span className="utf_inner_button_box">
                                            <span className="utf_inner_section"></span>
                                        </span>
                                    </button>
                                </div>
                                    <nav id="navigation" className="style_one">
                                    </nav>
                                <div className="clearfix"></div>
                            </div>
                            <div className="utf_right_side">
                                <div className="header_widget"> <a href="#dialog_signin_part" className="button border sign-in popup-with-zoom-anim" onClick={handleRegisterClick}><i className="fa fa-plus"></i> Register</a> <a href="/login" className="button border with-icon"><i className="sl sl-icon-login"></i> Login</a></div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="clearfix"></div>

                <div className="fullwidth_block search_categorie_block">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="headline_part centered margin-top-75 margin-bottom-45">Forgot Password <span>Please enter your email or mobile number to search for your account.</span> </h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <div className="category_container_item_part card">
                                        <div className="utf_signin_form style_one">
                                            <ul className="utf_tabs_nav">
                                            </ul>
                                            <div className="tab_container alt">
                                            <div className="tab_content" id="tab1" style={{ display: 'block' }}>
                                                <form method="post" className="forgotpassword" onSubmit={handleResetPassword}>
                                                    <p className="utf_row_form utf_form_wide_block">
                                                        <label htmlFor="username">
                                                            <input type="text" className="input-text" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password..." />
                                                        </label>
                                                    </p>
                                                    <p className="utf_row_form utf_form_wide_block">
                                                        <label htmlFor="username">
                                                            <input type="text" className="input-text" name="confirm-password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassWord(e.target.value)} placeholder="Confirm Password..." />
                                                        </label>
                                                    </p>
                                                    <div className="utf_row_form">
                                                        <input type="submit" className="button border margin-top-5" name="login" value="Reset Password" />
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <div className="category_container_item_part">
                                        <a href="/" className="category_item_box"> 
                                            <img src="images/logo-booking-hotel.png" style={{width: '100%', height: '420px'}} alt=""/>
                                            <div className="category_content_box_part">
                                                <h3>Move to Home</h3>
                                                <span>To enjoy more features</span> 
                                            </div>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>

                <div id="footer" className="footer_sticky_part">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 col-sm-12 col-xs-12">
                                <h4>About Us</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore</p>
                            </div>
                            <div className="col-md-2 col-sm-3 col-xs-6">
                                <h4>Useful Links</h4>
                                <ul className="social_footer_link">
                                    <li><a href="#">Home</a></li>
                                    <li><a href="#">Listing</a></li>
                                    <li><a href="#">Blog</a></li>
                                    <li><a href="#">Privacy Policy</a></li>
                                    <li><a href="#">Contact</a></li>
                                </ul>
                            </div>
                            <div className="col-md-2 col-sm-3 col-xs-6">
                                <h4>My Account</h4>
                                <ul className="social_footer_link">
                                    <li><a href="#">Dashboard</a></li>
                                    <li><a href="#">Profile</a></li>
                                    <li><a href="#">My Listing</a></li>
                                    <li><a href="#">Favorites</a></li>
                                </ul>
                            </div>
                            <div className="col-md-2 col-sm-3 col-xs-6">
                                <h4>Pages</h4>
                                <ul className="social_footer_link">
                                    <li><a href="#">Blog</a></li>
                                    <li><a href="#">Our Partners</a></li>
                                    <li><a href="#">How It Work</a></li>
                                    <li><a href="#">Privacy Policy</a></li>
                                </ul>
                            </div>
                            <div className="col-md-2 col-sm-3 col-xs-6">
                                <h4>Help</h4>
                                <ul className="social_footer_link">
                                    <li><a href="#">Sign In</a></li>
                                    <li><a href="#">Register</a></li>
                                    <li><a href="#">Add Listing</a></li>
                                    <li><a href="#">Pricing</a></li>
                                    <li><a href="#">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="footer_copyright_part">Copyright © 2022 All Rights Reserved.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="bottom_backto_top"><a href="#"></a></div>
            </div>
        </>
    ) 
}
export default ForgotPassword


