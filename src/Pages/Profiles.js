import React, { useState, useEffect, useMemo } from 'react';
import { MdVerified } from "react-icons/md";
import { FaUser, FaGraduationCap, FaWineGlassAlt, FaSmokingBan, FaChild, FaGlobe } from 'react-icons/fa';
import { FaHeart, FaBell, FaLocationDot, FaHouse } from 'react-icons/fa6';
import { FaUserClock } from "react-icons/fa";
import { GiBodyHeight } from "react-icons/gi";
import { IoMdMan } from "react-icons/io";
import { debounce } from 'lodash';
import { FaGhost } from "react-icons/fa";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Navbar from './Navbar';
import API_CONFIG from '../Api_Config'
import InterestButton from './Components/InterestButton';
function Profiles() {
    const [userData, setUserData] = useState(null);
    const [dbid, setDbid] = useState(null);

    // Debounced function to minimize unnecessary calls
    const debouncedSetPhotoIndex = useMemo(() => debounce(() => { }, 200), []);

    useEffect(() => {
        // Retrieve localStorage data
        const savedDBID = localStorage.getItem('dbID');
        setDbid(savedDBID);

        // Fetch user data from API
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/api/GetUserById?userId=${savedDBID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '/',
                        'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}` // Use environment variable for sensitive keys
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.length > 0) {
                    setUserData(data[0]); // Assuming the first object is the user data
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (savedDBID) {
            fetchUserData();
        }
    }, []);

    if (!userData) {
        return null; // Placeholder while fetching data
    }

    const images = userData.imagePaths && userData.imagePaths.length > 0 ? userData.imagePaths : [];
    const memberSince = new Date(userData.createdDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });

    return (
        <div>
            <Navbar />
            <div className="relative flex flex-col lg:flex-row w-full max-w-[1400px] m-auto h-full p-4 gap-8">
                {/* Edit Button */}
                <button
                    onClick={() => window.location.href = '/EditProfile'}
                    className="absolute top-6 right-6 px-4 py-2 rounded-full bg-[#e9677b] text-white hover:bg-[#d6556c] transition"
                >
                    Edit Profile
                </button>

                <aside className='w-full lg:w-[30%]'>
                    <div className='relative'>
                        <img
                            alt='Profile Pic'
                            src={userData.imagePaths[0]}
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
                                    {userData.fullName}, {userData.age}
                                </h1>
                                {userData.isProfileVerified && <MdVerified className="text-2xl text-[#4A90E2]" />}
                            </div>
                            <p className="mt-1 text-base">{userData.city}, {userData.country}</p>
                        </div>
                    </div>
                    <PhotoProvider>
                        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <PhotoView src={image}>
                                        <img
                                            src={`${image}?alt=media&width=300&height=300`}
                                            alt={`Profile Pic ${index + 1}`}
                                            className="w-full h-64 object-cover rounded-lg cursor-pointer"
                                            loading="lazy"
                                        />
                                    </PhotoView>
                                </div>
                            ))}
                        </div>
                    </PhotoProvider>
                    {/* About Me Section */}
                    <div className="w-full mb-6 bg-white rounded-lg shadow-md p-6 relative">
                        <h2 className="text-[#e9677b] text-lg font-semibold mb-2">About Me</h2>
                        <p className="text-base pb-4">{userData.description}</p>
                    </div>

                    {/* Seeking Section */}
                    <div className="w-full bg-white rounded-lg shadow-md p-6 relative mb-6">
                        <div className="flex row justify-between gap-4 items-center">
                            <h2 className="text-[#e9677b] text-lg font-semibold mb-2">My Intentions</h2>
                        </div>
                        <p className="text-base pb-4">{userData.intentions}</p>
                    </div>

                    <div className="w-full bg-white rounded-lg shadow-md p-6 relative mb-6">
                        <div className="flex row justify-between gap-4 items-center">
                            <h2 className="text-[#e9677b] text-lg font-semibold mb-2">Looking For</h2>
                        </div>
                        <p className="text-base pb-4">{userData.lookingFor}</p>
                    </div>

                    {/* Extra Details Section */}
                    <div className="w-full bg-white rounded-lg shadow-md p-6 relative">
                        <div>
                            <h2 className="text-[#e9677b] text-lg font-semibold mb-2">{userData.gender === 'Men' ? 'Bills I can Help with' : 'Bills I need Help with'}</h2>
                            <div className="grid grid-cols-2 gap-0 text-gray-800 pl-4">
                                {userData.bills.map((bill, index) => (
                                    <InterestButton key={index} interest={bill} />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profiles;
