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
    const [sexuality, setSexuality] = useState('');
    const [isLoading, setIsLoading] = useState(true); // State for loader
    const [profileImage, setProfileImage] = useState('');

    useEffect(() => {
        let retrievedGender = gender;
        let retrievedSexuality = sexuality;
        let retrievedName = Name;
        let retrievedImage = profileImage;

        // Check and retrieve from `data` or `localStorage`
        if (data && data.length > 0) {
            const firstUser = data[0].users;
            retrievedName = firstUser.fullName;
            retrievedGender = firstUser.gender;
            retrievedSexuality = firstUser.sexuality;

            const profileImageData = data.find(item => item.image?.name === "Profile_image");
            retrievedImage = profileImageData ? profileImageData.image.imageLink : '';

            // Save to localStorage
            localStorage.setItem('name', retrievedName);
            localStorage.setItem('uid', data[0].users.uGuid);
            localStorage.setItem('profileImage', retrievedImage);
            localStorage.setItem('dbID', data[0].users.id);
            localStorage.setItem('gender', retrievedGender);
            localStorage.setItem('sexuality', retrievedSexuality);

            console.log("Data saved in LocalStorage");
        } else {
            // Retrieve from localStorage if `data` is not provided
            retrievedName = localStorage.getItem('name') || '';
            retrievedGender = localStorage.getItem('gender') || '';
            retrievedSexuality = localStorage.getItem('sexuality') || '';
            retrievedImage = localStorage.getItem('profileImage') || '';
        }

        // Update state
        setName(retrievedName);
        setGender(retrievedGender);
        setSexuality(retrievedSexuality);
        setProfileImage(retrievedImage);
    }, [data]);

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
                    const shuffledData = data.sort(() => Math.random() - 0.5);
                    setProfiles(shuffledData); // Update profiles state with shuffled data
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
