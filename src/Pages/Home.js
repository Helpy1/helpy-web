import React, { useState, useEffect } from 'react';
import ProfileCard from '../Pages/Components/Cards/ProfileCard';
import Navbar from '../Pages/Navbar';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import API_CONFIG from '../Api_Config';
import CustomLoader from './Components/CustomLoader';

const Home = () => {
    const [profiles, setProfiles] = useState([]);
    const [visibleProfiles, setVisibleProfiles] = useState(20); // Number of profiles to display initially
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state?.data;
    const [gender, setGender] = useState('');
    const [Name, setName] = useState('');
    const [DBid, setDBid] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [sexuality, setSexuality] = useState('');
    const [isLoading, setIsLoading] = useState(true); // State for loader
    const [profileImage, setProfileImage] = useState('');
    const [sortBy, setSortBy] = useState('Recently Active'); // Default sorting option

    useEffect(() => {
        let retrievedGender = gender;
        let retrievedSexuality = sexuality;
        let retrievedName = Name;
        let retrievedImage = profileImage;
        let retrievedUguid = '';
        let retrievedUserDetailsId = '';
        let retrievedCity = '';
        let retrievedCountry = '';
        let retrievedLongitude = '';
        let retrievedLatitude = '';
    
        if (data && data.length > 0) {
            const firstUser = data[0].users;
            retrievedName = firstUser.fullName;
            retrievedGender = firstUser.gender;
            retrievedSexuality = firstUser.sexuality;
            const profileImageData = data.find(item => item.image?.name === "Profile_image");
            retrievedImage = profileImageData ? profileImageData.image.imageLink : '';
    
            retrievedUguid = firstUser.uGuid;
            retrievedUserDetailsId = data[0].userDetails.userId;
            retrievedCity = firstUser.city;
            retrievedCountry = firstUser.country;
            retrievedLongitude = firstUser.longitude;
            retrievedLatitude = firstUser.latitude;
    
            localStorage.setItem('name', retrievedName);
            localStorage.setItem('uid', retrievedUguid);
            localStorage.setItem('profileImage', retrievedImage);
            localStorage.setItem('dbID', firstUser.id);
            localStorage.setItem('gender', retrievedGender);
            localStorage.setItem('sexuality', retrievedSexuality);
            localStorage.setItem('userDetailsId', retrievedUserDetailsId);
            localStorage.setItem('city', retrievedCity);
            localStorage.setItem('country', retrievedCountry);
            localStorage.setItem('longitude', retrievedLongitude);
            localStorage.setItem('latitude', retrievedLatitude);
        } else {
            retrievedName = localStorage.getItem('name') || '';
            retrievedGender = localStorage.getItem('gender') || '';
            retrievedSexuality = localStorage.getItem('sexuality') || '';
            retrievedImage = localStorage.getItem('profileImage') || '';
            retrievedUguid = localStorage.getItem('uid') || '';
            retrievedUserDetailsId = localStorage.getItem('userDetailsId') || '';
            retrievedCity = localStorage.getItem('city') || '';
            retrievedCountry = localStorage.getItem('country') || '';
            retrievedLongitude = localStorage.getItem('longitude') || '';
            retrievedLatitude = localStorage.getItem('latitude') || '';
        }
    
        setName(retrievedName);
        setGender(retrievedGender);
        setSexuality(retrievedSexuality);
        setProfileImage(retrievedImage);
        setLongitude(retrievedLongitude);
        setLatitude(retrievedLatitude);
        setDBid(retrievedUserDetailsId);
    }, [data]);

    useEffect(() => {
        if (gender && sexuality && DBid && longitude && latitude) {
            setIsLoading(true); // Start loading
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
                        const result = JSON.parse(textResponse); // Parse the text as JSON if it's not empty
                        if (result && result.data) {
                            setProfiles(result.data);  // Set the data (no filter)
                            localStorage.setItem('profiles', JSON.stringify(result.data));
                            console.log("Profile is saved in LocalStroage")
                            console.log("Fetched data without filter:", result.data);
                        }
                    }
                })
                .catch(error => console.error('Error fetching user data:', error))
                .finally(() => setIsLoading(false)); // Stop loading
        }
    }, [gender, sexuality, DBid, longitude, latitude, sortBy]);

    const handleSearchClick = () => {
        navigate('/search', { state: { profiles } });
    };

    const handleShowMore = () => {
        setVisibleProfiles(prev => prev + 20); // Load 20 more profiles
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
    };


    return (
        <div>
            <Navbar profileImage={profileImage} name={Name} onSearchClick={handleSearchClick} onSortChange={handleSortChange} sortBy={sortBy} />
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
            <Footer />
        </div>
    );
};

export default Home;
