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
    console.log("data = ", data)
    const [gender, setGender] = useState('');
    const [Name, setName] = useState('');
    const [DBid, setDBid] = useState('');
    const [sexuality, setSexuality] = useState('');
    const [isLoading, setIsLoading] = useState(true); // State for loader
    const [profileImage, setProfileImage] = useState('');



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
    
        // Check and retrieve from `data` or `localStorage`
        if (data && data.length > 0) {
            const firstUser = data[0].users;
            retrievedName = firstUser.fullName;
            retrievedGender = firstUser.gender;
            retrievedSexuality = firstUser.sexuality;
    
            const profileImageData = data.find(item => item.image?.name === "Profile_image");
            retrievedImage = profileImageData ? profileImageData.image.imageLink : '';
    
            // Retrieve additional data
            retrievedUguid = firstUser.uGuid;
            retrievedUserDetailsId = data[0].userDetails.userId;
            retrievedCity = firstUser.city;
            retrievedCountry = firstUser.country;
            retrievedLongitude = firstUser.longitude;
            retrievedLatitude = firstUser.latitude;
    
            // Save to localStorage
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
    
            console.log("Data saved in LocalStorage");
        } else {
            // Retrieve from localStorage if `data` is not provided
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
    
        // Update state
        setName(retrievedName);
        setGender(retrievedGender);
        setSexuality(retrievedSexuality);
        setProfileImage(retrievedImage);
        // setUguid(retrievedUguid);
        // setUserDetailsId(retrievedUserDetailsId);
        // setCity(retrievedCity);
        // setCountry(retrievedCountry);
    }, [data]);
    

    console.log("Gender in Home = : ", gender)
    console.log("Sexuality in Home = : ", sexuality)

    useEffect(() => {
        if (gender && sexuality) {
            setIsLoading(true); // Start loading
            fetch(`${API_CONFIG.BASE_URL}/GetAllUsers?gender=${gender}&sexuality=${sexuality}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log("data in Home from Api is  = ", data)
                    const shuffledData = data.sort(() => Math.random() - 0.5);
                    setProfiles(shuffledData); // Update profiles state with shuffled data
                    localStorage.setItem('Profiles', shuffledData);
                    localStorage.setItem('profiles', JSON.stringify(shuffledData));
                    console.log("Profile is saved in LocalStroage")
                })
                .catch(error => console.error('Error fetching user data:', error))
                .finally(() => setIsLoading(false)); // Stop loading
        }
    }, [gender, sexuality]);

    const handleSearchClick = () => {
        navigate('/search', { state: { profiles } });
    };

    const handleShowMore = () => {
        setVisibleProfiles((prev) => prev + 20); // Load 30 more profiles
    };

    return (
        <div>
            <Navbar profileImage={profileImage} name={Name} onSearchClick={handleSearchClick} />
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
