import React, { useState, useEffect } from "react";
import ProfileCard from "./Components/Cards/ProfileCard";
import Navbar from "./Navbar";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import axios from 'axios';
import { useFilters } from './Components/Context/FilterContext';
import { useFilterData } from './Components/Context/FilterDataContext'
import { useLocation } from "react-router-dom";
import API_CONFIG from '../Api_Config'
import CustomLoader from './Components/CustomLoader'; // Import your loader component

const Search = () => {
    const location = useLocation();
    const { filters, updateFilters, resetFilters } = useFilters();
    console.log("Filters From Context = ", filters)
    const [profiles, setProfiles] = useState([]); // State to store 
    const { filterData, setFilterData } = useFilterData();
    //console.log("FiltersData From Context = ", filterData)
    const [cacheData, setcacheData] = useState([]); // State to store 
    const [languageItems, setLanguageItems] = useState([]); // Language data
    const [billsData, setBillsData] = useState([]); // Bills data
    const [name, setName] = useState(filters.fullName || null);
    const [sexuality, setSexuality] = useState('');
    const [selectedMembers, setSelectedMembers] = useState(filters.selectedItems || []);
    const [isLoading, setIsLoading] = useState(true); // State for loader
    const [currentLocation, setCurrentLocation] = useState(''); // Holds the current location string
    const [selectedLocation, setSelectedLocation] = useState("cartagena"); // Default to Cartagena  
    const [distance, setDistance] = useState(filters.distance || 0);
    const [heightInInches, setHeightInInches] = useState(filters.heightInInches || 70);
    const [ageRange, setAgeRange] = useState([filters.minAge || 18, filters.maxAge || 70]);
    const [heightRange, setHeightRange] = useState([filters.minHeightInInches || 48, filters.maxHeightInInches || 96]); // 4ft (48in) to 8ft (96in)
    const [selectedLanguage, setSelectedLanguage] = useState(filters.language || null);
    const [city, setCity] = useState('');
    const [DBid, setDBid] = useState('');
    const [sortBy, setSortBy] = useState('Recently Active'); // Default sorting option
    const [country, setCountry] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [gender, setgender] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [otherCity, setOtherCity] = useState("");
    const [otherCountry, setOtherCountry] = useState("");
    const [otherLatitude, setOtherLatitude] = useState(null);
    const [otherLongitude, setOtherLongitude] = useState(null);
    const [selectedEducation, setSelectedEducation] = useState(filters.education || null);
    const [selectedKids, setSelectedKids] = useState(filters.children || null);
    const [selectedSmoker, setSelectedSmoker] = useState(filters.smoking || null);
    const [selectedDrinker, setSelectedDrinker] = useState(filters.drinking || null);
    const [visibleProfiles, setVisibleProfiles] = useState(20); // Number of profiles to display initially
    const [selectedRelationshipStatus, setSelectedRelationshipStatus] = useState(filters.relationshipStatus || null);
    const [selectedPhysicalAppearance, setSelectedPhysicalAppearance] = useState(filters.bodyType || null);
    const [selectedLookingFor, setSelectedLookingFor] = useState(filters.lookingFor || null);
    const [selectedEthnicity, setSelectedEthnicity] = useState(filters.ethnicity || null);
    const [isFiltersApplied, setIsFiltersApplied] = useState(false);
    const [occupation, setOccupation] = useState(filters.occupation || null); // State to handle occupation input
    useEffect(() => {
        const storedProfiles = localStorage.getItem('profiles');
        const storedCity = localStorage.getItem('city');
        const storedCountry = localStorage.getItem('country');
        const storedlong = localStorage.getItem('longitude');
        const storedlat = localStorage.getItem('latitude');
        const savedGender = localStorage.getItem('gender');
        const savedSexuality = localStorage.getItem('sexuality');
        const savedDBiD = localStorage.getItem('dbID');
        // if (storedProfiles) {
        //     setProfiles(JSON.parse(storedProfiles));
        // }

        // const cachedProfiles = localStorage.getItem('Cachedata');
        // if (cachedProfiles) {
        //     setcacheData(JSON.parse(cachedProfiles)); // Use cached profiles if available
        // } else {
        //     const storedProfiles = localStorage.getItem('profiles');
        //     if (storedProfiles) {
        //         setProfiles(JSON.parse(storedProfiles)); // Use stored profiles if cache data is not available
        //     }
        // }

        setgender(savedGender)
        setCity(storedCity)
        setDBid(savedDBiD)
        setCountry(storedCountry)
        setLongitude(storedlong)
        setLatitude(storedlat)
        setSexuality(savedSexuality)
        setCurrentLocation(`${storedCity}, ${storedCountry}`); // Display-friendly format
    }, []);


    const dataToShow = cacheData.length > 0 ? cacheData : profiles; // Fallback to profiles if cacheData is empty

    console.log("city = ", city)
    console.log("country = ", country)
    console.log("Long = ", longitude)
    console.log("Lat  = ", latitude)


    console.log("other city = ", otherCity)
    console.log("other  country = ", otherCountry)
    console.log("other Long = ", otherLongitude)
    console.log("other Lat  = ", otherLatitude)


    // useEffect(() => {
    //     setIsLoading(true); // Start loading
    //     // Check if filterData is present, and if not, make the API call to get data without filters
    //     if (!filterData) {
    //         // If filterData is null, undefined, or an empty object, we fetch the data without filters
    //         if (gender && sexuality && DBid && longitude && latitude) {
    //             setIsLoading(true); // Start loading
    //             console.log("FilterData is null makeing Api request of GetAllExploreUsersAsync")
    //             const url = `${API_CONFIG.BASE_URL}/Explore/GetAllExploreUsersAsync`;
    //             const requestBody = {
    //                 userId: DBid,
    //                 sortBy: sortBy === 'Nearest' ? 1 : sortBy === 'Recently Active' ? 2 : 3,
    //                 gender: gender,
    //                 sexuality: sexuality,
    //                 longitude: longitude,
    //                 latitude: latitude,
    //             };

    //             console.log("Request body for fetchDataWithoutFilter:", requestBody);

    //             fetch(url, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Accept': '*/*',
    //                     'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
    //                 },
    //                 body: JSON.stringify(requestBody),
    //             })
    //                 .then(response => {
    //                     if (!response.ok) {
    //                         throw new Error(`HTTP error! Status: ${response.status}`);
    //                     }
    //                     return response.text();
    //                 })
    //                 .then(textResponse => {
    //                     if (textResponse) {
    //                         const result = JSON.parse(textResponse);
    //                         if (result && result.data) {
    //                             setProfiles(result.data); // Set the data (no filter)
    //                             console.log("Fetched data without filter:", result.data);
    //                         }
    //                     }
    //                 })
    //                 .catch(error => console.error('Error fetching user data:', error))
    //                 .finally(() => setIsLoading(false)); // Stop loading
    //         }
    //     } else {
    //         // If filterData is present, apply the filters
    //         handleApplyFilters();
    //     }
    // }, [filterData, gender, sexuality, DBid, longitude, latitude, sortBy]);


    useEffect(() => {
        // Only fetch data when the filters are either not applied or when data is missing
        if (!isFiltersApplied) {
            setIsLoading(true); // Start loading
            console.log("FilterData on Intiial UseEffect = ",filters)

            // Check if filterData is present and apply the API request accordingly
            if (filters) {
                // Apply filters if filterData is present
                handleApplyFilters();
                setIsFiltersApplied(true); // Mark filters as applied
            } else {
                // If filterData is not available, fetch without filters
                if (gender && sexuality && DBid && longitude && latitude) {
                    console.log("FilterData is null, making API request to GetAllExploreUsersAsync");

                    const url = `${API_CONFIG.BASE_URL}/Explore/GetAllExploreUsersAsync`;
                    const requestBody = {
                        userId: DBid,
                        sortBy: sortBy === 'Nearest' ? 1 : sortBy === 'Recently Active' ? 2 : 3,
                        gender: gender,
                        sexuality: sexuality,
                        longitude: longitude,
                        latitude: latitude,
                    };

                    console.log("Request body for fetchDataWithoutFilter:", requestBody);

                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*',
                            'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                        },
                        body: JSON.stringify(requestBody),
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.text();
                        })
                        .then(textResponse => {
                            if (textResponse) {
                                const result = JSON.parse(textResponse);
                                if (result && result.data) {
                                    setProfiles(result.data); // Set the data without filters
                                    console.log("Fetched data without filter:", result.data);
                                }
                            }
                        })
                        .catch(error => console.error('Error fetching user data:', error))
                        .finally(() => setIsLoading(false)); // Stop loading
                }
            }
        }
    }, [filters, gender, sexuality, DBid, longitude, latitude, sortBy, isFiltersApplied]);


    const handleSingleSelection = (category, value) => {
        switch (category) {
            case 'education':
                setSelectedEducation(prev => prev === value ? null : value);
                break;
            case 'kids':
                setSelectedKids(prev => prev === value ? null : value);
                break;
            case 'smoker':
                setSelectedSmoker(prev => prev === value ? null : value);
                break;
            case 'drinker':
                setSelectedDrinker(prev => prev === value ? null : value);
                break;
            case 'relationshipStatus':
                setSelectedRelationshipStatus(prev => prev === value ? null : value);
                break;
            case 'physicalAppearance':
                setSelectedPhysicalAppearance(prev => prev === value ? null : value);
                break;
            case 'lookingFor':
                setSelectedLookingFor(prev => prev === value ? null : value);
                break;
            case 'ethnicity':
                setSelectedEthnicity(prev => prev === value ? null : value);
                break;
            default:
                break;
        }
    };


    const handleInputChange = (event) => {
        setName(event.target.value);
    };


    const handleShowMore = () => {
        setVisibleProfiles((prev) => prev + 20); // Load 30 more profiles
    };


    const handleResetFilters = () => {
        // Reset the filters and fields to match selectedFilters
        resetFilters(null);
        setName('');                          // fullName
        setAgeRange([18, 70]);                 // maxAge, minAge
        setHeightRange([48, 96]);              // maxHeightInInches, minHeightInInches
        setLatitude('');                       // latitude
        setLongitude('');                      // longitude
        setDistance(0);                       // radius
        setOccupation('');                     // occupation
        setSelectedLookingFor('');             // lookingFor
        setSelectedEthnicity('');              // ethnicity
        setSelectedLanguage('');                       // language              // maxHeightInInches (default)
        setSelectedMembers([]);                      // selectedItems (selected bills)
        setSelectedPhysicalAppearance('');               // bodyType
        setSelectedSmoker('');                 // smoking
        setSelectedDrinker('');                // drinking
        setSelectedRelationshipStatus('');     // relationshipStatus
        setSelectedEducation('');              // education
        setSelectedKids('');               // children
        setSearchText('');                     // optional, if needed for search text
        setSelectedLocation('cartagena');      // default to 'cartagena'
        setCity(city)
        setCountry(country)
        setOtherCity('')
        setOtherCountry('')
        //setFilterData(null)

        //handleApplyFilters();  // This will now apply the reset filters to the API

    };



    // Fetch languages (example)
    const fetchLanguages = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const data = await response.json();
            const languageSet = new Set();
            data.forEach(country => {
                if (country.languages) {
                    Object.values(country.languages).forEach(language => {
                        languageSet.add(language);
                    });
                }
            });
            const sortedLanguages = [...languageSet].sort().map(language => ({
                label: language,
                value: language,
            }));
            setLanguageItems(sortedLanguages);
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    };

    useEffect(() => {
        fetchLanguages(); // Fetch languages when component mounts
    }, []);

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
    };


    // Fetch Bills Data (example)
    const fetchBillsData = async () => {
        setIsLoading(true); // Start loading
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
            setBillsData(data.filter(bill => bill.isActive));
        } catch (err) {
            console.error('Error fetching bills:', err);
        } finally {
            setIsLoading(false); // Start loading
        }
    };

    // Convert inches to feet and inches
    const formatHeight = (inches) => {
        const feet = Math.floor(inches / 12);
        const remainingInches = inches % 12;
        return `${feet} ft ${remainingInches} in`;
    };

    // Handle slider change
    const handleHeightChange = (newRange) => {
        setHeightRange(newRange);
    };

    const handleAgeChange = (value) => {
        // Update age range with the selected slider values
        setAgeRange(value);
    };


    useEffect(() => {
        fetchBillsData(); // Fetch bills data when component mounts
    }, []);

    const fetchSuggestions = async (input) => {
        if (input.length > 2) {
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_CONFIG.YOUR_GOOGLE_API_KEY}`
                );
                setSuggestions(response.data.predictions);
            } catch (error) {
                console.error('Error fetching place suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };



    // Handle selection of a suggestion
    const handleSuggestionClick = async (placeId) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_CONFIG.YOUR_GOOGLE_API_KEY}`
            );

            const location = response.data.result.geometry.location;
            const addressComponents = response.data.result.address_components;

            const cityComponent = addressComponents.find((c) => c.types.includes("locality"));
            const countryComponent = addressComponents.find((c) => c.types.includes("country"));

            // Update "Other Location" fields
            setOtherCity(cityComponent ? cityComponent.long_name : "");
            setOtherCountry(countryComponent ? countryComponent.long_name : "");
            setOtherLatitude(location.lat);
            setOtherLongitude(location.lng);
            setSearchText(
                `${cityComponent ? cityComponent.long_name : ""}, ${countryComponent ? countryComponent.long_name : ""}`
            );
            setSuggestions([]);
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };






    // Handle tag selection for bills or other filters
    const handleTagClick = (tag) => {
        if (selectedMembers.includes(tag)) {
            setSelectedMembers(selectedMembers.filter((member) => member !== tag));
        } else {
            setSelectedMembers([...selectedMembers, tag]);
        }
    };

    // Prepare the selected filters as a JSON object
    const handleApplyFilters = async () => {
        console.log("i am in handleApply Filter")
        const selectedFilters = {
            // Flatten location into direct fields (no nested 'location' object)
            city: selectedLocation === "cartagena"
                ? city
                : otherCity,
            country: selectedLocation === "cartagena"
                ? country
                : otherCountry,
            latitude: selectedLocation === "cartagena"
                ? String(latitude)
                : String(otherLatitude),
            longitude: selectedLocation === "cartagena"
                ? String(longitude)
                : String(otherLongitude),

            radius: distance,
            search: name,
            userId: 0,
            maxAge: ageRange[1],  // Max age (second value in ageRange)
            minAge: ageRange[0],  // Min age (first value in ageRange)
            maxHeightInInches: heightRange[1],  // Max height (second value in heightRange)
            minHeightInInches: heightRange[0],  // Min height (first value in heightRange)
            language: selectedLanguage,
            occupation: occupation, // Optional if you want to include occupation as well
            selectedItems: selectedMembers.filter(member => billsData.some(bill => bill.id === member)), // Selected bills   
            // Group categories separately
            education: selectedEducation,
            children: selectedKids,
            smoking: selectedSmoker,
            gender: gender,
            sexuality: sexuality,
            drinking: selectedDrinker,
            relationshipStatus: selectedRelationshipStatus,
            bodyType: selectedPhysicalAppearance,
            lookingFor: selectedLookingFor,
            ethnicity: selectedEthnicity,
            sortBy: sortBy === 'Nearest' ? 1 : sortBy === 'Recently Active' ? 2 : 3,
        };

    

        // Log the selected filters to see the final structure
        console.log("Selected Filters:", selectedFilters);
        //setFilterData(JSON.stringify(selectedFilters))
        //console.log("FilterData afterSaving  = ",filterData)

        updateFilters(selectedFilters);

        // Make API call to fetch user details
        try {
            setIsLoading(true); // Start loading
            const response = await fetch(`${API_CONFIG.BASE_URL}/Explore/FilterExploreUserAsync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                },
                body: JSON.stringify(selectedFilters), // Pass the selectedFilters as the request body
            });

            const textResponse = await response.text();

            if (textResponse) {
                const result = JSON.parse(textResponse); // Parse the text as JSON if it's not empty
                if (result && result.data) {
                    setProfiles(result.data);  // Set the data (no filter)
                    console.log("Fetched data with filter:", result.data);
                } else {
                    console.error("No data found in the response.");
                }
            } else {
                console.error("Empty response body.");
            }


        } catch (err) {
            console.error('Error fetching user details:', err);
        } finally {
            setIsLoading(false); // Start loading
        }

        // You can send this JSON object to your backend or update local state here as needed.
    };



    return (
        <div>
            <Navbar onSortChange={handleSortChange} sortBy={sortBy} />
            {/* Sidebar Filters */}
            {isLoading ? (
                <CustomLoader isVisible={isLoading} />
            ) : (
                <div className="flex flex-col lg:flex-row w-full max-w-[1400px] m-auto h-full p-4">
                    <aside className="w-full w-100% lg:w-[30%]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg text-[#e9677b] font-bold">Search Filters to Apply</h2>
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="w-1/4 bg-[#e9677b] text-white  rounded-full text-sm"
                            >
                                Reset Filters
                            </button>
                        </div>

                        <div className="w-full bg-white p-4 rounded-lg shadow-md">
                            <div className="other-container">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="border focus:shadow-none focus:ring-0 focus:ring-transparent w-full p-2 mb-4 rounded-lg focus:outline-none"
                                    value={name} // Bind input value to name state
                                    onChange={handleInputChange} // Handle input changes
                                />
                            </div>

                            <label className="block text-sm text-[#e9677b] font-medium mb-4">Location</label>
                            <div className="h-cover">
                                <div className="mb-4 pl-2">
                                    <label className="flex items-center mb-2 text-sm">
                                        <input
                                            type="radio"
                                            name="location"
                                            value="cartagena"
                                            checked={selectedLocation === "cartagena"}
                                            onChange={() => setSelectedLocation("cartagena")}
                                            className="mr-2 text-[#e9677b] bg-gray-100 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <span>
                                            {currentLocation || 'Loading current location...'} {/* Always display city and country */}
                                        </span>
                                    </label>

                                    <label className="flex items-center text-sm">
                                        <input
                                            type="radio"
                                            name="location"
                                            value="other"
                                            checked={selectedLocation === "other"}
                                            onChange={() => setSelectedLocation("other")}
                                            className="mr-2 text-[#e9677b] bg-gray-100 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        Other Location
                                    </label>

                                    {selectedLocation === "other" && (
                                        <div className="mt-5">
                                            <input
                                                type="text"
                                                value={searchText}
                                                onChange={(e) => {
                                                    setSearchText(e.target.value);
                                                    fetchSuggestions(e.target.value);
                                                }}
                                                placeholder="Search for a location"
                                                className="w-full p-2 mb-4 rounded-lg focus:outline-none"
                                            />
                                            {/* Display selected "Other Location" */}
                                            {otherCity && otherCountry && (
                                                <div className="text-sm">
                                                    Selected Location: {otherCity}, {otherCountry}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {suggestions.length > 0 && (
                                        <div className="suggestions-list">
                                            {suggestions.map((suggestion) => (
                                                <div
                                                    key={suggestion.place_id}
                                                    className="suggestion-item"
                                                    onClick={() => handleSuggestionClick(suggestion.place_id)}
                                                >
                                                    {suggestion.description}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Distance Container */}
                                <div className="distance-container">
                                    <label className="block mb-3 text-[#e9677b] font-medium">Distance (km)</label>
                                    <div className="flex row items-center gap-2">
                                        <span className="text-[14px]">0 - </span>
                                        <input
                                            type="number"
                                            min="2"
                                            max="100"
                                            value={distance}
                                            onChange={(e) => {
                                                const newValue = e.target.value;

                                                if (newValue === "") {
                                                    setDistance(""); // Set state to an empty string if input is cleared
                                                } else {
                                                    setDistance(Math.min(100, Number(newValue)));
                                                }
                                            }}
                                            className="border p-1 w-fit text-[14px] rounded-md ps-2 py-2 focus:shadow-none focus:ring-0 focus:ring-transparent focus:outline-none"
                                        />
                                        <span className="text-[14px]">km</span>
                                    </div>
                                    <div className="my-4">
                                        <Slider
                                            min={0}
                                            max={100}
                                            value={distance || 0} // Default to 0 if distance is empty
                                            onChange={(value) => {
                                                const newValue = Math.min(1500, value);
                                                setDistance(newValue);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-cover">
                                <div className="text-sm font-medium">
                                    <span className="text-sm text-[#e9677b] block">{`Age Range: ${ageRange[0]} - ${ageRange[1]}`}</span>
                                </div>
                                <div className="my-4">
                                    <Slider
                                        range
                                        min={18} // Minimum age (18 years)
                                        max={70} // Maximum age (100 years)
                                        value={ageRange} // The current value of the slider
                                        onChange={handleAgeChange} // Handle the change event
                                        trackStyle={[{ backgroundColor: "#3b82f6" }]} // Customize the track color
                                        handleStyle={[
                                            { borderColor: "#3b82f6" }, // Customize the handle color for both ends
                                            { borderColor: "#3b82f6" },
                                        ]}
                                    />
                                </div>
                            </div>


                            <div className="h-cover">
                                <div className="text-sm  font-medium">
                                    <span className="text-sm text-[#e9677b] block">{`Height range: ${formatHeight(heightRange[0])} - ${formatHeight(heightRange[1])}`}</span>

                                </div>
                                <div className="my-4">
                                    <Slider
                                        range
                                        min={48} // 4ft (48in)
                                        max={96} // 8ft (96in)
                                        value={heightRange}
                                        onChange={handleHeightChange}
                                        trackStyle={[{ backgroundColor: "#3b82f6" }]}
                                        handleStyle={[
                                            { borderColor: "#3b82f6" },
                                            { borderColor: "#3b82f6" },
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Occupation Search */}
                            <div className="mb-6">
                                <label className="block mb-2 text-sm text-[#e9677b] font-medium">Occupation</label>
                                <input
                                    type="text"
                                    value={occupation}
                                    onChange={(e) => setOccupation(e.target.value)}
                                    placeholder="Search for occupation"
                                    className="border w-full p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>


                            <div className="mb-4">
                                <label className="block text-sm  text-[#e9677b] font-medium mb-4">Language</label>
                                <select
                                    className="w-full border rounded-[4px] p-2"
                                    value={selectedLanguage || ""} // Ensure default is empty if no language is selected
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Select Language
                                    </option>
                                    {languageItems.map((lang) => (
                                        <option key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="my-4">
                                <label className="block mb-3 text-[#e9677b] font-medium">Bills</label>
                                <div className="flex flex-wrap justify-between gap-2">
                                    {billsData.map((bill) => (
                                        <button
                                            type="button"
                                            key={bill.id}
                                            onClick={() => handleTagClick(bill.id)}
                                            className={`w-[48%] p-2 rounded-[4px] text-sm ${selectedMembers.includes(bill.id)
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {bill.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Education Filter */}
                            <div className="my-4">
                                <label className="block mb-3 text-[#e9677b] font-medium">Education</label>
                                <div className="flex flex-wrap justify-between gap-2">
                                    {[
                                        "High school",
                                        'Bachelor\'s degree',
                                        'Master\'s degree',
                                        "Doctorate"
                                    ].map((education) => (
                                        <button
                                            type="button"
                                            key={education}
                                            onClick={() => handleSingleSelection('education', education)}
                                            className={`w-[48%] p-2 rounded-[4px] text-sm ${selectedEducation === education
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {education}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Kids Filter */}
                            <div className="my-4">
                                <label className="block mb-3 text-[#e9677b] font-medium">Kids</label>
                                <div className="flex flex-wrap justify-between gap-2">
                                    {["Doesn't have kids", "Have kids", "Prefer Not to Reveal"].map((kidsOption) => (
                                        <button
                                            type="button"
                                            key={kidsOption}
                                            onClick={() => handleSingleSelection('kids', kidsOption)}
                                            className={`w-[48%] p-2 rounded-[4px] text-sm ${selectedKids === kidsOption
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {kidsOption}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Smoker Filter */}
                            <div className="my-4">
                                <label className="block mb-3 text-[#e9677b] font-medium">Smoker</label>
                                <div className="flex flex-wrap justify-between gap-2">
                                    {["Non-smoker", "Occasional smoker", "Heavy smoker"].map((smokerOption) => (
                                        <button
                                            type="button"
                                            key={smokerOption}
                                            onClick={() => handleSingleSelection('smoker', smokerOption)}
                                            className={`w-[48%] p-2 rounded-[4px] text-sm ${selectedSmoker === smokerOption
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {smokerOption}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Drinker Filter */}
                            <div className="my-4">
                                <label className="block mb-3 text-[#e9677b] font-medium">Drinker</label>
                                <div className="flex flex-wrap justify-between gap-2">
                                    {["Non-Drinker", "Social Drinker", "Heavy Drinker"].map((drinkerOption) => (
                                        <button
                                            type="button"
                                            key={drinkerOption}
                                            onClick={() => handleSingleSelection('drinker', drinkerOption)}
                                            className={`w-[48%] p-2 rounded-[4px] text-sm ${selectedDrinker === drinkerOption
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {drinkerOption}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Relationship Status Filter */}
                            <div className="my-4">
                                <label className="block mb-3 text-[#e9677b] font-medium">Relationship Status</label>
                                <div className="flex flex-wrap justify-between gap-2">
                                    {["Single", "In a relationship", "Married", "Divorced", "Situationship"].map((relationshipStatus) => (
                                        <button
                                            type="button"
                                            key={relationshipStatus}
                                            onClick={() => handleSingleSelection('relationshipStatus', relationshipStatus)}
                                            className={`w-[48%] p-2 rounded-[4px] text-sm ${selectedRelationshipStatus === relationshipStatus
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {relationshipStatus}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Physical Appearance Filter */}
                            <div className="my-4">
                                <label className="block mb-3 text-[#e9677b] font-medium">Physical Appearance</label>
                                <div className="flex flex-wrap justify-between gap-2">
                                    {["Slim", "Athletic", "Average", "Heavyset"].map((appearance) => (
                                        <button
                                            type="button"
                                            key={appearance}
                                            onClick={() => handleSingleSelection('physicalAppearance', appearance)}
                                            className={`w-[48%] p-2 rounded-[4px] text-sm ${selectedPhysicalAppearance === appearance
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {appearance}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Looking For Filter */}
                            <div className="my-4">
                                <label className="block mb-3 text-[#e9677b] font-medium">Looking For</label>
                                <div className="flex flex-wrap justify-between gap-2">
                                    {["Friendship", "Casual", "Long Term"].map((lookingFor) => (
                                        <button
                                            type="button"
                                            key={lookingFor}
                                            onClick={() => handleSingleSelection('lookingFor', lookingFor)}
                                            className={`w-[48%] p-2 rounded-[4px] text-sm ${selectedLookingFor === lookingFor
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {lookingFor}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ethnicity Filter */}
                            <div className="my-4">
                                <label className="block mb-3 text-[#e9677b] font-medium">Ethnicity</label>
                                <div className="flex flex-wrap justify-between gap-2">
                                    {["Caucasian", "Asian", "African American", "Latino", "Middle Eastern", "Other"].map((ethnicity) => (
                                        <button
                                            type="button"
                                            key={ethnicity}
                                            onClick={() => handleSingleSelection('ethnicity', ethnicity)}
                                            className={`w-[48%] p-2 rounded-[4px] text-sm ${selectedEthnicity === ethnicity
                                                ? "bg-[#e9677b] text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {ethnicity}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleApplyFilters}
                                type="button"
                                className="btn flex flex-col justify-center items-center bg-[#e9677b] text-white w-full py-3 rounded-[4px]  hover:bg-[#f86a82] transition"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="w-full  lg:w-4/5 mt-6 lg:mt-0 lg:ml-8">
                        <div className="profile-cards grid gap-6 w-full max-w-[1200px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            {dataToShow.slice(0, visibleProfiles).map(profile => (
                                <ProfileCard key={profile.id} profile={profile} />
                            ))}
                        </div>
                        {visibleProfiles < dataToShow.length && (
                            <button
                                onClick={handleShowMore}
                                className="mt-6 px-4 py-2 rounded-full bg-[#e9677b] text-white rounded hover:bg-[#e9677b]"
                            >
                                Show More
                            </button>
                        )}
                    </main>
                </div>
            )}
        </div>
    );
};

export default Search;
