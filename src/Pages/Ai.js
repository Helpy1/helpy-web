import React, { useEffect, useState } from 'react';
import ProfileCard from './Components/Cards/ProfileCard'; // Ensure you have this component
import API_CONFIG from '../Api_Config'
import Navbar from './Navbar';
import CustomLoader from './Components/CustomLoader';
function Ai() {
    const [dbid, setDbid] = useState('');
    const [gender, setGender] = useState('');
    const [sexuality, setSexuality] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [visibleProfiles, setVisibleProfiles] = useState(20); // Number of profiles to display initially
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State for loader

    useEffect(() => {
        // Retrieve data from localStorage on component mount
        const savedDBID = localStorage.getItem('dbID');
        const savedGender = localStorage.getItem('gender');
        const savedSexuality = localStorage.getItem('sexuality');
        const savedLat = localStorage.getItem('latitude');
        const savedLong = localStorage.getItem('longitude');
    
        // Ensure that retrieved data is valid (e.g., parsed numbers if needed)
        const latitude = savedLat ? parseFloat(savedLat) : null;
        const longitude = savedLong ? parseFloat(savedLong) : null;
    
        // Set the state values from localStorage
        setDbid(savedDBID);
        setGender(savedGender);
        setSexuality(savedSexuality);
        setLongitude(longitude);
        setLatitude(latitude);
    
        // Define the function to fetch user details
        const fetchUserDetails = async () => {
            setIsLoading(true); // Start loading
            try {
                // Fetch user bills
                const billsUrl = `${API_CONFIG.BASE_URL}/api/account/GetUserBills?userId=${savedDBID}`;
                const billsResponse = await fetch(billsUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                    },
                });
    
                if (!billsResponse.ok) {
                    throw new Error('Failed to fetch user bills');
                }
    
                const billsData = await billsResponse.json();
                const selectedItems = billsData.map(bill => bill.bills.id);
                console.log('Selected Bill IDs:', selectedItems);
    
                const csvBills = selectedItems.join(',');
    
                // Adjusted request body according to second format
                const url = `${API_CONFIG.BASE_URL}/ai/GetAll4UAIUsersAsync`;
                const requestBody = {
                    userId: savedDBID, // Using savedDBID from localStorage
                    sortBy: 2, // Assuming this is fixed (could be dynamic based on user input)
                    gender: savedGender,
                    sexuality: savedSexuality,
                    longitude: String(longitude), // Parsed longitude
                    latitude: String(latitude),   // Parsed latitude
                    csvBills: csvBills,   // Added csvBills to requestBody
                };
    
                console.log("Request body for fetchDataWithoutFilter:", requestBody);
    
                // Make POST request
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                    },
                    body: JSON.stringify(requestBody),
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const textResponse = await response.text();
    
                if (textResponse) {
                    const result = JSON.parse(textResponse); // Parse the text as JSON if it's not empty
                    if (result && result.data) {
                        setProfiles(result.data); // Set the data (no filter)
                        console.log("Fetched data without filter:", result.data);
                    } else {
                        console.error("No data found in the response.");
                    }
                } else {
                    console.error("Empty response body.");
                }
    
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        };
    
        // Fetch the details when the component is mounted
        if (savedDBID && savedGender && savedSexuality && latitude && longitude) {
            fetchUserDetails();
        }
    
    }, []);
    
    const handleShowMore = () => {
        setVisibleProfiles((prev) => prev + 20); // Load 30 more profiles
    };

    return (
        <div>
            <Navbar />
            {/* {profiles.map(profile => (
                        <ProfileCard key={profile.id} profile={profile} />
                    ))} */}
            {isLoading ? (
                <CustomLoader isVisible={isLoading} />
            ) : (
                <div className="home flex flex-col justify-center items-center p-8">
                    <div className="profile-cards grid gap-6 w-full max-w-[1200px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {profiles.slice(0, visibleProfiles).map(profile => (
                            <ProfileCard key={profile.id} profile={profile} />
                        ))}
                    </div>
                    {visibleProfiles < profiles.length && (
                        <button
                            onClick={handleShowMore}
                            className="mt-6 px-4 py-2 rounded-full bg-[#e9677b] text-white rounded hover:bg-[#e9677b]"
                        >
                            Show More
                        </button>
                    )}
                </div>
            )}


        </div>
    );
}

export default Ai;
