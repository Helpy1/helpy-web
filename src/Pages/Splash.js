import React, { useState } from 'react';
import SplashVideo from '../Assets/bg_splash.mp4'; // Ensure this path is correct
import HelpyLogo from '../Assets/Helpy-logo.png';
import { FaApple, FaGoogle, FaFacebookF, FaEnvelope } from 'react-icons/fa';
import { FaPhoneFlip } from 'react-icons/fa6';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import CustomLoader from './Components/CustomLoader'
import CustonAlert from './Components/CustomAlert'
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../Api_Config'
import { auth, provider, signInWithPopup, signOut, facebookProvider, signInWithRedirect } from "../firebase/firebase-config";
const SplashScreen = () => {
    const [showSplash, setShowSplash] = useState(false);
    const [isCreateAccount, setIsCreateAccount] = useState(true); // Default to Create Account view
    const [isLoading, setIsLoading] = useState(false); // State for loader
    const [user, setUser] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState(''); // Can be 'error' or 'success'
    const [email, setEmail] = useState(null);
    const navigate = useNavigate();
    // const handleNavigate = () => {
    //     setShowSplash(true);
    // };

    // const handleLoginGoogle = async () => {
    //     let userData = null; // Declare userData outside of try block

    //     try {
    //         setIsLoading(true)
    //         const result = await signInWithPopup(auth, provider);
    //         const user = result.user;

    //         const userDetails = {
    //             userUID: user.uid,
    //             email: user.email,
    //             logintype: 'google'
    //         };


    //         // Log the extracted values
    //         console.log("User Data:", userDetails);

    //         // Make the GET request with the user UID
    //         const uGuid = userDetails.userUID;
    //         const response = await fetch(`${API_CONFIG.BASE_URL}/user/GetUserByGUId?uGuid=${uGuid}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': '/', // Accept any content type
    //                 'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`, // Use your API config key
    //             },
    //         });
    //         const apiData = await response.json();
    //         if (response.ok) { // Check if the response status is 200-299
    //             if (apiData.statusCode == 404) {
    //                 //setIsLoaderVisible(false);
    //                 // Wait for 2 seconds to show the message before redirecting
    //                 setTimeout(() => {
    //                     navigate('/UserDetail', { state: { userData: userDetails } });
    //                 }, 2000);

    //                 return;
    //             }
    //             const userData = await response.json();
    //             const userDetails = apiData?.data[0]?.userId
    //             if (userDetails && userDetails?.userId) {
    //                 // Navigate to /Home with state containing fetched user data
    //                 navigate('/Home', { state: { data: userData } });
    //             }
    //         } else {
    //             console.warn('API call failed with status:', response.status);

    //             // Navigate to /UserDetail with the Google user data
    //             navigate('/UserDetail', { state: { userData: userDetails } });
    //         }
    //     } catch (error) {
    //         console.error("Error during login:", error);

    //         // // Navigate to /UserDetail if there's an error during the login process
    //         // if (userData) {
    //         //     navigate('/UserDetail', { state: { userInfoGoogle: userData } });
    //         // } else {
    //         //     console.log("No user data available to send to UserDetail.");
    //         // }

    //         // Optionally, display an error notification here
    //     }
    // };


    const handleCloseAlert = () => {
        setAlertVisible(false);
        setAlertMessage('');
    };


    const handleLoginGoogle = async () => {
        try {
            let userData = null; // Declare userData outside of try block
            setIsLoading(true);

            const googleAccountUser = await signInWithPopup(auth, provider);
            console.log(googleAccountUser, 'googleAccountUser');

            const user = googleAccountUser.user;
            const uGuid = user?.uid;
            console.log("uGuid = ", uGuid);

            const userDetails = {
                userUID: user.uid,
                email: user.email,
                logintype: 'google'
            };

            console.log("userDetails = ", userDetails);


            const apiResponse = await fetch(
                `${API_CONFIG.BASE_URL}/user/GetUserByGUId?uGuid=${uGuid}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '/',
                        Authorization: `${API_CONFIG.AUTHORIZATION_KEY}`,
                    },
                },
            );

            const apiData = await apiResponse.json();
            console.log("apiData = ", apiData)
            if (apiData.statusCode == 404) {
                setIsLoading(false);
                alert(
                    "Don't have an account with this email. Redirecting you to signup...",
                );
                // Wait for 2 seconds to show the message before redirecting
                setTimeout(() => {
                    navigate('/UserDetail', { state: { userData: userDetails } });
                }, 2000);


                return;
            }
            //const userDetails = await storeUserData(apiData?.data[0]?.userId);

            if (userDetails && userDetails?.userUID) {
                setIsLoading(false);
                navigate('/Home', { state: { data: userData } });
            } else if (userDetails?.message === 'User details not found') {
                setIsLoading(false);
                setAlertMessage("Don't have an account with this email. Redirecting you to signup...");
                setAlertType('error');
                setAlertVisible(true);

                // Wait for 2 seconds to show the message before redirecting
                setTimeout(() => {
                    navigate('/UserDetail', { state: { userData: userDetails } });
                }, 2000);
            } else {
                setIsLoading(false);
                setAlertMessage('An error occurred. Please try again.');
                setAlertType('error');
                setAlertVisible(true);
            }
        } catch (error) {
            setIsLoading(false);
            let errorMessage = 'Failed to sign in with Google.';

            // switch (error.code) {
            //     case statusCodes.SIGN_IN_CANCELLED:
            //         errorMessage = 'Sign-in was cancelled';
            //         break;
            //     case statusCodes.IN_PROGRESS:
            //         errorMessage = 'Sign-in is already in progress';
            //         break;
            //     case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            //         errorMessage =
            //             'Google Play Services is not available or needs to be updated';
            //         break;
            //     default:
            //         if (error.message?.includes('Failed to get user information')) {
            //             errorMessage =
            //                 'Unable to get Google account information. Please try again.';
            //         }
            // }

            setAlertMessage(errorMessage);
            setAlertType('error');
            setAlertVisible(true);
            console.error('Google Sign-in Error:', error);
        }
    };

    const handleLoginFacebook = async () => {
        try {
            let userData = null; // Declare userData outside of try block
            setIsLoading(true);
            const result = await signInWithPopup(auth, facebookProvider);
            console.log("result =", result);

            // Get the UID
            const uid = result.user.uid;
            console.log("User UID:", uid);

            // Set user in state
            //setUser(result.user);
            console.log("User Info:", result.user);

            const userDetails = {
                userUID: uid,
                logintype: 'facebook'
            };

            console.log("userDetails = ", userDetails);


            const apiResponse = await fetch(
                `${API_CONFIG.BASE_URL}/user/GetUserByGUId?uGuid=${uid}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '/',
                        Authorization: `${API_CONFIG.AUTHORIZATION_KEY}`,
                    },
                },
            );

            const apiData = await apiResponse.json();
            console.log("apiData = ", apiData)
            if (apiData.statusCode == 404) {
                setIsLoading(false);
                alert(
                    "Don't have an account with this email. Redirecting you to signup...",
                );
                // Wait for 2 seconds to show the message before redirecting
                setTimeout(() => {
                    navigate('/UserDetail', { state: { userData: userDetails } });
                }, 2000);


                return;
            }
            //const userDetails = await storeUserData(apiData?.data[0]?.userId);

            if (userDetails && userDetails?.userUID) {
                setIsLoading(false);
                navigate('/Home', { state: { data: userData } });
            } else if (userDetails?.message === 'User details not found') {
                setIsLoading(false);
                setAlertMessage("Don't have an account with this email. Redirecting you to signup...");
                setAlertType('error');
                setAlertVisible(true);

                // Wait for 2 seconds to show the message before redirecting
                setTimeout(() => {
                    navigate('/UserDetail', { state: { userData: userDetails } });
                }, 2000);
            } else {
                setIsLoading(false);
                setAlertMessage('An error occurred. Please try again.');
                setAlertType('error');
                setAlertVisible(true);
            }
        } catch (error) {
            setIsLoading(false);
            let errorMessage = 'Failed to sign in with Google.';

            // switch (error.code) {
            //     case statusCodes.SIGN_IN_CANCELLED:
            //         errorMessage = 'Sign-in was cancelled';
            //         break;
            //     case statusCodes.IN_PROGRESS:
            //         errorMessage = 'Sign-in is already in progress';
            //         break;
            //     case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            //         errorMessage =
            //             'Google Play Services is not available or needs to be updated';
            //         break;
            //     default:
            //         if (error.message?.includes('Failed to get user information')) {
            //             errorMessage =
            //                 'Unable to get Google account information. Please try again.';
            //         }
            // }

            setAlertMessage(errorMessage);
            setAlertType('error');
            setAlertVisible(true);
            console.error('Google Sign-in Error:', error);
        }
    };




    // const handleLoginFacebook = async () => {
    //     try {
    //         const result = await signInWithPopup(auth, facebookProvider);
    //         console.log("result =", result);

    //         // Get the UID
    //         const uid = result.user.uid;
    //         console.log("User UID:", uid);

    //         // Set user in state
    //         setUser(result.user);
    //         console.log("User Info:", result.user);

    //         const response = await fetch(`${API_CONFIG.BASE_URL}/user/GetUserByGUId?uGuid=${uid}}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': '/', // Accept any content type
    //                 'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`, // Use your API config key
    //             },
    //         });

    //         if (response.ok) { // Check if the response status is 200-299
    //             const userData = await response.json();
    //             console.log('API response from GET:', userData);

    //             // Navigate to /Home with state containing fetched user data
    //             navigate('/Home', { state: { data: userData } });
    //         } else {
    //             console.warn('API call failed with status:', response.status);

    //             // Navigate to /UserDetail with the Google user data
    //             navigate('/UserDetail', { state: { userData: result.user } });
    //         }
    //     } catch (error) {
    //         console.error("Error during login:", error.message);

    //         // Optionally, navigate to /UserDetail if there's an error
    //         navigate('/UserDetail', { state: { error: error.message } });

    //         // Optionally, display an error notification here
    //     }
    // };




    const handleNavigate = (isCreate) => {
        setIsCreateAccount(isCreate);
        setShowSplash(true);
    };

    const handleBack = () => {
        setShowSplash(false);
    };

    const animationSource =
        alertType === 'success'
            ? require('../Assets/Animations/Animation - 1728995730900.json')
            : require('../Assets/Animations/Animation - 1728995823405.json');


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
            <CustomLoader isVisible={isLoading} />
            <CustonAlert
                isVisible={alertVisible}
                onClose={handleCloseAlert}
                animationSource={animationSource}
                message={alertMessage}
            />
        </div>
    );
};
export default SplashScreen;
