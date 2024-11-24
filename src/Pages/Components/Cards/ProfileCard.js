import React, { useEffect, useState } from 'react';
import { FaRegUser, FaCamera, FaHeart, FaRegHeart, FaRocketchat, FaCircle, FaGhost } from 'react-icons/fa6';
import { AiOutlineMessage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdVerifiedUser, MdWorkspacePremium } from "react-icons/md";
import { motion } from 'framer-motion';
import API_CONFIG from '../../../Api_Config'
import AnimatedHeart from '../AnimatedHeart';
import { useFavorites } from '../Context/FavoritesContext';
const ProfileCard = ({ profile }) => {
    const [dbid, setdbid] = useState('')
    const { favoriteItems, updateFavorite } = useFavorites();
    const [showAnimatedHeart, setShowAnimatedHeart] = useState(false);
    const [processedProfiles, setProcessedProfiles] = useState([]);
    //console.log("Profiles are = ",profile)
    const navigate = useNavigate();

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

    const [profileImage, setProfileImage] = useState("");
    const [userID, setuserID] = useState("");

    useEffect(() => {
        // Extract the first image as the profile image
        if (profile?.imagePaths?.length > 0) {
            setProfileImage(profile.imagePaths[0]);
        }
        setuserID(profile.userId)

    }, [profile]);

    // Determine if the current profile is already favorited
    const isFilled = favoriteItems[profile?.userId] || false;

    const handleHeartClick = async (e) => {
        e.stopPropagation(); // Prevent parent click event
        setShowAnimatedHeart(true); // Trigger the animation

        // Ensure we have the required IDs
        const favoriteUserId = profile?.userId; // The userId of the card clicked
        if (!dbid || !favoriteUserId) {
            console.error("Missing dbid or favoriteUserId for the API call.");
            return;
        }

        console.log("Adding favorite for", dbid, favoriteUserId); // Log IDs for verification

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
                console.log("Favorite added successfully.");
                updateFavorite(favoriteUserId, !isFilled); // Toggle the favorite in context
            } else {
                console.error("Failed to add favorite:", response.status, await response.text());
            }
        } catch (error) {
            console.error("Error occurred while adding favorite:", error);
        }

        setTimeout(() => setShowAnimatedHeart(false), 1000); // Hide the animation after it finishes
    };




    console.log("Profiles are = ", profileImage)

    const handleCardClick = () => {
        if (profile.userId) { // Assuming `profile` is a single object
            navigate(`/member/${profile.userId}`, { state: { profile } });
        } else {
            console.error("Invalid profile data structure.");
        }
    };

    const { totalGhostEntries } = profile;

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

    // Helper function to truncate text to 70 characters
    const truncateText = (text, maxLength = 33) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    return (
        <div className="w-[100%] border border-gray-300 rounded-lg overflow-hidden relative shadow-lg group"
            onClick={handleCardClick}
        >
            <div className="relative">
                {/* Container for image and overlay */}
                <div className="relative">
                    <img
                        src={profileImage}
                        className="w-full h-96 object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>

                {/* <span className="absolute top-3 left-3 text-yellow-300 text-2xl font-weight-[500] px-2 py-1 z-20 flex flex-row gap-2 items-center">
                    <MdWorkspacePremium />
                </span>

                <span className="absolute top-3 right-3 text-blue-500 text-2xl font-weight-[500] px-2 py-1 z-20 flex flex-row gap-2 items-center">
                    <MdVerifiedUser />
                </span> */}

                {/* Text Container */}
                <div className="px-4 py-2 absolute bottom-2 z-20 w-full">
                    <div className="flex flex-row gap-3 justify-between">
                        <div className="self-end">
                            <h3 className="mb-[0px] flex flex-row items-center gap-3">
                                {profile.isActive ? (
                                    <span className="text-2xl font-semibold text-[#7CFC00] overflow-hidden whitespace-nowrap text-ellipsis">
                                        {profile.fullName}
                                    </span>
                                ) :
                                    <span className="text-2xl font-semibold text-white overflow-hidden whitespace-nowrap text-ellipsis">
                                        {profile.fullName}
                                    </span>
                                }

                                <span className="text-2xl  font-semibold text-white max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
                                    {profile.age}
                                </span>
                            </h3>
                            <p className="text-[12px] text-white max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
                                <span>{profile.city}, {profile.country}</span>
                            </p>

                            {/* Bills Section - Row Layout with Truncation */}
                            <div className="flex flex-row gap-2 mt-2 max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
                                {profile.bills.length > 0 ? (
                                    <span className="text-white text-xs max-w-[70ch] overflow-hidden whitespace-nowrap text-ellipsis">
                                        {truncateText(profile.bills.join(', '))}
                                    </span>
                                ) : (
                                    <p className="text-white text-xs">No bills available</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 relative">
                            {showAnimatedHeart && (
                                <AnimatedHeart style={{ right: 80, top: -40 }} /> // Positioning animated heart
                            )}
                           <div onClick={handleHeartClick} className="cursor-pointer">
                                {isFilled ? (
                                    <FaHeart className="text-red-500 w-6 h-6" />
                                ) : (
                                    <FaRegHeart className="text-white w-6 h-6" />
                                )}
                            </div>
                            <FaGhost className="w-6 h-6 cursor-pointer" style={{ color: ghostColor }} />
                            <AiOutlineMessage className="w-6 h-6 text-white cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
