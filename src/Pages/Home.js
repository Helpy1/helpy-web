import React, { useState, useEffect } from 'react';
import ProfileCard from '../Pages/Components/Cards/ProfileCard';
import Navbar from '../Pages/Navbar';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
    const [profiles, setProfiles] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state?.data;
    const [gender, setGender] = useState('');
    const [Name, setName] = useState('');
    const [DBid, setDBid] = useState('');
    const [sexuality, setSexuality] = useState('');
    const [profileImage, setProfileImage] = useState('');

    useEffect(() => {
        if (data && data.length > 0) {
            const firstUser = data[0].users;
            setName(firstUser.fullName)
            setDBid(data[0].userDetails.id)
            setGender(firstUser.gender);
            setSexuality(firstUser.sexuality);

            const profileImageData = data.find(item => item.image?.name === "profile_image");
            if (profileImageData) {
                setProfileImage(profileImageData.image.imageLink);
            }
        }
    }, [data]);

    console.log("Profile Image Link = ",profileImage)

    useEffect(() => {
        if (gender && sexuality) {
            fetch(`https://usamaanwar-001-site1.atempurl.com/GetAllUsers?gender=${gender}&sexuality=${sexuality}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Data from Api  = ",data)
                    const formattedProfiles = data.map(user => ({
                        id: user.userId,
                        name: user.fullName,
                        age: user.age,
                        location: `${user.city}, ${user.country}`,
                        image: user.imagePaths[0], // Display the first image
                        newMember: user.isActive,
                        online: user.userStatus,
                        bills:user.bills
                    }));
                    setProfiles(formattedProfiles);
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [gender, sexuality]);

    const handleSearchClick = () => {
        navigate('/search', { state: { profiles } });
    };

    return (
        <div>
            <Navbar profileImage={profileImage} name={Name} onSearchClick={handleSearchClick}/>
            <div className="home flex justify-center p-8">
                <div className="profile-cards grid gap-6 w-full max-w-[1200px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {profiles.map(profile => (
                        <ProfileCard key={profile.id} profile={profile} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
