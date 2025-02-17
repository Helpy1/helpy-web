import React, { useState, useMemo, useEffect } from "react";
import "react-photo-view/dist/react-photo-view.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLocation } from 'react-router-dom';
import { RxCrossCircled } from "react-icons/rx";
import { FaLocationArrow } from "react-icons/fa";
import API_CONFIG from '../Api_Config'
import Navbar from "./Navbar";
import languageData from '../language.json'
import { Description } from "@headlessui/react";
import axios from 'axios';

const EditProfile = () => {
    const { state } = useLocation(); // Get state from location
    const userData = state.userData || state.userData;
    const uGuid = userData.uGuid;
    const userID = userData.userId;
    // console.log(state.userData)   
    // console.table(state.userData)
    // console.log(userID);
    // console.log(uGuid)
    const imageKeys = Object.keys(userData.imageData).filter(key => key.startsWith('image_'));
    const count = imageKeys.length;
    const [city, setCity] = useState('');
    const [userId, setUserId] = useState();
    const [country, setCountry] = useState('');
    const [billsData, setBillsData] = useState() // this is to fetch all the bills
    const [latitude, setLatitude] = useState(null);
    const [imgIndex, setImgIndex] = useState(count);
    const [searchText, setSearchText] = useState('');
    const [longitude, setLongitude] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [changedBills, setChangedBills] = useState([]);
    const [languageItems, setLanguageItems] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]); // To store uploaded images with key and uri  
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [currentBills, setCurrentBills] = useState(userData.bills || "")
    const [userCurrentBills, setUserCurrentBills] = useState(state.userData.bills)
    const [selectedFilters, setSelectedFilters] = useState({

        // const [billsData, setBillsData] = useState() // this is to fetch all the bills

        // console.log(currentBills)
        // console.log(typeof (currentBills))

        ...userData,
        userId: userID,
        Location: `${userData.city} ${userData.country}`,
        Name: "",
        fullName: userData.fullName,
        description: userData.description,
        Education: userData.education,
        intentions: userData.intentions,
        birthday: "",
        Occupation: userData.occupation,
        heightRange: [100, 200],
        language: "English",
        bills: [],
        kids: "",
        smoker: userData.smoking,
        drinker: userData.drinking,
        relationshipStatus: userData.relationshipStatus,
        physicalAppearance: userData.bodyType,
        bodyType: "",
        lookingFor: userData.lookingFor,
        ethnicity: userData.ethnicity,
        // placeimages: [null, null, null, null, null, null], // Initialize with  empty slots
        images: [
            userData.imageData.image_1 || null,
            userData.imageData.image_2 || null,
            userData.imageData.image_3 || null,
            userData.imageData.image_4 || null,
            userData.imageData.image_5 || null,
            userData.imageData.image_6 || null,
            userData.imageData.image_7 || null,
            userData.imageData.image_8 || null,
        ]
    });
    console.log(userData.imageData)




    console.log(count);  // Output will be 2
    // console.log("image_1" in userData.imagesData)
    // console.log(userData.imageData.Private_Photo_1)
    // const placeimages = Array(2).fill(null)
    // console.log(selectedFilters.bills)

    //fetch all the bills
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
                // console.log("bills data = ", data);
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
    // handle the conversion of bills str into bills id
    // function updateBillIds(existingBillNames, newBillIds) {
    //     const billNamesArray = existingBillNames.split(",").map(name => name.trim());
    //     console.log("bills names : " + billNamesArray)

    //     const existingBillIds = billNamesArray
    //         .map(name => {
    //             const bill = billsData.find(bill => bill.name.trim() === name);
    //             return bill ? bill.id : null;
    //         })
    //         .filter(id => id !== null);

    //     const allBillIds = [...existingBillIds, ...newBillIds];
    //     const uniqueBillIds = Array.from(new Set(allBillIds));

    //     return uniqueBillIds;
    // }
    //hanlde the updation of bills 
    const updateBillsData = async () => {
        try {
            const selectedBillIds = selectedFilters.bills; // This should be an array of IDs
            // console.log("bills are" + selectedBillIds)
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/account/AddUserBills`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                },
                body: JSON.stringify({
                    userId: userID,
                    selectedItems: selectedBillIds
                }),
            });
            console.log("bills data " + selectedBillIds)
            console.log(response.body);
            if (response.ok) {
                const data = await response.json();
                // console.log("Bills updated successfully:", data);
            } else {
                const errorDetails = await response.text();
                // console.error("Failed to update bills:", response.status, response.statusText, errorDetails);
            }
        } catch (error) {
            // console.error("Error updating bills:", error);
        }
    };
    //handle the loc suggestion as user types
    const fetchSuggestions = async (input) => {
        if (input.length > 2) {
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_CONFIG.YOUR_GOOGLE_API_KEY}`
                );
                setSuggestions(response.data.predictions);
                console.log(response.data.predictions)
            } catch (error) {
                console.error('Error fetching place suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };
    //handle the user cuurect location on btn click
    const fetchCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
                try {
                    const response = await axios.get(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_CONFIG.YOUR_GOOGLE_API_KEY}`
                    );
                    const addressComponents = response.data.results[0].address_components;
                    const cityComponent = addressComponents.find((c) => c.types.includes('locality'));
                    const countryComponent = addressComponents.find((c) => c.types.includes('country'));

                    const fetchedCity = cityComponent ? cityComponent.long_name : '';
                    const fetchedCountry = countryComponent ? countryComponent.long_name : '';

                    setCity(fetchedCity);
                    setCountry(fetchedCountry);
                    setSearchText(`${fetchedCity}, ${fetchedCountry}`);
                    setSelectedFilters((prev) => ({ ...prev, Location: `${fetchedCity}, ${fetchedCountry}` }));
                } catch (error) {
                    console.error('Error fetching location details:', error);
                }

                setIsFetchingLocation(false);
            },
            (error) => {
                console.error('Error fetching location:', error);
                setIsFetchingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    };
    //handle the height slider
    const handleSliderChange = (category, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [category]: value,
        }));
    };
    //handle for bills selection    
    const handleSingleSelect = (category, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [category]: prev[category] === value ? "" : value,
        }));
    };
    //handle for multiple bills selection

    const handleMultipleSelect = (filterType, id) => {
        setSelectedFilters((prevFilters) => {
            const isAlreadySelected = prevFilters[filterType].includes(id);
            const updatedFilter = isAlreadySelected
                ? prevFilters[filterType].filter((item) => item !== id)
                : [...prevFilters[filterType], id];

            console.log("Updated Filters:", {
                ...prevFilters,
                [filterType]: updatedFilter,
            });

            return { ...prevFilters, [filterType]: updatedFilter };
        });
    };
    //handle all input changes
    const handleInputChange = (category, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [category]: value,
        }));
    };
    // Handle file selection
    const handleImageChange = (event, index) => {
        if (!event.target || !event.target.files) {
            console.error("Invalid event target or no files detected.");
            return;
        }

        const file = event.target.files[0];
        if (file) {
            // Create a URL for the selected image to display it in the placeholder
            const previewUrl = URL.createObjectURL(file);

            const imageArray = [...(selectedFilters.images || [])]; // Handle undefined `images`
            imageArray[index] = { file, previewUrl }; // Store the file and its preview URL
            setSelectedFilters({ ...selectedFilters, images: imageArray });
        }
    };
    // Remove selected image
    const removeImage = (index) => {
        const imageArray = [...selectedFilters.images];
        imageArray[index] = null; // Remove the file
        setSelectedFilters({ ...selectedFilters, images: imageArray });
    };
    // Upload selected images
    const uploadUserImage = async () => {
        console.log("user data from upload user", userData.imageData)

        if (!selectedFilters.images.some(image => image?.file)) {
            alert("Please select at least one image to upload.");
            return;
        }

        const formData = new FormData();

        selectedFilters.images.forEach((image, imgIndex) => {
            // loop through every key of the image data and check wether the key exists or not, if the key exist then move to next index if the key dont exist then append the img at that index and do it till 8 index,
            if (userData.imageData.map) {

            }
            else {

            }
            if (image?.file) {
                const timestamp = Date.now(); // Get the current timestamp

                const fileName = `${timestamp}_image_${imgIndex + 1}`; // Sequentially index the images
                console.log(`Appending file at index ${imgIndex + 1}:`, fileName);
                setImgIndex(imgIndex + 1);
                formData.append('imageFiles', image.file, fileName);
            }
        });

        // Debug: Log FormData contents
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/api/UploadListOfImagesToGoogleBucket?gUid=${uGuid}`,
                formData,
                {
                    headers: {
                        "Accept": "*/*",
                        "Authorization": API_CONFIG.AUTHORIZATION_KEY,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const uploadedImageData = response.data; // Assuming the response contains `imageData`
            console.log(JSON.stringify(uploadedImageData));
            console.log(imgIndex)

            // Transform the data into the desired format
            const result = uploadedImageData.map((image, imgIndex) => ({

                key: `image_${imgIndex + 1}`, // Sequential key based on response order
                value: image.imageLink, // Use the link from the response
            }));

            console.log("Formatted Image Data:", result);

            // Returning the formatted image data
            return result;
        } catch (error) {
            if (error.response) {
                console.error("Error uploading images:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error:", error.message);
            }
        }
    };

    //handle all the edit of the profile
    const saveProfileChanges = async (sendData) => {
        console.log("send data from line no 250", JSON.stringify(sendData, null, 5))

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/account/EditUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                },
                body: JSON.stringify(sendData), // Send the updated profile data
            });
            const result = await response.json();
            if (response.ok) {
                console.log("Profile updated successfully:", JSON.stringify(result, null, 2));
            } else {
                console.error("Error updating profile:", result);
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
    };
    //generate all the sendData and call all the filters
    const applyFilters = async () => {
        try {
            // Build sendData object first with static fields
            const sendData = {
                ...selectedFilters,
                userId: selectedFilters.userId, // Dynamically set userId from userData
                description: selectedFilters.description || "",
                intentions: selectedFilters.intentions || "",
                fullName: selectedFilters.fullName || "",
                sexuality: "Heterosexual", // You can update this if needed
                occupation: selectedFilters.Occupation || "",
                gender: "Male", // You can update this if needed
                ethnicity: selectedFilters.ethnicity || "",
                language: selectedFilters.language || "English",
                bodyType: selectedFilters.physicalAppearance || "",
                relationshipStatus: selectedFilters.relationshipStatus || "",
                smoking: selectedFilters.smoker || "",
                children: selectedFilters.kids || "",
                drinking: selectedFilters.drinker || "",
                education: selectedFilters.Education || "",
                heightInInches: (selectedFilters.heightRange[0] + selectedFilters.heightRange[1]) / 2,
                birthday: selectedFilters.birthday ? new Date(selectedFilters.birthday).toISOString() : "",
                selectedItems: [0], // You can update this array as needed
                lookingFor: selectedFilters.lookingFor || "",
                city: city || selectedFilters.Location || "",
                country: country || "",
                longitude: longitude || "0.0",
                latitude: latitude || "0.0",
            };

            // Log the transformed data (use in development)
            console.log("Initial sendData:", sendData);

            try {
                // Handle images separately
                const uploadedImages = await uploadUserImage();

                // Check if the uploadUserImage function returned successfully uploaded images
                if (uploadedImages && uploadedImages.length > 0) {
                    console.log("uploadedImages:", uploadedImages);
                    sendData.images = uploadedImages; // Assuming `uploadedImages` contains URLs from the response
                } else {
                    console.error("No images were uploaded or the upload process failed.");
                }
            } catch (error) {
                console.error("An error occurred while uploading images:", error);
            }

            // Save profile changes
            await saveProfileChanges(sendData);

            console.log("Final sendData after upload:", sendData);
        } catch (error) {
            console.error("Error in applyFilters:", error);
        }
        await updateBillsData()
    };



    return (
        <div>
            <Navbar />
            <div className="flex flex-col lg:flex-row w-full max-w-[1400px] m-auto h-full p-4 gap-8">
                <aside className="w-full w-100% lg:w-[30%]">
                    <div className="relative aspect-[1/1]">
                        {userData?.imagePaths?.[0] ? (
                            <img
                                alt="Profile Pic"
                                src={userData.imageData.Profile_image}
                                className="w-full h-full object-cover object-center rounded-lg"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {Array.isArray(selectedFilters.images) && selectedFilters.images.length > 0 ? (
                            selectedFilters.images.map((image, index) => (
                                <div key={index} className="relative aspect-[1/1] border rounded-lg bg-gray-200 flex items-center justify-center">
                                    {image ? (
                                        <>
                                            <img src={image || image.previewUrl} alt={`Selected ${index}`} className="w-full h-full object-cover rounded-sm" />
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
                                                onChange={(event) => handleImageChange(event, index)}
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
                                        value={selectedFilters.fullName}
                                        onChange={(e) => handleInputChange("fullName", e.target.value)} // Capture the text value for "Other"
                                        className="border w-full p-2 my-3 rounded-lg focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium ">About me</label>
                                <div className="h-cover">
                                    <input
                                        type="text"
                                        value={selectedFilters.description}
                                        onChange={(e) =>
                                            handleInputChange("description", e.target.value)
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
                                <label className="block text-sm font-medium">Location</label>
                                <div className="h-cover relative flex items-center w-full border border-gray-300 rounded-[16px] mt-4 text-gray-700">
                                    <input
                                        type="text"
                                        value={searchText || selectedFilters.Location} // This is controlled by selectedFilters.Location
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            handleInputChange("Location", value); // Capture the text value for "Location"
                                            setSearchText(value); // Update the search text for suggestions
                                            fetchSuggestions(value); // Fetch suggestions based on the input
                                        }}
                                        className="border w-full p-2 my-3 rounded-lg focus:outline-none"
                                    />

                                    <button
                                        className="p-2 bg-[#e9677b] text-white rounded-full flex items-center justify-center ml-2 mr-2"
                                        onClick={fetchCurrentLocation}
                                        disabled={isFetchingLocation}
                                    >
                                        <FaLocationArrow />
                                    </button>
                                </div>
                                {suggestions.length > 0 && (
                                    <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                                        {suggestions.map((suggestion) => (
                                            <div
                                                key={suggestion.place_id}
                                                className="p-2 cursor-pointer hover:bg-gray-100"
                                                onClick={() => {
                                                    setSearchText(suggestion.description);
                                                    setSelectedFilters((prev) => ({ ...prev, Location: suggestion.description }));
                                                    setSuggestions([]); // Clear suggestions after selection
                                                }}
                                            >
                                                {suggestion.description}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                {billsData && billsData.length > 0 ? (
                                    billsData.map((tag) => (
                                        <button
                                            type="button"
                                            key={tag.id} // Use 'id' as the unique key
                                            onClick={() => handleMultipleSelect("bills", tag.id)} // Pass 'id' instead of 'name'
                                            className={`w-[150px] p-2 rounded-[4px] text-sm ${selectedFilters.bills.includes(tag.id)
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {tag.name} {/* Display the name */}
                                        </button>
                                    ))
                                ) : (
                                    <div>Loading bills...</div>
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
};

export default EditProfile;