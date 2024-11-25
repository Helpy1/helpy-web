import React, { useState, useMemo, useEffect } from 'react';
import { MdVerified } from "react-icons/md";
import { FaUser, FaGraduationCap, FaWineGlassAlt, FaSmokingBan, FaChild, FaGlobe } from 'react-icons/fa';
import { FaHeart, FaRegHeart, FaBell, FaLocationDot, FaHouse } from 'react-icons/fa6';
import { FaUserClock } from "react-icons/fa";
import { GiBodyHeight } from "react-icons/gi";
import { IoMdMan } from "react-icons/io";
import { debounce } from 'lodash';
import 'react-photo-view/dist/react-photo-view.css';
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar'
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

function EditPofile() {
    const location = useLocation();
    const profiles = location.state?.profiles || []; // Use profiles passed from Home

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [dontShowMembers, setdontShowMembers] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('cartagena');
    const [distance, setDistance] = useState(400);
    const [openAccordions, setOpenAccordions] = useState({});
    const [ageRange, setAgeRange] = useState([18, 60]);
    const [heightRange, setHeightRange] = useState([100, 200]); // in cm

    const toggleAccordion = (id) => {
        setOpenAccordions((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle the specific accordion's open state.
        }));
    };
    useEffect(() => {
        // This will run whenever selectedBills changes
        console.log('Selected Bills:', selectedMembers);
    }, [selectedMembers]);
    const handleTagClick = (tag) => {
        if (selectedMembers.includes(tag)) {
            // Remove tag if already selected
            setSelectedMembers(selectedMembers.filter(member => member !== tag));
        } else {
            // Add tag if not already selected
            setSelectedMembers([...selectedMembers, tag]);
        }
    };
    useEffect(() => {
        // This will run whenever selectedBills changes
        console.log('Selected Bills:', dontShowMembers);
    }, [dontShowMembers]);
    const handleTagClickDont = (tag) => {
        if (dontShowMembers.includes(tag)) {
            // Remove tag if already selected
            setdontShowMembers(dontShowMembers.filter(member => member !== tag));
        } else {
            // Add tag if not already selected
            setdontShowMembers([...dontShowMembers, tag]);
        }
    };

    const options = [
        { label: 'ID Verified' },
        { label: 'Premium' },
        { label: 'Unviewed' },
        { label: 'Viewed Me' },
        { label: 'Favorited Me' },
        { label: 'Photos' },
        { label: 'Online Now' },
        { label: 'Viewed' },
        { label: 'Favorited' },
    ];
    const [isFilled, setIsFilled] = useState(false);
    const [isAboutmeFilled, setIsAboutmeFilled] = useState(false);
    const [isSeekingFilled, setIsSeekingFilled] = useState(false);
    const [isExtraDetailsFilled, setIsExtraDetailsFilled] = useState(false);

    const images = userData.imagePaths && userData.imagePaths.length > 0 ? userData.imagePaths : [];

    // Initialize favorites array with 'false' for each image
    const [favorites, setFavorites] = useState(new Array(images.length).fill(false));

    // Debounce the function to minimize state change impact
    const debouncedSetPhotoIndex = useMemo(() => debounce(() => { }, 200), []);

    const toggleHeart = () => {
        setIsFilled(!isFilled);
    };
    const toggleAboutmeHeart = () => {
        setIsAboutmeFilled(!isAboutmeFilled);
    };
    const toggleSeekingHeart = () => {
        setIsSeekingFilled(!isSeekingFilled);
    };
    const toggleExtraDetails = () => {
        setIsExtraDetailsFilled(!isExtraDetailsFilled);
    };
    const toggleHeartFvrt = (index) => {
        setFavorites((prevFavorites) => {
            const newFavorites = [...prevFavorites];
            newFavorites[index] = !newFavorites[index]; // Toggle only the selected image
            return newFavorites;
        });
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col lg:flex-row w-full max-w-[1400px] m-auto h-full p-4 gap-8">
                <aside className='w-full w-100% lg:w-[30%]'>
                    <div className='relative'>
                        <img
                            alt='Profile Pic'
                            src={userData.imagePaths[0]}
                            className="w-full h-96 object-cover object-center rounded-md"
                        />
                    </div>
                </aside>
                <main className="w-full lg:w-[70%] mt-6 lg:mt-0 ">

                    <div className="w-full bg-white p-4 rounded-lg shadow-md">
                        <label className="block text-sm  font-medium mb-4">Location</label>
                        <div className="pb-4">
                            <div className="mb-4 pl-2">
                                <label className="flex items-center mb-2 text-sm">
                                    <input
                                        type="radio"
                                        name="location"
                                        value="cartagena"
                                        checked={selectedLocation === 'cartagena'}
                                        onChange={() => setSelectedLocation('cartagena')}
                                        className="mr-2  text-blue-600 bg-gray-100   dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
                                    />

                                    Cartagena de Indias
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="radio"
                                        name="location"
                                        value="other"
                                        checked={selectedLocation === 'other'}
                                        onChange={() => setSelectedLocation('other')}
                                        className="mr-2  text-blue-600 bg-gray-100   dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    Other Locations
                                </label>
                            </div>

                            {selectedLocation === 'cartagena' && (
                                <div className="distance-container">
                                    <label className="block mb-3 font-medium">Distance (km)</label>
                                    <div className='flex row items-center gap-2 mb-2'>
                                        <span className='text-[14px] '>0 - </span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="1500"
                                            value={distance}
                                            onChange={(e) => {
                                                const newValue = e.target.value;

                                                // Check if the input is empty
                                                if (newValue === '') {
                                                    setDistance(''); // Set state to an empty string if input is cleared
                                                } else {
                                                    // Convert to number and restrict to max 1500
                                                    setDistance(Math.min(1500, Number(newValue)));
                                                }
                                            }}
                                            className="border p-1 w-fit text-[14px] rounded-md ps-2 py-2 focus:shadow-none focus:ring-0 focus:ring-transparent focus:outline-none"
                                        />
                                        <span className='text-[14px] '>km</span>
                                    </div>
                                    <Slider
                                        min={0}
                                        max={1500}
                                        value={distance || 0} // Default to 0 if distance is empty
                                        onChange={(value) => {
                                            const newValue = Math.min(1500, value);
                                            setDistance(newValue);
                                        }}
                                    />
                                </div>
                            )}

                            {selectedLocation === 'other' && (
                                <div className="other-container">
                                    <input type="text" placeholder="City, postal code, region, country" className="border focus:shadow-none focus:ring-0 focus:ring-transparent w-full p-2 mb-4 rounded-lg focus:outline-none" />
                                </div>
                            )}

                        </div>
                        <label className="block mb-3 font-medium">OPTIONS</label>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {options.map((option, index) => (
                                <label key={index} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{option.label}</span>
                                </label>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm mb-2 font-medium">Age</label>
                            <div className="my-4">
                                <Slider
                                    range
                                    min={18}
                                    max={60}
                                    value={ageRange}
                                    onChange={(value) => setAgeRange(value)}
                                />
                                <div className="text-sm mt-2">
                                    {`Age: ${ageRange[0]} - ${ageRange[1]}`}
                                </div>
                            </div>
                        </div>
                        <div className="w-full  mt-4">
                            {/* First Accordion */}
                            <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols- lg:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <h2 id="accordion-heading-1">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(1)}
                                            className="flex items-center justify-between text-sm w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[1] || false}
                                            aria-controls="accordion-body-1"
                                        >
                                            <span className='text-md'>Show Members Seeking</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[1] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-1"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[1] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-1"
                                    >
                                        <div className="pt-4">
                                            <div className="flex flex-wrap justify-between gap-2 ">
                                                {['Tag 1', 'Tag 2', 'Tag 3'].map((tag) => (
                                                    <button
                                                        type="button"
                                                        key={tag}
                                                        onClick={() => handleTagClick(tag)}
                                                        className={`w-[48%] p-2 rounded-[16px] text-sm ${selectedMembers.includes(tag) ? 'bg-[#e9677b] text-white' : 'bg-gray-200'
                                                            }`}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h2 id="accordion-heading-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(2)}
                                            className="flex items-center justify-between text-sm w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[2] || false}
                                            aria-controls="Body Type"
                                        >
                                            <span className='text-md'>Body Type</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[2] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-2"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[2] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-2"
                                    >
                                        <div className="p-4">
                                            <div className="flex flex-col space-y-2">
                                                {['Slim', 'Athletic', 'Average', 'Curvy', 'Full Figure', 'Heavyset'].map((label) => (
                                                    <label key={label} className="inline-flex items-center text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-2"
                                                        />
                                                        <span className="text-gray-700">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h2 id="accordion-heading-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(3)}
                                            className="flex text-sm items-center justify-between w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[3] || false}
                                            aria-controls="Body Type"
                                        >
                                            <span className='text-md'>Ethnicity</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[3] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-2"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[3] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-2"
                                    >
                                        <div className="p-4">
                                            <div className="flex flex-col space-y-2">
                                                {[
                                                    'Asian',
                                                    'Black / African Descent',
                                                    'Latin / Hispanic',
                                                    'East Indian',
                                                    'Middle Eastern',
                                                    'Mixed',
                                                    'Native American',
                                                    'Pacific Islander',
                                                    'White / Caucasian',
                                                    'Other'
                                                ].map((label) => (
                                                    <label key={label} className="inline-flex items-center text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-2"
                                                        />
                                                        <span className="text-gray-700">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h2 id="accordion-heading-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(4)}
                                            className="flex items-center text-sm justify-between w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[4] || false}
                                            aria-controls="Body Type"
                                        >
                                            <span className='text-md'>Height</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[4] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-2"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[4] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-2"
                                    >
                                        <div className='px-2 py-4'>

                                            <span className='text-sm mb-4 block'>{`Height range: ${heightRange[0]} cm - ${heightRange[1]} cm`}</span>
                                            <Slider
                                                range
                                                min={100} // Minimum height in cm
                                                max={200} // Maximum height in cm
                                                value={heightRange}
                                                onChange={(value) => setHeightRange(value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h2 id="accordion-heading-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(5)}
                                            className="flex items-center text-sm justify-between w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[5] || false}
                                            aria-controls="Body Type"
                                        >
                                            <span className='text-md'>Smoking</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[5] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-2"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[5] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-2"
                                    >
                                        <div className="p-4">
                                            <div className="flex flex-col space-y-2">
                                                {[
                                                    'Non Smoker',
                                                    'Light Smoker',
                                                    'Heavy Smoker'
                                                ].map((label) => (
                                                    <label key={label} className="inline-flex items-center text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-2"
                                                        />
                                                        <span className="text-gray-700">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h2 id="accordion-heading-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(6)}
                                            className="flex items-center justify-between text-sm w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[6] || false}
                                            aria-controls="Body Type"
                                        >
                                            <span className='text-md'>Drinking</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[6] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-2"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[6] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-2"
                                    >
                                        <div className="p-4">
                                            <div className="flex flex-col space-y-2">
                                                {[
                                                    'Non Drinker',
                                                    'Social Drinker',
                                                    'Heavy Drinker'
                                                ].map((label) => (
                                                    <label key={label} className="inline-flex items-center text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-2"
                                                        />
                                                        <span className="text-gray-700">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h2 id="accordion-heading-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(7)}
                                            className="flex items-center justify-between text-sm w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[7] || false}
                                            aria-controls="Body Type"
                                        >
                                            <span className='text-md'>Relationship Status</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[7] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-2"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[7] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-2"
                                    >
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    'Single',
                                                    'Divorced',
                                                    'Separated',
                                                    'Widowed',
                                                    'Open',
                                                    'Married'
                                                ].map((label) => (
                                                    <label key={label} className="inline-flex items-center text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-2"
                                                        />
                                                        <span className="text-gray-700">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h2 id="accordion-heading-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(8)}
                                            className="flex items-center text-sm justify-between w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[8] || false}
                                            aria-controls="Body Type"
                                        >
                                            <span className='text-md'>Education</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[8] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-2"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[8] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-2"
                                    >
                                        <div className="p-4">
                                            <h2 className="text-lg font-semibold mb-2">Highest Education Level:</h2>
                                            <div className="flex flex-col space-y-2">
                                                {[
                                                    'High School',
                                                    'Some College',
                                                    'Associates Degree',
                                                    'Bachelors Degree',
                                                    'Graduate Degree',
                                                    'PhD / Post Doctoral',
                                                    'MD / Medical Doctor',
                                                    'JD / Attorney'
                                                ].map((label) => (
                                                    <label key={label} className="inline-flex items-center text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-2"
                                                        />
                                                        <span className="text-gray-700">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h2 id="accordion-heading-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(9)}
                                            className="flex text-sm items-center justify-between w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[9] || false}
                                            aria-controls="Body Type"
                                        >
                                            <span className='text-md'>Children</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[9] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-2"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[9] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-2"
                                    >
                                        <div className="p-4">
                                            <div className="flex flex-col space-y-2">
                                                {['0', '1', '2', '3', '4', '5', '6+'].map((label) => (
                                                    <label key={label} className="inline-flex items-center text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-2"
                                                        />
                                                        <span className="text-gray-700">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h2 id="accordion-heading-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(10)}
                                            className="flex items-center text-sm justify-between w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[10] || false}
                                            aria-controls="Body Type"
                                        >
                                            <span className='text-md'>Language</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[10] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-2"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[10] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-2"
                                    >
                                        <div className="p-4">
                                            <div className="flex flex-col space-y-2">
                                                {[
                                                    'English',
                                                    'Español',
                                                    'Français',
                                                    'Deutsch',
                                                    '中文(简)',
                                                    '日本語',
                                                    'Nederlandse',
                                                    'Português'
                                                ].map((label) => (
                                                    <label key={label} className="inline-flex items-center text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-2"
                                                        />
                                                        <span className="text-gray-700">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h2 id="accordion-heading-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(11)}
                                            className="flex items-center text-sm justify-between w-full py-2 px-3 text-[#000] border border-gray-200 rounded-full dark:border-gray-700 dark:text-gray-400 gap-3"
                                            aria-expanded={openAccordions[11] || false}
                                            aria-controls="Body Type"
                                        >
                                            <span className='text-md'>Don't show members seeking</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${openAccordions[11] ? 'rotate-0' : 'rotate-180'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5 5 1 1 5"
                                                />
                                            </svg>
                                        </button>
                                    </h2>

                                    <div
                                        id="accordion-body-2"
                                        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openAccordions[11] ? 'max-h-screen' : 'max-h-0'}`}
                                        aria-labelledby="accordion-heading-2"
                                    >
                                        <div className="pt-4">
                                            <div className="flex flex-wrap justify-between gap-2 ">
                                                {['Tag 1', 'Tag 2', 'Tag 3'].map((tag) => (
                                                    <button
                                                        type="button"
                                                        key={tag}
                                                        onClick={() => handleTagClickDont(tag)}
                                                        className={`w-[48%] p-2 rounded-[16px] text-sm ${dontShowMembers.includes(tag) ? 'bg-[#e9677b] text-white' : 'bg-gray-200'
                                                            }`}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="other-container">
                                <label className="block text-sm mb-2 font-medium">Profile Text</label>
                                <input type="text" placeholder="Share a captivating phrase" className="border focus:shadow-none focus:ring-0 focus:ring-transparent w-full p-2 mb-4 rounded-lg focus:outline-none" />
                            </div>
                            <div className="other-container">
                                <label className="block text-sm mb-2 font-medium">What I am Seeking</label>
                                <textarea type="text" placeholder="Need help? Talk about the kind of relationship you want, and note your deal breakers!" rows="4" className="resize-none  border focus:shadow-none focus:ring-0 focus:ring-transparent w-full p-2 mb-4 rounded-lg focus:outline-none" />
                            </div>
                            <div className="other-container">
                                <label className="block text-sm mb-2 font-medium">Tell us a bit about yourself</label>
                                <textarea type="text" placeholder="Tell us your story and interests to attract the right people." rows="4" className="resize-none  border focus:shadow-none focus:ring-0 focus:ring-transparent w-full p-2 mb-4 rounded-lg focus:outline-none" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default EditPofile;
