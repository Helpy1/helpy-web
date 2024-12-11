import React, { useState, useMemo, useEffect } from "react";
import "react-photo-view/dist/react-photo-view.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLocation } from 'react-router-dom';
import { RxCrossCircled } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";
import API_CONFIG from '../Api_Config'
import Navbar from "./Navbar";
import languageData from '../language.json'

function EditPofile() {
    const { state } = useLocation();  // This will contain the userData passed via `state`
    const { userData } = state || {};
    const [billdata, setBillsData] = useState()
    const [languageItems, setLanguageItems] = useState([]);

    const fetchLanguages = async () => {
        //setIsLoaderVisible(true); // Show loader
        try {
            // Process the local JSON data to extract languages
            const languageSet = new Set();
            languageData.forEach(country => {
                if (country.languages) {
                    Object.values(country.languages).forEach(language => languageSet.add(language));
                }
            });

            // Convert to an array, sort alphabetically, and move "English" to the top
            const sortedLanguages = [...languageSet].sort((a, b) => {
                if (a === 'English') return -1; // Move "English" to the top
                if (b === 'English') return 1;
                return a.localeCompare(b); // Sort alphabetically for others
            });

            // Map the sorted array to the expected structure
            setLanguageItems(sortedLanguages.map(language => ({ label: language, value: language })));
        } catch (error) {
            console.error('Error processing local languages data:', error);
            //setAlertMessage('Error loading languages. Please try again.');
            //setAlertType('error');
           // setAlertVisible(true);
        } finally {
            //setIsLoaderVisible(false); // Hide loader
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, []);


    console.log("User Data from Profiles is = ", userData)
    const [selectedFilters, setSelectedFilters] = useState({
        Location: "cartagena",
        Name: "",
        Education: "",
        Aboutme: "",
        intentions: "",
        birthday: "",
        Occupation: "",
        heightRange: [100, 200],
        language: "English",
        bills: [],
        kids: "",
        smoker: "",
        drinker: "",
        relationshipStatus: "",
        physicalAppearance: "",
        lookingFor: "",
        ethnicity: "",
        placeimages: Array(8).fill(null),
    });

    console.log("Seletected Filters  =", selectedFilters)

    useEffect(() => {
        const fetchBillsData = async () => {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/api/account/GetAllBills`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                    },
                });

                const data = await response.json();
                console.log("bills data = ", data);
                if (data && Array.isArray(data)) {
                    setBillsData(data);  // If it's an array of bills, set it here
                } else {
                    console.error("Invalid data format:", data);
                }
            } catch (err) {
                console.log('Failed to load data');
            }
        };

        fetchBillsData(); // Call the function on mount
    }, []);

    const handleImageChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const updatedFilters = { ...selectedFilters };
                updatedFilters.placeimages[index] = reader.result; // Update the image in filters
                setSelectedFilters(updatedFilters);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index) => {
        const updatedFilters = { ...selectedFilters };
        updatedFilters.placeimages[index] = null; // Remove the image from filters
        setSelectedFilters(updatedFilters);
    };

    const handleSingleSelect = (category, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [category]: prev[category] === value ? "" : value,
        }));
    };
    const handleMultiSelect = (category, tag) => {
        setSelectedFilters((prev) => {
            const newSelection = prev[category].includes(tag)
                ? prev[category].filter((item) => item !== tag)
                : [...prev[category], tag];
            return { ...prev, [category]: newSelection };
        });
    };

    const handleSliderChange = (category, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [category]: value,
        }));
    };

    const handleInputChange = (category, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [category]: value,
        }));
    };

    const applyFilters = () => {
        console.log("Selected Filters JSON:", selectedFilters);
    };

    // Prepopulate state with userData on component mount
    useEffect(() => {
        if (userData) {
            const billsArray = userData.bills.split(',').map((bill) => bill.trim());
            setSelectedFilters({
                ...selectedFilters,
                Name: userData.fullName,
                Occupation: userData.occupation,
                Aboutme: userData.Aboutme,
                intentions: userData.intentions,
                birthday: userData.birthday.split('T')[0],  // Extracting date part from ISO string
                Location: userData.city,
                language: userData.language,
                Education: userData.education,
                bills: billsArray,  // Set the bills as an array
                heightRange: [userData.heightInInches - 10, userData.heightInInches + 10],  // Example for height range
                smoker: userData.smoking === "Non-smoker" ? "No" : userData.smoking,
                drinker: userData.drinking === "Non-drinker" ? "No" : userData.drinking,
                relationshipStatus: userData.relationshipStatus,
                physicalAppearance: userData.bodyType,
                lookingFor: userData.lookingFor,
                ethnicity: userData.ethnicity,
                placeimages: userData.imageData || Array(8).fill(null),  // Assuming `imagePaths` is an array
            });
        }
    }, [userData]);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col lg:flex-row w-full max-w-[1400px] m-auto h-full p-4 gap-8">
                <aside className="w-full w-100% lg:w-[30%]">
                    <div className="relative  aspect-[1/1]">
                        <img
                            alt="Profile Pic"
                            src={userData.imagePaths[0]}
                            className="w-full h-full object-cover object-center rounded-lg"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {Array.isArray(selectedFilters.placeimages) && selectedFilters.placeimages.length > 0 ? (
                            selectedFilters.placeimages.map((image, index) => (
                                <div key={index} className="relative aspect-[1/1] border rounded-lg bg-gray-200 flex items-center justify-center">
                                    {image ? (
                                        <>
                                            <img src={image} alt={`Selected ${index}`} className="w-full h-full object-cover rounded-sm" />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                            >
                                                <RxCrossCircled />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-gray-500">Click to upload</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(event) => handleImageChange(index, event)}
                                            />
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <span>No images to display</span>
                        )}
                    </div>
                </aside>
                <main className="w-full lg:w-[70%] mt-6 lg:mt-0 ">
                    <div className="w-full bg-white p-4 rounded-lg shadow-md">
                        <div className="grid gap-x-3 w-full max-w-[1200px] grid-cols-1 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium ">Name</label>
                                <div className="h-cover">
                                    <input
                                        type="text"
                                        value={selectedFilters.Name}
                                        onChange={(e) => handleInputChange("Name", e.target.value)} // Capture the text value for "Other"
                                        className="border w-full p-2 my-3 rounded-lg focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium ">About me</label>
                                <div className="h-cover">
                                    <input
                                        type="text"
                                        value={selectedFilters.Aboutme}
                                        onChange={(e) =>
                                            handleInputChange("Aboutme", e.target.value)
                                        } // Capture the text value for "Other"
                                        className="border w-full p-2 my-3 rounded-lg focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium ">Occupation</label>
                                <div className="h-cover">
                                    <input
                                        type="text"
                                        value={selectedFilters.Occupation}
                                        onChange={(e) =>
                                            handleInputChange("Occupation", e.target.value)
                                        } // Capture the text value for "Other"
                                        className="border w-full p-2 my-3 rounded-lg focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium ">
                                    My Intentions
                                </label>
                                <div className="h-cover">
                                    <input
                                        type="text"
                                        value={selectedFilters.intentions}
                                        onChange={(e) =>
                                            handleInputChange("intentions", e.target.value)
                                        } // Capture the text value for "Other"
                                        className="border w-full p-2 my-3 rounded-lg focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium ">
                                    Your Birthday
                                </label>
                                <div className="h-cover">
                                    <input
                                        type="date"
                                        value={selectedFilters.birthday}
                                        onChange={(e) =>
                                            handleInputChange("birthday", e.target.value)
                                        } // Capture the text value for "Other"
                                        className="border w-full p-2 my-3 rounded-lg focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium ">Location</label>
                                <div className="h-cover">
                                    <input
                                        type="text"
                                        value={selectedFilters.Location}
                                        onChange={(e) =>
                                            handleInputChange("Location", e.target.value)
                                        } // Capture the text value for "Other"
                                        className="border w-full p-2 my-3 rounded-lg focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-medium">Language</label>
                                <select
                                    value={selectedFilters.language}
                                    onChange={(e) => handleInputChange("language", e.target.value)}
                                    className="w-full border rounded-[4px] p-2 my-3"
                                >
                                    {languageItems.length > 0 ? (
                                        languageItems.map((language) => (
                                            <option key={language.value} value={language.value}>
                                                {language.label}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="English">English</option> // Default value if languageItems is empty
                                    )}
                                </select>
                            </div>

                        </div>
                        <div className="h-cover">
                            <div className="text-sm font-medium">
                                <span className="text-sm block">{`Height range: ${selectedFilters.heightRange[0]} cm - ${selectedFilters.heightRange[1]} cm`}</span>
                            </div>
                            <div className="my-4">
                                <Slider
                                    range
                                    min={100} // Minimum height in cm
                                    max={200} // Maximum height in cm
                                    value={selectedFilters.heightRange}
                                    onChange={(value) => handleSliderChange("heightRange", value)}
                                />
                            </div>
                        </div>
                        {/* Height Range */}
                        <div className="my-4">
                            <label className="block mb-3 font-medium">Smoker</label>
                            <div className="flex flex-wrap  gap-2">
                                {['Non-smoker', 'Occasional Smoker', 'Heavy Smoker'].map((tag) => (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() => handleSingleSelect("smoker", tag)}
                                        className={`w-[150px] p-2 rounded-[4px] text-sm ${selectedFilters.smoker === tag
                                            ? "bg-[#e9677b] text-white"
                                            : "bg-gray-200"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="my-4">
                            <label className="block mb-3 font-medium">Bills</label>
                            <div className="flex flex-wrap gap-2">
                                {billdata && billdata.length > 0 ? (
                                    billdata.map((tag) => (
                                        <button
                                            type="button"
                                            key={tag.id}
                                            onClick={() => handleMultiSelect("bills", tag.name)}
                                            className={`w-[150px] p-2 rounded-[4px] text-sm ${selectedFilters.bills.includes(tag.name)
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {/* Render a specific property from the tag object, e.g., tag.name */}
                                            {tag.name} {/* Assuming 'name' is a property of each tag */}
                                        </button>
                                    ))
                                ) : (
                                    <div>Loading bills...</div> // Display a loading message or placeholder
                                )}
                            </div>

                        </div>
                        {/* Drinker */}
                        <div className="my-4">
                            <label className="block mb-3 font-medium">Drinker</label>
                            <div className="flex flex-wrap  gap-2">
                                {['Non-drinker', 'Social drinker', 'Heavy Drinker'].map((tag) => (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() => handleSingleSelect("drinker", tag)}
                                        className={`w-[150px] p-2 rounded-[4px] text-sm ${selectedFilters.drinker === tag
                                            ? "bg-[#e9677b] text-white"
                                            : "bg-gray-200"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="my-4">
                            <label className="block mb-3 font-medium">Education</label>
                            <div className="flex flex-wrap  gap-2">
                                {['High School', 'Bachelor\'s degree', 'Master\'s degree', 'Doctorate'].map((tag) => (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() => handleSingleSelect("Education", tag)}
                                        className={`w-[150px] p-2 rounded-[4px] text-sm ${selectedFilters.Education === tag
                                            ? "bg-[#e9677b] text-white"
                                            : "bg-gray-200"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Relationship Status */}
                        <div className="my-4">
                            <label className="block mb-3 font-medium">
                                Relationship Status
                            </label>
                            <div className="flex flex-wrap  gap-2">
                                {['Single', 'In a relationship', 'Married', 'Divorced'].map((tag) => (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() =>
                                            handleSingleSelect("relationshipStatus", tag)
                                        }
                                        className={`w-[150px] p-2 rounded-[4px] text-sm ${selectedFilters.relationshipStatus === tag
                                            ? "bg-[#e9677b] text-white"
                                            : "bg-gray-200"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Physical Appearance */}
                        <div className="my-4">
                            <label className="block mb-3 font-medium">
                                Physical Appearance
                            </label>
                            <div className="flex flex-wrap  gap-2">
                                {['Slim', 'Athletic', 'Average', 'Heavyset'].map((tag) => (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() =>
                                            handleSingleSelect("physicalAppearance", tag)
                                        }
                                        className={`w-[150px] p-2 rounded-[4px] text-sm ${selectedFilters.physicalAppearance === tag
                                            ? "bg-[#e9677b] text-white"
                                            : "bg-gray-200"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Looking For */}
                        <div className="my-4">
                            <label className="block mb-3 font-medium">Looking For</label>
                            <div className="flex flex-wrap  gap-2">
                                {['Friendship', 'Casual', 'Long-Term'].map((tag) => (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() => handleSingleSelect("lookingFor", tag)}
                                        className={`w-[250px] p-2 rounded-[4px] text-sm ${selectedFilters.lookingFor === tag
                                            ? "bg-[#e9677b] text-white"
                                            : "bg-gray-200"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ethnicity */}
                        <div className="my-4">
                            <label className="block mb-3 font-medium">Ethnicity</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'Black/African Descent',
                                    'East Asian',
                                    'Hispanic/Latino',
                                    'Middle Eastern',
                                    'Native American',
                                    'Pacific Islander',
                                    'South Asian',
                                    'Southeast Asian',
                                    'White/Caucasian',
                                    'Other'
                                ].map(
                                    (tag) => (
                                        <button
                                            type="button"
                                            key={tag}
                                            onClick={() => handleSingleSelect("ethnicity", tag)}
                                            className={`w-[150px] p-2 rounded-[4px] text-sm ${selectedFilters.ethnicity === tag
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={applyFilters}
                                className="btn  bg-[#e9677b] text-white w-[200px] py-3 rounded-[4px] hover:bg-[#f86a82] transition"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                    {/* coment */}
                </main>
            </div>
        </div>
    );
}

export default EditPofile;