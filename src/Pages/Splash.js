import React, { useState } from 'react';
import SplashVideo from '../Assets/bg_splash.mp4'; // Ensure this path is correct
import HelpyLogo from '../Assets/Helpy-logo.png';
import { FaApple, FaGoogle, FaFacebookF, FaEnvelope } from 'react-icons/fa';
import { FaPhoneFlip } from 'react-icons/fa6';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../Api_Config'
import { auth, provider, signInWithPopup, signOut, facebookProvider, signInWithRedirect } from "../firebase/firebase-config";
const SplashScreen = () => {
    const [showSplash, setShowSplash] = useState(false);
    const [isCreateAccount, setIsCreateAccount] = useState(true); // Default to Create Account view
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const navigate = useNavigate();
    // const handleNavigate = () => {
    //     setShowSplash(true);
    // };

    const handleLoginGoogle = async () => {
        let userData = null; // Declare userData outside of try block

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDetails = {
                userUID: user.uid,
                email: user.email,
                logintype: 'google'
            };


            // Log the extracted values
            console.log("User Data:", userDetails);

            // Make the GET request with the user UID
            const uGuid = userDetails.userUID;
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/account/GetUserDetail?uGuid=${uGuid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '/', // Accept any content type
                    'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`, // Use your API config key
                },
            });

            if (response.ok) { // Check if the response status is 200-299
                const userData = await response.json();
                console.log('API response from GET:', userData);

                // Navigate to /Home with state containing fetched user data
                navigate('/Home', { state: { data: userData } });
            } else {
                console.warn('API call failed with status:', response.status);

                // Navigate to /UserDetail with the Google user data
                navigate('/UserDetail', { state: { userData: userDetails } });
            }
        } catch (error) {
            console.error("Error during login:", error);

            // // Navigate to /UserDetail if there's an error during the login process
            // if (userData) {
            //     navigate('/UserDetail', { state: { userInfoGoogle: userData } });
            // } else {
            //     console.log("No user data available to send to UserDetail.");
            // }

            // Optionally, display an error notification here
        }
    };



    const handleLoginFacebook = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const credential = result.credential;
            const accessToken = credential.accessToken;
            setUser(result.user);  // Set user info in state
            console.log("User Info:", result.user);
        } catch (error) {
            console.error("Error during login:", error);
        }
    };



    const handleNavigate = (isCreate) => {
        setIsCreateAccount(isCreate);
        setShowSplash(true);
    };

    const handleBack = () => {
        setShowSplash(false);
    };


    return (
        <div>
            {!showSplash ? (
                // Initial screen with Create Account and Sign In buttons
                <div className="relative h-screen w-screen overflow-hidden">
                    {/* Background video */}
                    <video
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        src={SplashVideo}
                        autoPlay
                        loop
                        muted
                    />
                    {/* Overlay */}
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30"></div>
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className='mb-36'>
                            <img className="w-[200px] h-auto" src={HelpyLogo} alt="Helpy Logo" />
                        </div>
                        <div className="space-y-2 flex items-center justify-center flex-col">
                            <p className='text-white w-80 text-center text-xs mb-3'>
                                By tapping <span className='font-bold'>Sign in / Create account</span>, you agree to our Terms of Service.
                                Learn how we process your data in our Privacy Policy and Cookies Policy.
                            </p>
                            <button
                                className="w-64 bg-[#e9677b] text-white py-3 ps-4 pe-3 text-sm rounded-[30px] text-center"
                                onClick={() => handleNavigate(true)}
                            >
                                Create Account
                            </button>
                            <button
                                className="w-64 bg-black text-white py-3 ps-4 pe-3 text-sm rounded-[30px] text-center"
                                onClick={() => handleNavigate(false)}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Second screen with either Create Account or Sign In view
                <div className="relative h-screen w-screen overflow-hidden">
                    {/* Background video */}
                    <video
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        src={SplashVideo}
                        autoPlay
                        loop
                        muted
                    />
                    {/* Overlay */}
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30"></div>
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className='mb-36'>
                            <img className="w-[200px] h-auto" src={HelpyLogo} alt="Helpy Logo" />
                        </div>
                        <div className="space-y-2 flex items-center justify-center flex-col">
                            <p className='text-white w-80 text-center text-xs mb-3'>
                                By tapping <span className='font-bold'>Sign in / Create account</span>, you agree to our Terms of Service.
                                Learn how we process your data in our Privacy Policy and Cookies Policy.
                            </p>
                            <button
                                className="w-64 bg-white text-[#e9677b] py-3 ps-4 pe-3 text-sm rounded-[30px] flex flex-row gap-3 items-center"
                                onClick={handleLoginGoogle}
                            >
                                <FaGoogle /> <span>{isCreateAccount ? "Sign up" : "Sign in"} with Google</span>
                            </button>
                            <button
                                className="w-64 bg-blue-800 text-white py-3 ps-4 pe-3 text-sm rounded-[30px] flex flex-row gap-3 items-center"
                                onClick={handleLoginFacebook}
                            >
                                <FaFacebookF /> <span>{isCreateAccount ? "Sign up" : "Sign in"} with Facebook</span>
                            </button>
                            <Link to="/Phone" className='w-64 bg-black text-white py-3 ps-4 pe-3 text-sm rounded-[30px] flex flex-row gap-3 items-center'>
                                <FaPhoneFlip /> <span>{isCreateAccount ? "Sign up" : "Sign in"} with Phone</span>
                            </Link>
                            <Link
                                to={isCreateAccount ? "/Register" : "/Login"}
                                className="w-64 bg-[#e9677b] text-white py-3 ps-4 pe-3 text-sm rounded-[30px] flex flex-row gap-3 items-center"
                            >
                                <FaEnvelope /> <span>{isCreateAccount ? "Sign up" : "Sign in"} with Email</span>
                            </Link>

                            <button
                                className="w-64 bg-transparent text-white py-3 ps-4 pe-3 text-sm rounded-[30px] text-center"
                                onClick={handleBack}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default SplashScreen;
