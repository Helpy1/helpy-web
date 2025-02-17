import React, { useState, useMemo, useEffect } from 'react';
import { MdVerified } from "react-icons/md";
import { FaUser, FaGraduationCap, FaWineGlassAlt, FaSmokingBan, FaChild, FaGlobe } from 'react-icons/fa';
import { FaHeart, FaRegHeart, FaBell, FaLocationDot, FaHouse } from 'react-icons/fa6';
import { FaUserClock } from "react-icons/fa";
import { GiBodyHeight } from "react-icons/gi";
import { IoMdMan } from "react-icons/io";
import { debounce } from 'lodash';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useLocation } from "react-router-dom";
import InterestButton from './Components/InterestButton';
import CustomLoader from './Components/CustomLoader'; // Import your loader component
import { FaRegEyeSlash } from "react-icons/fa";
import { FaGhost } from "react-icons/fa";
import AnimatedHeart from './Components/AnimatedHeart';
import Navbar from './Navbar'
import API_CONFIG from '../Api_Config'
import { useFavorites } from './Components/Context/FavoritesContext';
const Member = () => {
    const [showAnimatedHeart, setShowAnimatedHeart] = useState(false);
    const { favoriteItems, updateFavorite } = useFavorites();
    const [dbid, setdbid] = useState('')
    const currentLocation = useLocation(); // Rename to avoid conflict
    const userData = currentLocation.state?.profile || {}; // Default to an empty object if no data is passed
    const images = userData.imagePaths && userData.imagePaths.length > 0 ? userData.imagePaths : [];
    // State to manage private image visibility
    const [showPrivateImages, setShowPrivateImages] = useState(false);
    // console.log("Data in Member is = ", userData)


    useEffect(() => {
        // Retrieve data from localStorage on component mount
        const savedName = localStorage.getItem('name');
        const savedUID = localStorage.getItem('uid');
        const savedProfileImage = localStorage.getItem('profileImage');
        const savedDBID = localStorage.getItem('dbID');
        const savedGender = localStorage.getItem('gender');
        const savedSexuality = localStorage.getItem('sexuality');
        setdbid(savedDBID)



    }, []);



    const isFilled = favoriteItems[userData?.userId] || false;
    const MemberID = userData.userId


    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                // console.log("Sending view request for user:", MemberID);
                // console.log("Sending view request from user:", dbid);

                const url = `${API_CONFIG.BASE_URL}/api/AddViewUser?userId=${MemberID}&ViewUserId=${dbid}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '/',
                        'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    // console.log('View recorded:', result);
                } else {
                    console.error('Failed to record view:', response.status);
                }

            } catch (error) {
                console.error('Error recording view or fetching token:', error);
            }
        }, 3000); // 3 seconds

        return () => clearTimeout(timer);
    }, [dbid, MemberID]); // Add `name` to dependency array



    const handleHeartClick = async (e) => {
        e.stopPropagation(); // Prevent parent click event
        setShowAnimatedHeart(true); // Trigger the animation

        // Ensure we have the required IDs
        const favoriteUserId = userData?.userId; // The userId of the card clicked
        if (!dbid || !favoriteUserId) {
            console.error("Missing dbid or favoriteUserId for the API call.");
            return;
        }

        // console.log("Adding favorite for", dbid, favoriteUserId); // Log IDs for verification

        const url = `${API_CONFIG.BASE_URL}/api/AddFavouriteUser?userId=${dbid}&FavouriteUserId=${favoriteUserId}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '/',
                    'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                },
            });

            if (response.ok) {
                // console.log("Favorite added successfully.");
                updateFavorite(favoriteUserId, !isFilled); // Toggle the favorite in context
            } else {
                console.error("Failed to add favorite:", response.status, await response.text());
            }
        } catch (error) {
            console.error("Error occurred while adding favorite:", error);
        }

        setTimeout(() => setShowAnimatedHeart(false), 1000); // Hide the animation after it finishes
    };

    const imagePaths = Object.keys(userData.imageData).map(key => userData.imageData[key]);

    const profileImage = imagePaths.find((url) => url.includes('Profile_image'));
    const privateImages = imagePaths.filter((url) => url.includes('Private_Photo'));
    const publicImages = imagePaths.filter(
        (url) => !url.includes('Profile_image') && !url.includes('Private_Photo')
    );

    // console.log("Profile image  = ", profileImage);
    // console.log("Private images = ", privateImages);
    // console.log("Public images  = ", publicImages);


    const { totalGhostEntries } = userData;

    let ghostColor;
    if (totalGhostEntries >= 0 && totalGhostEntries <= 4) {
        // Assign a green shade from light to dark based on the value
        const shadesOfGreen = ['#7CFC00', '#32CD32', '#228B22', '#006400', '#004d00']; // Lightest to darkest green
        ghostColor = shadesOfGreen[totalGhostEntries]; // Use index matching the value
    } else if (totalGhostEntries === 5) {
        ghostColor = 'red'; // Set to red if totalGhostEntries is 5
    } else {
        ghostColor = '#32de84'; // Default green color or fallback color
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-col lg:flex-row w-full max-w-[1400px] m-auto h-full p-4 gap-8">
                <aside className='w-full w-100% lg:w-[30%]'>
                    <div className='relative'>
                        {/* <span className="bg-blue-800 text-white text-xs font-medium absolute right-[14px] top-[12px] px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">

                            PREMIUM</span> */}
                        <img
                            alt='Profile Pic'
                            src={profileImage}
                            className="w-full h-96 object-cover object-center rounded-md"
                        />
                        <div className="flex flex-col gap-3 relative">
                            {showAnimatedHeart && (
                                <AnimatedHeart style={{ right: 80, top: -40 }} /> // Positioning animated heart
                            )}
                            <div onClick={handleHeartClick} className="cursor-pointer absolute right-[16px] bottom-[16px]">
                                {isFilled ? (
                                    <FaHeart className="text-red-500 w-6 h-6" />
                                ) : (
                                    <FaRegHeart className="text-white w-6 h-6" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-white shadow-md rounded-lg px-4 py-5  mt-6">
                        {/* Profile Details */}
                        <div className="flex flex-row justify-between">
                            <div className=" flex-grow-[1] flex-shrink-[1] items-center justify-start flex gap-2"><GiBodyHeight /><span >{(userData.heightInInches * 0.0833333).toFixed(1)}</span></div>
                            <div className=" flex-grow-[1] flex-shrink-[1] items-center justify-center flex gap-1"><IoMdMan /><span>{userData.bodyType}</span></div>
                            <div className=" flex-grow-[1] flex-shrink-[1] items-center justify-end flex gap-2"><FaHeart /><span>{userData.relationshipStatus}</span></div>
                        </div>
                    </div>
                    <div className="w-full bg-white shadow-md rounded-lg px-4 py-6  mt-4">
                        {/* Active Status and Location */}
                        <div className="flex items-center  justify-between gap-3">
                            <div className="flex items-start gap-2">
                                <div className="flex items-center space-x-2">
                                    <FaUser className="text-gray-700 w-5 h-5" />
                                    <span>{userData.gender}</span>
                                </div>
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
                    <div className="w-full bg-white shadow-md rounded-lg px-4 py-6  mt-4 ">
                        <div className="flex items-center  justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className='relative '><FaUserClock /></span>
                                <span className='text-base'>Member Since</span>
                            </div>
                            <span className='text-base'>
                                {new Date(userData.createdDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit'
                                })}
                            </span>
                        </div>
                        {/* <hr className="border-t-1 border-gray-200 my-4"></hr>
                        <div className="flex items-center mb-1 gap-2">
                            <h1 className="text-base font-medium">Verifications</h1>
                            <MdVerified className='text-[#4A90E2]' />
                        </div> */}
                    </div>
                </aside>
                <main className="w-full lg:w-[70%] mt-6 lg:mt-0 ">
                    {/* Header with Name and Age */}
                    <div className="py-4">
                        <div className="flex items-center mb-1 gap-2">
                            <h1 className="text-2xl font-medium">
                                {userData.fullName}, {userData.age}
                            </h1>
                            {userData.isProfileVerified && (
                                <MdVerified className="text-2xl text-[#4A90E2]" />
                            )}

                        </div>
                        <p className="mt-1 text-base">{userData.city}, {userData.country}</p>
                    </div>

                    <PhotoProvider>
                        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {publicImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <PhotoView src={`${image}?alt=media&width=800&height=800`}>
                                        <img
                                            src={`${image}?alt=media&width=300&height=300`}
                                            className="w-full h-64 object-cover rounded-lg cursor-pointer"
                                            loading="lazy"
                                        />
                                    </PhotoView>
                                </div>
                            ))}

                            {/* Conditionally render private images in PhotoProvider */}
                            {showPrivateImages &&
                                privateImages.map((image, index) => (
                                    <div key={`private-${index}`} className="relative">
                                        <PhotoView src={`${image}?alt=media&width=800&height=800`}>
                                            <img
                                                src={`${image}?alt=media&width=300&height=300`}
                                                className="w-full h-64 object-cover rounded-lg cursor-pointer"
                                                loading="lazy"
                                            />
                                        </PhotoView>
                                    </div>
                                ))}
                        </div>
                    </PhotoProvider>

                    {/* Private Images Placeholder */}
                    {!showPrivateImages && privateImages.length > 0 && (
                        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="w-full h-64 bg-gray-800 rounded-lg flex flex-col items-center justify-center shadow-md relative">
                                <FaRegEyeSlash className="text-6xl text-white" />
                                <span className="text-gray-700 text-xl  mb-2">
                                    {privateImages.length} Private Photos
                                </span>
                                <button
                                    className="px-4 py-2 bg-[#e9677b] text-white text-sm font-semibold rounded-lg hover:bg-blue-600"
                                    onClick={() => setShowPrivateImages(true)} // Show private images on click
                                >
                                    Request to View
                                </button>
                            </div>
                        </div>
                    )}

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
                            <div className="grid grid-cols-4 gap-0 text-gray-800 pl-4">
                                {userData.bills.split(',').map((bill, index) => (
                                    <InterestButton key={index} interest={bill.trim()} />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Member;
