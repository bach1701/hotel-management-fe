import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";
import { apiRequest } from "../../utils/api";
import { Anchor } from 'antd';
import Header from "../baseComponent/Header";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';


const ProfilePage = () => {

    const [profileUser, setProfileUser] = useState({});
    const [inforUser, setInforUser] = useState({});
    const [editableProfile, setEditableProfile] = useState({});
    const [profileImage, setProfileImage] = useState(null);  
    const [profileImagePreview, setProfileImagePreview] = useState('');  

    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect (() => {
        fetchProfile()
    },[]);

    const fetchProfile = async () => {
        console.log("1");
        const URL = `${API_BASE_URL}/user/api/userauths/profile/`;
        try {
            const response = await apiRequest(URL);
            setProfileUser(response.data.profile);
            setInforUser(response.data.user);
            setEditableProfile(response.data.profile);
            console.log(response.data);
            console.log("2");
        }
        catch (err) {
            console.error(err);
            console.log("3");
        }
    }
    
    const handleLogout = () => {
        logout(); 
        localStorage.removeItem('accessToken');
        navigate('/login');
        Swal.fire({
            icon: 'success',
            title: 'Đăng xuất thành công!',
            showConfirmButton: false,
            timer: 15000
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);  
        setProfileImagePreview(URL.createObjectURL(file));  
    };

    // 
    const handleSaveChanges = async () => {
        Swal.fire({
            icon: 'question',
            title: 'Xác nhận thay đổi thông tin!',
            text: 'Kiểm tra thông tin đã điền chính xác!',
            showCancelButton: true, 
            confirmButtonText: 'Ok',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const URL = `${API_BASE_URL}/user/api/userauths/profile/edit/`; 
                const formData = new FormData();
    
                formData.append('full_name', editableProfile.full_name || '');
                formData.append('phone', editableProfile.phone || '');
                formData.append('gender', editableProfile.gender || '');
                formData.append('country', editableProfile.country || '');
                formData.append('city', editableProfile.city || '');
                formData.append('state', editableProfile.state || '');
                formData.append('address', editableProfile.address || '');
                formData.append('image', profileImage);
    
                try {
                    console.log(formData);
                    const response = await apiRequest(URL, 'PATCH', formData, {
                        'Content-Type': 'multipart/form-data'  
                    });
                    
                    fetchProfile();
                    setProfileUser(response.data.profile);
    
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: 'Thông tin cá nhân đã được cập nhật!',
                        showConfirmButton: false,
                        timer: 2000
                    }).then(() => {
                        window.location.reload();  
                    });
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error', 'Failed to update profile.', 'error');
                }
            } else {
                console.log("Changes canceled.");
            }
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
                        <Link to="/user-profile/history-review"><li style={{ borderBottom: '1px solid #ccc' }}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-star"></i>History Reviews</a></li></Link>
                        <Link to="/user-profile/my-profile"><li class="active"><a href="#" style={{ color: 'gray', borderBottom: '1px solid #ccc'}} ><i class="sl sl-icon-user"></i> My Profile</a></li></Link>
                        <Link to="/user-profile/change-password"><li style={{ borderBottom: '1px solid #ccc' }}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-key"></i> Change Password</a></li></Link>
                        <li style={{ borderBottom: '1px solid #ccc' }} onClick={handleLogout}><a href="#" style={{ color: 'gray' }}><i class="sl sl-icon-power"></i> Logout</a></li>
                    </ul>
                </div>
                </div>
                <div class="utf_dashboard_content"> 
                <div id="titlebar" class="dashboard_gradient">
                    <div class="row">
                    <div class="col-md-12">
                        <h2>My Profile</h2>
                        <nav id="breadcrumbs">
                        <ul>
                            <li><a href="index_1.html">Home</a></li>
                            <li><a href="dashboard.html">Dashboard</a></li>
                            <li>My Profile</li>
                        </ul>
                        </nav>
                    </div>
                    </div>
                </div>
                <div class="row"> 
                    <div class="col-lg-12 col-md-12">
                    <div class="utf_dashboard_list_box margin-top-0">
                        <h4 class="gray"><i class="sl sl-icon-user"></i> Profile Details</h4>
                        <div class="utf_dashboard_list_box-static"> 
                        <div class="edit-profile-photo"> <img src="images/user-avatar.jpg" alt=""/>
                            <div class="change-photo-btn">
                            <div class="photoUpload"> <span><i class="fa fa-upload"></i> Upload Photo</span>
                                <input type="file" className="upload" onChange={handleProfileImageChange} />
                            </div>
                            </div>
                        </div>
                        <div class="my-profile">
                                        <div className="row with-forms">
                                            <div className="col-md-4">
                                                <label>Full name</label>						
                                                <input type="text" className="input-text" name="full_name" placeholder="Full name ..." value={editableProfile.full_name || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-4">
                                                <label>Phone</label>						
                                                <input type="text" className="input-text" name="phone" placeholder="Phone number ..." value={editableProfile.phone || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-4">
                                                <label>Email</label>						
                                                <input type="text" className="input-text" name="email" placeholder="Email ..." value={inforUser.email || ''} disabled />
                                            </div>
                                            <div className="col-md-4">
                                                <label>Address</label>						
                                                <input type="text" className="input-text" name="address" placeholder="Address ..." value={editableProfile.address || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-4">
                                                <label>City</label>						
                                                <input type="text" className="input-text" name="city" placeholder="City ..." value={editableProfile.city || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-4">
                                                <label>Country</label>						
                                                <input type="text" className="input-text" name="country" placeholder="Country ..." value={editableProfile.country || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-2">
                                                <label>Gender</label>
                                                <select className="input-text" name="gender" value={editableProfile.gender || ''} onChange={handleInputChange}>
                                                    <option value="" disabled>Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="col-md-5">
                                                <label>Facebook</label>						
                                                <input type="text" className="input-text" placeholder="https://www.facebook.com" />
                                            </div>
                                            <div className="col-md-5">
                                                <label>Twitter</label>						
                                                <input type="text" className="input-text" placeholder="https://www.twitter.com" />
                                            </div>										
                                        </div>	
                        </div>
                        <button className="button preview btn_center_item margin-top-15" onClick={handleSaveChanges}>Save Changes</button>
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
    );
};
export default ProfilePage;