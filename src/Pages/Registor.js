import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import Firebase method for creating a user
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase function for login
import { auth } from "../firebase/firebase-config"; // Import the auth object from your Firebase configuration
import darkLogo from '../Assets/HelpyUpdatedLoog.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Api_Config from '../Api_Config';
import CustomAlert from './Components/CustomAlert';
import CustomLoader from './Components/CustomLoader';

function Register() {
    const INITIAL_LOGIN_OBJ = {
        password: '',
        emailId: '',
        confirm: ''
    };

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const navigate = useNavigate();

    const submitForm = async (e) => {
        setLoading(true)
        e.preventDefault();
        setErrorMessage('');

        // Validate form inputs
        if (loginObj.emailId.trim() === '') {
            setAlertMessage('Email Id is required!');
            setAlertVisible(true);
            return;
        }
        if (loginObj.password.trim() === '') {
            setAlertMessage('Password is required!');
            setAlertVisible(true);
            return;
        }
        if (loginObj.confirm.trim() === '') {
            setAlertMessage('Confirm password is required!');
            setAlertVisible(true);
            return;
        }
        if (loginObj.password !== loginObj.confirm) {
            setAlertMessage('Passwords do not match!');
            setAlertVisible(true);
            return;
        }

        try {
            setLoading(true);
            // Register the user with email and password using Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, loginObj.emailId, loginObj.password);
            const { uid } = userCredential.user;

            // Automatically log the user in (not strictly necessary, as Firebase automatically signs them in after creation)
            await signInWithEmailAndPassword(auth, loginObj.emailId, loginObj.password);
            
            // Prepare user data

            const userDetails = {
                userUID: uid,
                email: loginObj.emailId,
                logintype: 'email'
            };

            console.log("UserDetail = ",userDetails)
            
            navigate('/UserDetail', { state: { userData: userDetails } });
            setAlertMessage('User details not found, please update your profile.');

        } catch (error) {
            setAlertMessage(`Registration failed: ${error.message}`);
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage('');
        setLoginObj({ ...loginObj, [updateType]: value });
    };

    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const handleCloseAlert = () => {
        setAlertVisible(false);
        setAlertMessage('');
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <Link to="/" className="absolute top-4 left-6 inline-block bg-white rounded-[100%] p-3">
                <FaArrowLeft className='text-[#e9677b]' />
            </Link>
            <div className="card mx-auto w-full max-w-[500px]">
                <div className="py-24 px-10 flex justify-center flex-col items-center">
                    <img className="w-[250px] h-auto mb-5" src={darkLogo} alt="Helpy Logo" />
                    <form onSubmit={(e) => submitForm(e)} className="w-[100%]">
                        <div className="mb-4">
                            <div className="relative mt-4">
                                <input
                                    type="email"
                                    value={loginObj.emailId}
                                    placeholder="Enter your email"
                                    className="w-full border border-gray-300 rounded-[16px] px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
                                    onChange={(e) => updateFormValue({ updateType: 'emailId', value: e.target.value })}
                                />
                            </div>

                            <div className="relative mt-4">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    value={loginObj.password}
                                    placeholder="Enter your password"
                                    className="w-full border border-gray-300 rounded-[16px] px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
                                    onChange={(e) => updateFormValue({ updateType: 'password', value: e.target.value })}
                                />
                                <span
                                    className="absolute right-3 top-4 cursor-pointer text-[#b3b3b3]"
                                    onClick={handleTogglePasswordVisibility}
                                >
                                    {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>

                            <div className="relative mt-4">
                                <input
                                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                                    value={loginObj.confirm}
                                    placeholder="Confirm your password"
                                    className="w-full border border-gray-300 rounded-[16px] px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
                                    onChange={(e) => updateFormValue({ updateType: 'confirm', value: e.target.value })}
                                />
                                <span
                                    className="absolute right-3 top-4 cursor-pointer text-[#b3b3b3]"
                                    onClick={handleToggleConfirmPasswordVisibility}
                                >
                                    {isConfirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={'py-3 px-2 mt-2 w-full rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b]' + (loading ? ' loading' : '')}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <CustomAlert
                isVisible={alertVisible}
                onClose={handleCloseAlert}
                animationSource={require('../Assets/Animations/Animation - 1728995823405.json')}
                message={alertMessage}
            />
        </div>
    );
}

export default Register;
