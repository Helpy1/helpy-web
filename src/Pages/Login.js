import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase function for login
import { auth } from "../firebase/firebase-config"; // Import Firebase auth object
import darkLogo from '../Assets/HelpyUpdatedLoog.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
function Login() {
    const INITIAL_LOGIN_OBJ = {
        password: '',
        emailId: '',
    };

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [userUID, setuserUID] = useState("")
    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Validate email and password
        if (loginObj.emailId.trim() === '') return setErrorMessage('Email Id is required! (use any value)');
        if (loginObj.password.trim() === '') return setErrorMessage('Password is required! (use any value)');

        try {
            // Log in the user using Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, loginObj.emailId, loginObj.password);
            //console.log("User logged in:", userCredential.user);
            //console.log("User email  in:", userCredential.user.email);
            // Extract user UID and email
            const userUID = userCredential.user.uid;
            const email = userCredential.user.email;

            // Create an object to hold user details
            const userDetails = {
                userUID: userUID,
                email: email,
                logintype: 'email'
            };

            // Make GET request to the external API
            const response = await fetch(`https://usamaanwar-001-site1.atempurl.com/api/account/GetUserDetail?uGuid=${userUID}`);

            if (response.status === 200) {
                const userData = await response.json(); // Parse response data as JSON

                // Navigate to 'Home' with userData if request is successful
                navigate('/Home', { state: { data: userData } });
            } else {
                navigate('/UserDetail', { state: userDetails });
                console.log("Data send ")
                // Handle cases where the response is not 200
                setErrorMessage('Failed to retrieve user details.');
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage('');
        setLoginObj({ ...loginObj, [updateType]: value });
    };

    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
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
                        </div>
                        <button
                            type="submit"
                            className='px-2 py-3 mt-2 w-full rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b]'
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
