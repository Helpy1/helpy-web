import React, { useState, useEffect } from 'react';
import ProfileCard from './Components/Cards/ProfileCard';
import Navbar from './Navbar';
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { useLocation } from 'react-router-dom';

const Search = () => {
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
    // const profiles = [
    //     {
    //         id: 1,
    //         name: 'serena',
    //         age: 25,
    //         location: 'Mumbai, MH, IN',
    //         image: 'https://i.pravatar.cc/150?img=3',
    //         newMember: true,
    //     },
    //     {
    //         id: 2,
    //         name: 'Mistress Mona',
    //         age: 39,
    //         location: 'Mumbai, MH, IN',
    //         image: 'https://i.pravatar.cc/150?img=1',
    //         newMember: false,
    //     },
    //     {
    //         id: 3,
    //         name: 'Mini',
    //         age: 30,
    //         location: 'Pune, MH, IN',
    //         image: 'https://i.pravatar.cc/150?img=2',
    //         newMember: true,
    //         online: true,
    //     },
    //     {
    //         id: 4,
    //         name: 'Mini',
    //         age: 30,
    //         location: 'Pune, MH, IN',
    //         image: 'https://i.pravatar.cc/150?img=4',
    //         newMember: false,
    //         online: true,
    //     },
    //     {
    //         id: 5,
    //         name: 'Mini',
    //         age: 30,
    //         location: 'Pune, MH, IN',
    //         image: 'https://i.pravatar.cc/150?img=5',
    //         newMember: true,
    //         online: true,
    //     },
    // ];
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

    return (
        <div>
            <Navbar></Navbar>
            {/* Sidebar Filters */}
            <div className="flex flex-col md:flex-row w-full max-w-[1400px] m-auto h-full p-4">
                <aside className='w-full md:w-1/4 lg:w-[30%]'>
                    <h2 className="text-lg font-bold mb-4">Search Filters</h2>


                    <select
                        className="w-full border rounded-[16px] p-2 mb-4"
                        style={{ outline: 'none', boxShadow: 'none' }}
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-Binary</option>
                    </select>

                    <div className="w-full bg-white p-4 rounded-lg shadow-md">

                        <button
                            type="button"
                            className="btn flex flex-col justify-center items-center bg-[#e9677b] text-white w-full py-3 rounded-[12px]  hover:bg-[#f86a82] transition"
                        >
                            View Results
                        </button>
                        <div className=" flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-center w-full my-7">
                            <button
                                className="w-full md:flex-1 px-6 py-3 border rounded-lg text-[#e9677b] border-gray-300 hover:bg-gray-100 transition duration-150 ease-in-out"
                            >
                                Save this Search
                            </button>
                            <button
                                className="w-full md:w-fit px-6 py-3 border rounded-lg text-[#e9677b] border-gray-300 hover:bg-gray-100 transition duration-150 ease-in-out"
                            >
                                Reset
                            </button>
                        </div>
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
                                    <input type="text" placeholder="City, postal code, region, country" className="border w-full p-2 mb-4 rounded-lg focus:outline-none" />
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
                        <div className="w-full max-w-md mx-auto mt-4">
                            {/* First Accordion */}
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

                            {/* Second Accordion */}
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
                            {/* Additional Accordions Can Be Added Here in Similar Fashion */}
                            <div className="other-container">
                                <label className="block text-sm mb-2 font-medium">Profile Text</label>
                                <input type="text" placeholder="e.g. hiking, John Doe, shopping" className="border focus:shadow-none focus:ring-0 focus:ring-transparent w-full p-2 mb-4 rounded-lg focus:outline-none" />
                            </div>
                            <button
                                type="button"
                                className="btn flex flex-col justify-center items-center bg-[#e9677b] text-white w-full py-3 rounded-[12px] mb-4 hover:bg-[#f86a82] transition"
                            >
                                View Results
                            </button>
                            <div className=" flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-center w-full">
                                <button
                                    className="w-full md:flex-1 px-6 py-3 border rounded-lg text-[#e9677b] border-gray-300 hover:bg-gray-100 transition duration-150 ease-in-out"
                                >
                                    Save this Search
                                </button>
                                <button
                                    className="w-full md:w-fit px-6 py-3 border rounded-lg text-[#e9677b] border-gray-300 hover:bg-gray-100 transition duration-150 ease-in-out"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="w-full md:w-3/4 lg:w-4/5 mt-6 md:mt-0 md:ml-8">
                    <div className="profile-cards grid gap-6 w-full max-w-[1200px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {profiles.map(profile => (
                            <ProfileCard key={profile.id} profile={profile} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Search;
