import React, { useState, useEffect } from 'react';
import { MdVerified } from "react-icons/md";
import { FaUser, FaGraduationCap, FaWineGlassAlt, FaSmokingBan, FaChild, FaGlobe } from 'react-icons/fa';
import { FaHeart, FaBell, FaLocationDot, FaHouse } from 'react-icons/fa6';
import { FaUserClock } from "react-icons/fa";
import { GiBodyHeight } from "react-icons/gi";
import { IoMdMan } from "react-icons/io";
import { debounce } from 'lodash';
import { FaGhost } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Navbar from './Navbar';
import API_CONFIG from '../Api_Config'
import InterestButton from './Components/InterestButton';
import CustomLoader from './Components/CustomLoader';

const UserProfile = () => {
    const [dbid, setDbid] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    // Fetch user data after dbID is available
    useEffect(() => {
        console.log("useEffect: Running when component mounts");

        const savedDBID = localStorage.getItem('dbID');
        console.log("Saved DBID from localStorage:", savedDBID);

        if (savedDBID) {
            setDbid(savedDBID);  // Save dbID

            const fetchUserData = async () => {
                const userId = savedDBID;  // Use dbid as the userId for fetching user data
                const requestUrl = `${API_CONFIG.BASE_URL}/user/GetUserById?userId=${userId}`;

                console.log("Request URL:", requestUrl); // Log the final URL

                try {
                    const response = await fetch(requestUrl, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': API_CONFIG.AUTHORIZATION_KEY,
                        },
                    });

                    if (!response.ok) {
                        console.error(`HTTP Error: ${response.status}, ${response.statusText}`);
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const jsonResponse = await response.json();  // Parse response as JSON
                    console.log("Fetched user data:", jsonResponse);

                    if (jsonResponse && jsonResponse.data && jsonResponse.data[0]) {
                        setUserData(jsonResponse.data[0]);  // Assuming the user data is in the 'data' array
                    } else {
                        console.error("Invalid user data received:", jsonResponse);
                    }
                    setLoading(false);  // Stop loading when data is fetched

                } catch (error) {
                    console.error("Error fetching user data:", error.message || error);
                    setLoading(false);  // Stop loading on error
                }
            };

            fetchUserData();
        }
    }, []); // Only run once when the component mounts

    useEffect(() => {
        console.log("useEffect: userData updated", userData);
    }, [userData]);

    if (loading) {
        return <div><CustomLoader isVisible={loading}/></div>; // Placeholder while fetching data
    }

    if (!userData) {
        return <div>No user data available</div>; // Fallback if no user data
    }

    const handleEditProfileClick = () => {
        // Navigate to the EditProfile page and pass userData as state
        console.log("Navigating to EditProfile with userData:", userData);
        navigate('/EditProfile', { state: { userData } });
    };

    const profileImage = userData.imageData?.Profile_image || 'default-profile-pic.png'; // Fallback for profile image
    const memberSince = new Date(userData.createdDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });

    // Ensure imagePaths is an array before using .find()
    const imagePaths = Array.isArray(userData.imagePaths) ? userData.imagePaths : [];

    // Use .find() only if imagePaths is not empty
    const selectedImage = imagePaths.length > 0 ? imagePaths.find(img => img.isPrimary) : null;

    // Ensure bills is an array
    // const bills = Array.isArray(userData.bills) ? userData.bills : [];
    const bills = userData.bills || ''; // Fallback for bills
    console.log("Bills:", bills);
    // const billsString = bills.join(', '); // Joins all the bills into a string with commas

    return (
        <div>
            <Navbar />
            <div className="relative flex flex-col lg:flex-row w-full max-w-[1400px] m-auto h-full p-4 gap-8">
                {/* Edit Button */}
                <button
                    onClick={handleEditProfileClick}
                    className="absolute top-6 right-6 px-4 py-2 rounded-full bg-[#e9677b] text-white hover:bg-[#d6556c] transition"
                >
                    Edit Profile
                </button>

                <aside className='w-full lg:w-[30%]'>
                    <div className='relative'>
                        <img
                            alt='Profile Pic'
                            src={selectedImage?.url || profileImage}
                            className="w-full h-96 object-cover object-center rounded-md"
                        />
                    </div>
                    <div className="w-full bg-white shadow-md rounded-lg px-4 py-5 mt-6">
                        <div className="flex flex-row justify-between">
                            <div className="flex-grow-[1] flex-shrink-[1] items-center justify-start flex gap-2">
                                <GiBodyHeight />
                                <span>{(userData.heightInInches * 0.0833333).toFixed(1)}</span>
                            </div>
                            <div className="flex-grow-[1] flex-shrink-[1] items-center justify-center flex gap-1">
                                <IoMdMan />
                                <span>{userData.bodyType}</span>
                            </div>
                            <div className="flex-grow-[1] flex-shrink-[1] items-center justify-end flex gap-2">
                                <FaHeart />
                                <span>{userData.relationshipStatus}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-white shadow-md rounded-lg px-4 py-6 mt-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center space-x-2">
                                <FaUser className="text-gray-700 w-5 h-5" />
                                <span>{userData.gender}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="flex items-center space-x-2">
                                    <FaGhost className="text-gray-700 w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className='relative top-1'><FaLocationDot /></span>
                                <span className='text-sm'>{userData.city}, {userData.country}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-white shadow-md rounded-lg px-4 py-6 mt-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className='relative '><FaUserClock /></span>
                                <span className='text-base'>Member Since</span>
                            </div>
                            <span className='text-base'>{memberSince}</span>
                        </div>
                        <hr className="border-t-1 border-gray-200 my-4" />
                        <div className="flex items-center mb-1 gap-2">
                            <h1 className="text-base font-medium">Verifications</h1>
                            {userData.isProfileVerified && <MdVerified className='text-[#4A90E2]' />}
                        </div>
                    </div>
                </aside>
                <main className="w-full lg:w-[70%] mt-6 lg:mt-0">
                    <div className='flex flex-row justify-between gap-4 items-start'>
                        <div className="pb-4">
                            <div className="flex items-center mb-1 gap-2">
                                <h1 className="text-2xl font-medium">
                                    {userData.fullName || "Full Name"}, {userData.age}
                                </h1>
                                {userData.isProfileVerified && <MdVerified className="text-2xl text-[#4A90E2]" />}
                            </div>
                            <p className="mt-1 text-base">{userData.city}, {userData.country}</p>
                        </div>
                    </div>

                    {/* About Me Section */}
                    <div className="w-full mb-6 bg-white rounded-lg shadow-md p-6 relative">
                        <h2 className="text-[#e9677b] text-lg font-semibold mb-2">About Me</h2>
                        <p className="text-base pb-4">{userData.description || "Description will be here"}</p>
                    </div>

                    {/* Seeking Section */}
                    <div className="w-full bg-white rounded-lg shadow-md p-6 relative mb-6">
                        <div className="flex row justify-between gap-4 items-center">
                            <h2 className="text-[#e9677b] text-lg font-semibold mb-2">My Intentions</h2>
                        </div>
                        <p className="text-base pb-4">{userData.intentions || "Intentions will be here"}</p>
                    </div>

                    <div className="w-full bg-white rounded-lg shadow-md p-6 relative mb-6">
                        <div className="flex row justify-between gap-4 items-center">
                            <h2 className="text-[#e9677b] text-lg font-semibold mb-2">Looking For</h2>
                        </div>
                        <p className="text-base pb-4">{userData.lookingFor || "Looking for details"}</p>
                    </div>

                    {/* Extra Details Section */}
                    <div className="w-full bg-white rounded-lg shadow-md p-6 relative">
                        <div>
                            <h2 className="text-[#e9677b] text-lg font-semibold mb-2">{userData.gender === 'Men' ? 'Bills I can Help with' : 'Bills I need Help with'}</h2>
                            <div className="grid grid-cols-2 gap-4 text-gray-800 pl-4">
                                {bills.split(',').map((bill, index) => (
                                    <div key={index} className="mb-2">
                                        <InterestButton interest={bill.trim()} /> {/* Trim to remove extra spaces */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserProfile;
