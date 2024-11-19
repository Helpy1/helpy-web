import React, { useState } from 'react';
import { FaRegUser, FaCamera, FaHeart, FaRegHeart, FaRocketchat, FaCircle, FaGhost } from 'react-icons/fa6';
import { AiOutlineMessage } from "react-icons/ai";
import { MdVerifiedUser, MdWorkspacePremium } from "react-icons/md";

const ProfileCard = ({ profile }) => {
    const [isFilled, setIsFilled] = useState(false);

    const toggleHeart = () => {
        setIsFilled(!isFilled);
    };

    // Helper function to truncate text to 70 characters
    const truncateText = (text, maxLength = 33) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    return (
        <div className="w-[100%] border border-gray-300 rounded-lg overflow-hidden relative shadow-lg group">
            <div className="relative">
                {/* Container for image and overlay */}
                <div className="relative">
                    <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-96 object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>

                <span className="absolute top-3 left-3 text-yellow-300 text-2xl font-weight-[500] px-2 py-1 z-20 flex flex-row gap-2 items-center">
                    <MdWorkspacePremium />
                </span>

                <span className="absolute top-3 right-3 text-blue-500 text-2xl font-weight-[500] px-2 py-1 z-20 flex flex-row gap-2 items-center">
                    <MdVerifiedUser />
                </span>

                {/* Text Container */}
                <div className="px-4 py-2 absolute bottom-2 z-20 w-full">
                    <div className="flex flex-row gap-3 justify-between">
                        <div className="self-end">
                            <h3 className="mb-[0px] flex flex-row items-center gap-3">
                                <span className="text-2xl font-semibold text-white overflow-hidden whitespace-nowrap text-ellipsis">
                                    {profile.name}
                                </span>
                                <span className="text-lg mt-2 font-semibold text-white max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
                                    {profile.age}
                                </span>
                            </h3>
                            <p className="text-[12px] text-white max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
                                <span>{profile.location}</span>
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
                        <div className="flex flex-col gap-3">
                            <div onClick={toggleHeart} className="cursor-pointer">
                                {isFilled ? (
                                    <FaHeart className="text-red-500 w-6 h-6" />
                                ) : (
                                    <FaRegHeart className="text-white w-6 h-6" />
                                )}
                            </div>
                            <FaGhost className="w-6 h-6 text-green-500 cursor-pointer" />
                            <AiOutlineMessage className="w-6 h-6 text-white cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
