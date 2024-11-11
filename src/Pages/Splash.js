import React, { useState } from 'react';
import SplashVideo from '../Assets/bg_splash.mp4'; // Ensure this path is correct
import HelpyLogo from '../Assets/Helpy-logo.png';
import { FaApple, FaGoogle, FaFacebookF, FaEnvelope } from 'react-icons/fa';
import { FaPhoneFlip } from 'react-icons/fa6';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup, signOut, facebookProvider, signInWithRedirect } from "../firebase/firebase-config";
const SplashScreen = () => {
    const [showSplash, setShowSplash] = useState(false);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const navigate = useNavigate();
    const handleNavigate = () => {
        setShowSplash(true);
    };

    const handleLoginGoogle = async () => {
      
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          
          // Creating the parent object with uid and email
          const userData = {
            uid: user.uid,
            email: user.email,
            logintype: 'Google'
          };
          
          // Navigating to the SignUp page with userData
          navigate('/UserDetail', { state: { userData } });
      
          // Logging the extracted values
          console.log("User Data:", userData);
        } catch (error) {
          console.error("Error during login:", error);
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



    const handleBack = () => {
        setShowSplash(false);
    };

    return (
        <div>
            {!showSplash ? (
                // Initial screen with two buttons
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

                    {/* Overlay container for buttons */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className='mb-36'>
                            <img className="w-[200px] h-auto" src={HelpyLogo} alt="Helpy Logo" />
                        </div>
                        <div className="space-y-2 flex items-center justify-center flex-col">
                            <p className='text-white w-80 text-center text-xs mb-3'>
                                By tapping <span className='font-bold'>Sign in / Create account</span>, you agree to our Terms of Service.
                                Learn how we process your data in our Privacy Policy and Cookies Policy.
                            </p>
                            <Link to="/Register" className='w-64 bg-[#e9677b] text-white py-3 ps-4 pe-3 text-sm rounded-[30px] text-center'>Create Account</Link>
                            <button
                                className="w-64 bg-black text-white py-3 ps-4 pe-3 text-sm rounded-[30px] text-center"
                                onClick={handleNavigate}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // SplashScreen content
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

                    {/* Overlay container for buttons */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className='mb-36'>
                            <img className="w-[200px] h-auto" src={HelpyLogo} alt="Helpy Logo" />
                        </div>
                        <div className="space-y-2 flex items-center justify-center flex-col">
                            <p className='text-white w-80 text-center text-xs mb-3'>
                                By tapping <span className='font-bold'>Sign in / Create account</span>, you agree to our Terms of Service.
                                Learn how we process your data in our Privacy Policy and Cookies Policy.
                            </p>
                            {/* <button className="w-64 bg-black text-white py-3 ps-4 pe-3 text-sm rounded-[30px] flex flex-row gap-3 items-center">
                                <FaApple /> <span>Sign up with Apple</span>
                            </button> */}
                            <button className="w-64 bg-white text-[#e9677b] py-3 ps-4 pe-3 text-sm rounded-[30px] flex flex-row gap-3 items-center" onClick={handleLoginGoogle}>
                                <FaGoogle /> <span>Sign up with Google</span>
                            </button>
                            <button className="w-64 bg-blue-800 text-white py-3 ps-4 pe-3 text-sm rounded-[30px] flex flex-row gap-3 items-center" onClick={handleLoginFacebook}>
                                <FaFacebookF /> <span>Sign up with Facebook</span>
                            </button>
                            <Link to="/Phone" className='w-64 bg-black text-white py-3 ps-4 pe-3 text-sm rounded-[30px] flex flex-row gap-3 items-center'>
                                <FaPhoneFlip /> <span>Sign up with Phone</span>
                            </Link>
                            <Link to="/Login" className="w-64 bg-[#e9677b] text-white py-3 ps-4 pe-3 text-sm rounded-[30px] flex flex-row gap-3 items-center">
                                <FaEnvelope /> <span>Sign up with Email</span>
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
