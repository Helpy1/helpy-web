import React, { useEffect, useState } from 'react';
import ProfileCard from './Components/Cards/ProfileCard'; // Ensure you have this component
import API_CONFIG from '../Api_Config'
import Navbar from './Navbar';
import CustomLoader from './Components/CustomLoader';
function Ai() {
    const [dbid, setDbid] = useState('');
    const [gender, setGender] = useState('');
    const [sexuality, setSexuality] = useState('');
    const [visibleProfiles, setVisibleProfiles] = useState(20); // Number of profiles to display initially
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State for loader
    useEffect(() => {
        // Retrieve data from localStorage on component mount
        const savedDBID = localStorage.getItem('dbID');
        const savedGender = localStorage.getItem('gender');
        const savedSexuality = localStorage.getItem('sexuality');

        setDbid(savedDBID);
        setGender(savedGender);
        setSexuality(savedSexuality);

        const fetchUserDetails = async () => {
            setIsLoading(true); // Start loading
            try {
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

                const filterData = {
                    userId: savedDBID,
                    fullName: null,
                    minAge: 0,
                    maxAge: 0,
                    gender: savedGender,
                    city: null,
                    country: null,
                    longitude: null,
                    latitude: null,
                    minHeightInInches: null,
                    maxHeightInInches: null,
                    radius: 0,
                    sexuality: savedSexuality,
                    occupation: null,
                    lookingFor: null,
                    ethnicity: null,
                    language: null,
                    selectedItems,
                    bodyType: null,
                    smoking: null,
                    drinking: null,
                    relationshipStatus: null,
                    education: null,
                    children: null,
                };

                const userDetailsUrl = 'https://usamaanwar-001-site1.atempurl.com/GetAllUserDetails';
                const userDetailsResponse = await fetch(userDetailsUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                    },
                    body: JSON.stringify(filterData),
                });

                if (!userDetailsResponse.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const result = await userDetailsResponse.json();
                const shuffledData = result.sort(() => Math.random() - 0.5);

                setProfiles(shuffledData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        };


        fetchUserDetails();
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
