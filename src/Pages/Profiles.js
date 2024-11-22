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

const userData = {
    userId: 261,
    fullName: "Marie",
    uGuid: "muRNCeQ2t5WZLEU6ZMKYfVNd7KP2",
    isActive: true,
    lastActive: "2 Minutes Ago",
    userStatus: true,
    subscriptionId: 1,
    gender: "Women",
    occupation: "Test",
    age: 24,
    birthday: "2000-11-14T00:00:00",
    createdDate: "2024-11-14T07:29:00.159564",
    email: "d.marie@gmail.com",
    ethnicity: "White/Caucasian",
    sexuality: "Straight",
    description: "Test",
    intentions: "Test",
    phoneNumber: null,
    subscriptionName: "Trial",
    subscriptionPrice: 0,
    subsriptionDurationInDays: 3,
    ageRangeMin: 18,
    ageRangeMax: 60,
    bodyType: "Slim",
    children: "Not",
    drinking: "Non-drinker",
    education: "High school",
    heightInInches: 66,
    language: "English",
    relationshipStatus: "Single",
    smoking: "Non-smoker",
    imagePaths: [
        "https://firebasestorage.googleapis.com/v0/b/helpy-6f93d.appspot.com/o/Images%2FmuRNCeQ2t5WZLEU6ZMKYfVNd7KP2%2FPost_3.jpg?alt=media&token=b93fae7b-e176-4a66-bf2d-acd45ab32dab",
        "https://firebasestorage.googleapis.com/v0/b/helpy-6f93d.appspot.com/o/Images%2FmuRNCeQ2t5WZLEU6ZMKYfVNd7KP2%2FPost_1.jpg?alt=media&token=c92b7537-e169-4189-ae80-6b1d32f6b891",
        "https://firebasestorage.googleapis.com/v0/b/helpy-6f93d.appspot.com/o/Images%2FmuRNCeQ2t5WZLEU6ZMKYfVNd7KP2%2FProfile_image.jpg?alt=media&token=160de616-3c50-4593-810d-195375312c9d",
    ],
    city: "Lahore",
    country: "Pakistan",
    longitude: "74.3533563",
    latitude: "31.4991339",
    totalGhostEntries: 0,
    lookingFor: "Friendship",
};

function Profiles() {
    const [isFilled, setIsFilled] = useState(false);
    const [isAboutmeFilled, setIsAboutmeFilled] = useState(false);
    const [isSeekingFilled, setIsSeekingFilled] = useState(false);
    const [isExtraDetailsFilled, setIsExtraDetailsFilled] = useState(false);

    const images = userData.imagePaths && userData.imagePaths.length > 0 ? userData.imagePaths : [];

    // Initialize favorites array with 'false' for each image
    const [favorites, setFavorites] = useState(new Array(images.length).fill(false));

    // Debounce the function to minimize state change impact
    const debouncedSetPhotoIndex = useMemo(() => debounce(() => {}, 200), []);

   

    return (
        <div className="flex flex-col lg:flex-row w-full max-w-[1400px] m-auto h-full p-4 gap-8">
           <aside className='w-full w-100% lg:w-[30%]'>
                <div className='relative'>
                    <span className="bg-blue-800 text-white text-xs font-medium absolute right-[14px] top-[12px] px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">

                        PREMIUM</span>
                    <img
                        alt='Profile Pic'
                        src={userData.imagePaths[0]}
                        className="w-full h-96 object-cover object-center rounded-md"
                    />

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
                            <span className='relative top-1'><FaBell /></span>
                            <span className='text-sm'>{userData.lastActive}</span>
                        </div>

                        <div className="flex items-start gap-2">
                            <span className='relative top-1'><FaLocationDot /></span>
                            <span className='text-sm'>{userData.city}, {userData.country}</span>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-white shadow-md rounded-lg px-4 py-6  mt-4">
                    {/* Active Status and Location */}
                    <div className="flex items-center  justify-between gap-3">
                        <div className="flex items-start gap-2">
                            <span className='relative top-[2px]'><FaHouse /></span>
                            <span className='text-base'>{userData.city}</span>
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
                    <hr className="border-t-1 border-gray-200 my-4"></hr>
                    <div className="flex items-center mb-1 gap-2">
                        <h1 className="text-base font-medium">Verifications</h1>
                        <MdVerified className='text-[#4A90E2]' />
                    </div>
                </div>
            </aside>
            <main className="w-full lg:w-[70%] mt-6 lg:mt-0 ">
                {/* Header with Name and Age */}
                <div className='flex flex-row justify-between gap-4 items-start'>
                <div className="pb-4">
                    <div className="flex items-center mb-1 gap-2">
                        <h1 className="text-2xl font-medium">
                            {userData.fullName}, {userData.age}
                        </h1>
                        <MdVerified className="text-2xl text-[#4A90E2]" />
                    </div>
                    <p className="mt-1 text-base">{userData.city}, {userData.country}</p>
                </div>
                <button type="button" className="mt-1 flex flex-col justify-center items-center bg-[#e9677b] text-white w-fit py-[12px] px-[16px] rounded-[12px]  hover:bg-[#f86a82] transition">View Results</button>
                </div>

                {/* Image Gallery Section */}
                <PhotoProvider>
                    <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative">
                            
                                <PhotoView src={`${image}?alt=media&width=800&height=800`}>
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
                    <h2 className="text-gray-600 text-lg font-semibold mb-2">About Me</h2>
                    <p className="text-base ">{userData.description}</p>

                </div>

                {/* Seeking Section */}
                <div className="w-full bg-white rounded-lg shadow-md p-6 relative mb-6">
                    <div className="flex row justify-between gap-4 items-center">
                        <h2 className="text-gray-600 text-lg font-semibold mb-2">What I am Seeking</h2>
                        <h2 className="text-base font-medium mb-2">{userData.lookingFor}</h2>
                    </div>
                    <p className="text-base ">{userData.intentions}</p>

                </div>

                {/* Extra Details Section */}
                <div className="w-full bg-white rounded-lg shadow-md p-6 relative">
                    <div>
                        <h2 className="text-gray-600 text-lg font-semibold mb-3">Extra Details</h2>
                        <div className="grid grid-cols-2 gap-4 text-gray-800 pl-4">
                            <div className="flex items-center space-x-2">
                                <FaUser className="text-gray-700 w-5 h-5" />
                                <span>{userData.gender}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaChild className="text-gray-700 w-5 h-5" />
                                <span>{userData.children}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaGraduationCap className="text-gray-700 w-5 h-5" />
                                <span>{userData.education}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaGlobe className="text-gray-700 w-5 h-5" />
                                <span>{userData.ethnicity}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaWineGlassAlt className="text-gray-700 w-5 h-5" />
                                <span>{userData.drinking}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaSmokingBan className="text-gray-700 w-5 h-5" />
                                <span>{userData.smoking}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profiles;
