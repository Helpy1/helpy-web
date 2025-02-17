import { useState } from 'react';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import darkLogo from '../Assets/HelpyUpdatedLoog.png';
import { FaArrowLeft } from 'react-icons/fa6';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from "../firebase/firebase-config";
import API_CONFIG from '../Api_Config'
import { useNavigate } from 'react-router-dom';
function Phone() {
    const INITIAL_LOGIN_OBJ = {
        phoneNumber: '',
        otp: '',
    };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
    const [expireTime, setExpireTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const [uid, setUid] = useState('');
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: (response) => {
                    console.log("reCAPTCHA verified");
                    startTimer(60);
                },
                'expired-callback': () => {
                    console.warn("reCAPTCHA expired, resetting...");
                    window.recaptchaVerifier.reset();
                    setErrorMessage("Failed to verify reCAPTCHA. Please reload the page and try again.");
                }
            });
        }
    };





    const sendOtp = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (loginObj.phoneNumber.trim() === '') {
            return setErrorMessage('Phone number is required!');
        }

        setLoading(true);

        try {
            // Set up reCAPTCHA
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;

            // Send OTP
            const confirmationResult = await signInWithPhoneNumber(auth, `+${loginObj.phoneNumber}`, appVerifier);
            setVerificationId(confirmationResult.verificationId);
            setIsOtpSent(true);
            startTimer(60)
            console.log("OTP sent successfully");
        } catch (error) {
            console.error("Error during OTP sending:", error);
            setErrorMessage("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async (userID) => {

        // Define userDetails object with basic information
        const userDetails = {
            userUID: userID,
            phoneNumber: loginObj.phoneNumber,
            logintype: 'phone',
        };

        console.log("User Details = ", userDetails)


        try {
            const apiResponse = await fetch(`${API_CONFIG.BASE_URL}/user/GetUserByGUId?uGuid=${userDetails.userUID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '/',
                    'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                },
            });

            const apiData = await apiResponse.json();
            console.log("apiData = ", apiData)
            if (apiData.statusCode == 404) {
                //setIsLoading(false);
                alert(
                    "Don't have an account with this email. Redirecting you to signup...",
                );
                // Wait for 2 seconds to show the message before redirecting
                setTimeout(() => {
                    navigate('/UserDetail', { state: { userData: userDetails } });
                }, 2000);


                return;
            }
            if (userDetails && userDetails?.userUID) {
                const userData = { ...apiData };
                console.log("userData = ", userData)
                console.log(" Get data goint to Home")
                navigate('/Home', { state: { data: userData } });

            } else if (userDetails?.message === 'User details not found') {
                //setIsLoading(false);
                //setAlertMessage("Don't have an account with this email. Redirecting you to signup...");
                //setAlertType('error');
                //setAlertVisible(true);

                // Wait for 2 seconds to show the message before redirecting
                setTimeout(() => {
                    navigate('/UserDetail', { state: { userData: userDetails } });
                }, 2000);
            }
            else {
                console.log("An error occurred. Please try again.")
                // If API call fails, navigate to UserDetail with userDetails
                //console.log("User Details before sending = ", userDetails)
                //navigate('/UserDetail', { state: { logintype: userDetails.logintype, userData: userDetails } });
            }
        } catch (error) {
            console.error("Fetch user data error:", error);

            // If there's an error, default to UserDetail
            //navigate('/UserDetail', { state: { data: userDetails } });
        }
    };




    const verifyOtp = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (loginObj.otp.trim() === '') {
            return setErrorMessage('OTP is required!');
        }

        setLoading(true);

        try {
            // Create credential using the verificationId and OTP
            const credential = PhoneAuthProvider.credential(verificationId, loginObj.otp);

            // Sign in the user
            const result = await signInWithCredential(auth, credential);
            console.log("Phone login successful:", result.user.uid);
            const userID = result.user.uid;
            const expirationTimestamp = result.user.stsTokenManager.expirationTime;
            setExpireTime(expirationTimestamp);

            startTimer(expirationTimestamp); // Start the countdown timer
            setUid(userID);

            // Fetch user data and navigate based on response
            fetchUserData(userID);
        } catch (error) {
            console.error("Error during OTP verification:", error);
            setErrorMessage("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const startTimer = (seconds) => {
        setTimeLeft(seconds);
        if (intervalId) clearInterval(intervalId);

        const id = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(id);
                    setIsOtpSent(false); // Reset OTP input
                    setLoginObj(prev => ({ ...prev, otp: '' })); // Clear OTP input field
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        setIntervalId(id);
    };



    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage('');
        setLoginObj({ ...loginObj, [updateType]: value });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <Link to="/" className="absolute top-4 left-6 inline-block bg-white rounded-[100%] p-3">
                <FaArrowLeft className="text-[#e9677b]"></FaArrowLeft>
            </Link>
            <div className="card mx-auto w-full max-w-[500px]">
                <div className="py-24 px-10 flex justify-center flex-col items-center">
                    <img className="w-[250px] h-auto mb-5" src={darkLogo} alt="Helpy Logo" />
                    <form onSubmit={isOtpSent ? verifyOtp : sendOtp} className="w-[100%] text-center">
                        <div className="mb-4">
                            <div className="relative mt-4 flex justify-center w-full">
                                <div className="w-full max-w-[350px]">
                                    <PhoneInput
                                        country={'us'}
                                        value={loginObj.phoneNumber}
                                        onChange={(phone) => updateFormValue({ updateType: 'phoneNumber', value: phone })}
                                        containerClass="w-full"
                                        inputClass="w-full rounded-[16px]"
                                        placeholder="Enter your mobile number"
                                        disabled={isOtpSent}
                                    />
                                    <div id="recaptcha-container"></div>
                                </div>
                            </div>
                        </div>
                        {isOtpSent && (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    className="w-full max-w-[350px] p-2 border rounded-[16px] text-center"
                                    placeholder="Enter OTP"
                                    value={loginObj.otp}
                                    maxLength={6}
                                    disabled={timeLeft === 0} // Disable when timer reaches 0
                                    onChange={(e) => updateFormValue({ updateType: 'otp', value: e.target.value })}
                                />

                            </div>
                        )}

                        {/* 🕒 Show Timer When OTP is Sent */}
                        {isOtpSent && timeLeft > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                                Enter OTP within: <b>{timeLeft} seconds</b>
                            </p>
                        )}

                        {/* ❌ Show "OTP Expired" message when timer reaches 0 */}
                        {isOtpSent && timeLeft === 0 && (
                            <p className="text-red-500 mt-2">OTP expired. Please request a new code.</p>
                        )}

                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        <button
                            type="submit"
                            className={
                                'px-2 py-3 mt-2 w-[150px] rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b]' +
                                (loading || (isOtpSent && timeLeft > 0 && !loginObj.otp.trim()) ? ' opacity-50 cursor-not-allowed' : '')
                            }
                            disabled={loading || (isOtpSent && timeLeft > 0 && !loginObj.otp.trim())} // Disable when loading, timer is running, or OTP is empty
                        >
                            {isOtpSent ? (timeLeft === 0 ? 'Request Code Again' : 'Verify OTP') : 'Send OTP'}
                        </button>



                    </form>
                    <div id="recaptcha-container"></div> {/* Required for Firebase reCAPTCHA */}
                </div>
            </div>
        </div>
    );
}

export default Phone;
