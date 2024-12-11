
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiRequest } from '../../utils/api';
import API_BASE_URL from '../../config/apiConfig';
const ChangePassword = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');



    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
        Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            title: 'Đăng xuất thành công!',
            showConfirmButton: false,
            timer: 15000
        });
    };

    const handleChangePassword = async () => {
        const URL = `${API_BASE_URL}/user/api/userauths/change-password/`
        const data = {
            old_password : currentPassword,
            new_password : newPassword
        }
        Swal.fire({
            icon: 'question',
            title: 'Xác nhận đổi mật khẩu!',
            text: 'Kiểm tra mật khẩu đã điền chính xác!',
            showCancelButton: true, 
            confirmButtonText: 'Ok',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                if(newPassword !== confirmPassword) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Mật khẩu không trùng khớp.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }
                else {
                    try {
                        const response = await apiRequest(URL, 'PATCH', data);
                        console.log(response.data);
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công!',
                            text: 'Đổi mật khẩu thành công.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    catch (error) {
                        if (error.response && error.response.data) {
                            const errorMessage = error.response.data.error;
                            if (errorMessage === 'Incorrect old password.') {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Lỗi!',
                                    text: 'Mật khẩu cũ không đúng.',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Lỗi!',
                                    text: errorMessage,
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            }  
                        }
                    }
                }
            } else {
                console.log("Huỷ đổi mật khẩu.");
            }
        })

        // if(newPassword !== confirmPassword) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Lỗi!',
        //         text: 'Mật khẩu không trùng khớp.',
        //         showConfirmButton: false,
        //         timer: 1500
        //     });
        //     return;
        // }
        // else {
        //     try {
        //         const response = await apiRequest(URL, 'PATCH', data);
        //         console.log(response.data);
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Thành công!',
        //             text: 'Đổi mật khẩu thành công.',
        //             showConfirmButton: false,
        //             timer: 1500
        //         });
        //     }
        //     catch (error) {
        //         if (error.response && error.response.data) {
        //             const errorMessage = error.response.data.error;
        //             if (errorMessage === 'Incorrect old password.') {
        //                 Swal.fire({
        //                     icon: 'error',
        //                     title: 'Lỗi!',
        //                     text: 'Mật khẩu cũ không đúng.',
        //                     showConfirmButton: false,
        //                     timer: 1500
        //                 });
        //             } else {
        //                 Swal.fire({
        //                     icon: 'error',
        //                     title: 'Lỗi!',
        //                     text: errorMessage,
        //                     showConfirmButton: false,
        //                     timer: 1500
        //                 });
        //             }  
        //         }
        //     }
        // }
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
                        <Link to="/user-profile/history-review"><li style={{ borderBottom: '1px solid #ccc' }}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-star"></i>History Reviews</a></li></Link>
                        <Link to="/user-profile/my-profile"><li style={{ borderBottom: '1px solid #ccc'}} ><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-user"></i> My Profile</a></li></Link>
                        <Link to="/user-profile/change-password"><li  class="active" style={{ borderBottom: '1px solid #ccc' }}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-key"></i> Change Password</a></li></Link>
                        <li style={{ borderBottom: '1px solid #ccc' }} onClick={handleLogout}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-power"></i> Logout</a></li>
                    </ul>
                </div>
                </div>
                <div class="utf_dashboard_content"> 
                <div id="titlebar" class="dashboard_gradient">
                    <div class="row">
                    <div class="col-md-12">
                        <h2>Change Password</h2>
                        <nav id="breadcrumbs">
                        <ul>
                            <li><a href="index_1.html">Home</a></li>
                            <li><a href="dashboard.html">Dashboard</a></li>
                            <li>Change Password</li>
                        </ul>
                        </nav>
                    </div>
                    </div>
                </div>
                <div class="row"> 
                    <div class="col-lg-12 col-md-12">
                    <div class="utf_dashboard_list_box margin-top-0">
                        <h4 class="gray"><i class="sl sl-icon-key"></i> Change Password</h4>
                        <div class="utf_dashboard_list_box-static"> 
                        <div class="my-profile">
                            <div class="row with-forms">
                                <div class="col-md-4">
                                    <label>Current Password</label>						
                                    <input type="password" class="input-text" name="password" placeholder="" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                                </div>
                                <div class="col-md-4">
                                    <label>New Password</label>						
                                    <input type="password" class="input-text" name="password" placeholder="" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                                </div>
                                <div class="col-md-4">
                                    <label>Confirm New Password</label>
                                    <input type="password" class="input-text" name="password" placeholder="" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                                </div>
                                <div class="col-md-12">
                                    <button class="button btn_center_item margin-top-15" onClick={handleChangePassword}>Change Password</button>
                                </div>
                            </div>
                        </div>
                        </div>
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
};
export default ChangePassword;