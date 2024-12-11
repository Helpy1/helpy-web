import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaMarsStroke, FaMarsAndVenus, FaPeopleArrows, FaRegCircleXmark } from 'react-icons/fa6';
import darkLogo from '../Assets/HelpyUpdatedLoog.png';
import axios from 'axios';
import { FaTimes } from "react-icons/fa";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase/firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { useNavigate } from 'react-router-dom';
import CustomAlert from './Components/CustomAlert'
import { FaLocationArrow } from 'react-icons/fa';
import API_CONFIG from '../Api_Config'
import CustomLoader from './Components/CustomLoader'
function UserDetail() {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate
    const { logintype, userData } = location.state || {};
    console.log("Received location.state:", location.state);
    console.log("Login Type = ", logintype)
    console.log("userUID = ", userData)
    console.log("userData = ", userData)
    //console.log("userData in UserDetails= ", userData)
    const [isLoading, setIsLoading] = useState(true); // State for loader
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loadingLocation, setLoadingLocation] = useState(false); // New loading state
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const INITIAL_LOGIN_OBJ = {
        name: '',
        location: '',
        dateOfBirth: '',
        occupation: '',
        description: '',
        email: '',
        intentions: ''
    };

    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
    const [errorMessage, setErrorMessage] = useState('');
    const [showForm, setShowForm] = useState(1);
    const [email, setEmail] = useState(userData.email || ''); // Add this line
    const [gender, setGender] = useState('');
    const [sexuality, setSexuality] = useState('');
    const [ethnicity, setEthnicity] = useState('');
    const [selectedBills, setSelectedBills] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [height, setHeight] = useState(60);
    const [language, setLanguage] = useState('');
    const [bodyType, setBodyType] = useState('');
    const [smoking, setSmoking] = useState('');
    const [drinking, setDrinking] = useState('');
    const [lookingfor, setLookingfor] = useState('');
    const [relationshipStatus, setRelationshipStatus] = useState('');
    const [education, setEducation] = useState('');
    const [children, setChildren] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]); // To store uploaded images with key and uri
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [billsData, setBillsData] = useState([]);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [birthday, setBirthday] = useState('');
    const [publicImages, setPublicImages] = useState([]);
    const [privateImages, setPrivateImages] = useState([]);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [age, setAge] = useState('');
    const [fullName, setFullName] = useState('');
    const [privatePhotos, setPrivatePhotos] = useState([]);
    // For storing image URLs and types
    const [imageUrls, setImageUrls] = useState([]);  // URLs of selected images
    const [imageTypes, setImageTypes] = useState([]); // Types (profile/private) of selected images
    const [languageItems, setLanguageItems] = useState([]); // New state for fetched languages
    const maxTotalImages = 8; // Maximum total images
    const [alertVisible, setAlertVisible] = useState(false);
    // Function to fetch languages from the API
    const fetchLanguages = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const data = await response.json();
            const languageSet = new Set();
            data.forEach(country => {
                if (country.languages) {
                    Object.values(country.languages).forEach(language => {
                        languageSet.add(language);
                    });
                }
            });

            // Convert to an array, sort alphabetically, and move "English" to the top
            const sortedLanguages = [...languageSet].sort((a, b) => {
                if (a === 'English') return -1; // Move "English" to the top
                if (b === 'English') return 1;
                return a.localeCompare(b); // Sort alphabetically for others
            });

            // Map the sorted array to the expected structure
            setLanguageItems(sortedLanguages.map(language => ({ label: language, value: language })));


            // const sortedLanguages = [...languageSet].sort().map(language => ({
            //     label: language,
            //     value: language,
            // }));
            // setLanguageItems(sortedLanguages);
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    };


    const handleSelectImages = (isPublic) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = "image/*";
        input.multiple = true;

        input.onchange = (e) => {
            const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
            const remainingSlots = maxTotalImages - publicImages.length - privateImages.length;

            if (files.length > remainingSlots) {
                setAlertMessage(`You can only add ${remainingSlots} more image(s).`);
                return;
            }

            if (isPublic) {
                const updatedPublicImages = [...publicImages, ...files].slice(0, maxTotalImages - privateImages.length);
                setPublicImages(updatedPublicImages);

                if (!selectedProfileImage && updatedPublicImages.length > 0) {
                    setSelectedProfileImage(updatedPublicImages[0]); // Automatically set the first public image as the profile image
                }
            } else {
                const updatedPrivateImages = [...privateImages, ...files].slice(0, maxTotalImages - publicImages.length);
                setPrivateImages(updatedPrivateImages);
            }
        };

        input.click();
    };


    const handleSetProfileImage = (uri) => {
        setSelectedProfileImage(uri);
    };

    const uploadImageToFirebase = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, `Images/${userData.userUID}/${imageName}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => reject(error),
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };


    const fetchSuggestions = async (input) => {
        if (input.length > 2) {
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_CONFIG.YOUR_GOOGLE_API_KEY}`
                );
                setSuggestions(response.data.predictions);
            } catch (error) {
                console.error('Error fetching place suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleCloseAlert = () => {
        setAlertVisible(false);
        setAlertMessage('');
    };



    const fetchCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsFetchingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);

                try {
                    const response = await axios.get(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_CONFIG.YOUR_GOOGLE_API_KEY}`
                    );

                    const addressComponents = response.data.results[0].address_components;
                    const cityComponent = addressComponents.find((c) => c.types.includes('locality'));
                    const countryComponent = addressComponents.find((c) => c.types.includes('country'));

                    const fetchedCity = cityComponent ? cityComponent.long_name : '';
                    const fetchedCountry = countryComponent ? countryComponent.long_name : '';

                    setCity(fetchedCity);
                    setCountry(fetchedCountry);
                    setSearchText(`${fetchedCity}, ${fetchedCountry}`);
                } catch (error) {
                    console.error('Error fetching location details:', error);
                }

                setIsFetchingLocation(false);
            },
            (error) => {
                console.error('Error fetching location:', error);
                setIsFetchingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleSuggestionClick = async (placeId) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_CONFIG.YOUR_GOOGLE_API_KEY}`
            );

            const location = response.data.result.geometry.location;
            const addressComponents = response.data.result.address_components;

            const cityComponent = addressComponents.find((c) => c.types.includes('locality'));
            const countryComponent = addressComponents.find((c) => c.types.includes('country'));

            setCity(cityComponent ? cityComponent.long_name : '');
            setCountry(countryComponent ? countryComponent.long_name : '');
            setLatitude(location.lat);
            setLongitude(location.lng);
            setSearchText(`${cityComponent ? cityComponent.long_name : ''}, ${countryComponent ? countryComponent.long_name : ''}`);
            setSuggestions([]);
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };


    // Fetch languages on component mount
    useEffect(() => {
        fetchLanguages();
    }, []);

    useEffect(() => {
        const fetchBillsData = async () => {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/api/account/GetAllBills`, {
                    method: 'GET', // Specify the HTTP method
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '/', // Updated to use '*/*' for all content types
                        'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`, // Use your API config key
                    },
                });

                const data = await response.json();
                setBillsData(data.filter(bill => bill.isActive));
            } catch (err) {
                setErrorMessage('');
            }
        };

        fetchBillsData();
    }, []);

    // Handle bill selection for showForm === 3
    const handleBillSelection = (billId) => {
        setSelectedBills((prevSelectedBills) =>
            prevSelectedBills.includes(billId)
                ? prevSelectedBills.filter((id) => id !== billId) // Deselect if already selected
                : [...prevSelectedBills, billId] // Add if not selected
        );
    };

    // Handle image removal
    const handleRemoveImage = (uri, isPublic) => {
        if (isPublic) {
            const updatedPublicImages = publicImages.filter((imageUri) => imageUri !== uri);
            setPublicImages(updatedPublicImages);

            if (selectedProfileImage === uri) {
                setSelectedProfileImage(updatedPublicImages[0] || null); // Reset profile image if removed
            }
        } else {
            setPrivateImages(privateImages.filter((imageUri) => imageUri !== uri));
        }
    };

    // Submit form and upload images
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        // const uploadedImagesArray = [];
        // let privateImageIndex = 1;
        // let postImageIndex = 1;

        // try {
        //     for (let i = 0; i < imageFiles.length; i++) {
        //         const file = imageFiles[i];
        //         const imageType = imageTypes[i];
        //         let imageName;

        //         if (imageType === 'profile') {
        //             imageName = 'profile_image';
        //         } else if (imageType === 'private') {
        //             imageName = `private_image_${privateImageIndex}`;
        //             privateImageIndex++;
        //         } else {
        //             imageName = `post_image_${postImageIndex}`;
        //             postImageIndex++;
        //         }

        //         const imagePath = `Images/${userUID}/${imageName}`;
        //         const imageUrl = await uploadImageToFirebase(file, imagePath);

        //         uploadedImagesArray.push({ key: imageName, url: imageUrl });
        //     }

        //     setUploadedImages(uploadedImagesArray);
        //     console.log("Uploaded Images:", uploadedImagesArray);
        //     setShowForm(5);
        // } catch (error) {
        //     console.error("Error uploading images:", error);
        //     setErrorMessage("Error uploading images. Please try again.");
        // }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        //setIsLoading(true); // Show loader before the process starts

        try {
            // Validate inputs
            if (publicImages.length + privateImages.length === 0) {
                setAlertMessage('Please upload at least one image.');
                setIsLoading(false);
                return;
            }

            if (!selectedProfileImage) {
                setAlertMessage('Please set a profile image.');
                setIsLoading(false);
                return;
            }

            const formData = new FormData();

            // Add public images to formData with custom names
            for (let index = 0; index < publicImages.length; index++) {
                const uri = publicImages[index];
                const name = uri === selectedProfileImage ? 'Profile_image' : `Post_${index + 1}`;

                // Fetch the image as a Blob, and then create a File object
                const imageBlob = await fetch(uri).then(res => res.blob());
                const imageFile = new File([imageBlob], name, { type: 'image/jpeg' });

                formData.append('imageFiles', imageFile);
            }

            // Add private images to formData with custom names
            for (let index = 0; index < privateImages.length; index++) {
                const uri = privateImages[index];

                // Fetch the image as a Blob, and then create a File object
                const imageBlob = await fetch(uri).then(res => res.blob());
                const imageFile = new File([imageBlob], `Private_Photo_${index + 1}`, { type: 'image/jpeg' });

                formData.append('imageFiles', imageFile);
            }

            console.log("form Data = ", formData);

            // Log the FormData content
            console.log("FormData content:");
            formData.forEach((value, key) => {
                if (value instanceof File) {
                    console.log(`Key: ${key}, File Name: ${value.name}, File Type: ${value.type}, File Size: ${value.size} bytes`);
                } else {
                    console.log(`Key: ${key}, Value: ${value}`);
                }
            });

            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/api/UploadListOfImagesToGoogleBucket?gUid=${userData?.userUID}`, // Include gUid in the URL
                formData,
                {
                    headers: {
                        'Accept': '*/*',
                        'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`, // Authorization token if needed
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Updated response handling
            const updatedResponse = response.data.map(item => ({
                key: item.fileName,
                url: item.imageLink,
            }));

            console.log('Updated Response:', updatedResponse);

            setUploadedImages(updatedResponse);
            setShowForm(5);
        } catch (error) {
            if (error.response) {
                // Handle specific error responses
                if (error.response.status === 413) {
                    showAlert('The images are too large. Please reduce their size and try again.');
                } else {
                    console.error('Error uploading images:', error.response.data);
                    showAlert('There was an issue uploading your images. Please try again.');
                }
            } else {
                // Catch other errors (e.g., network errors)
                console.error('Error uploading images:', error.message);
                showAlert('An unexpected error occurred. Please try again.');
            }
        } finally {
            //setIsLoading(false); // Hide loader after the process ends
        }
    };



    // Final submit function to handle the entire form submission
    // const submitForm = async () => {
    //     // Ensure we are using the correct email based on the logintype
    //     const finalEmail = logintype === 'phone' || logintype === 'facebook' ? email : (userData?.email || email);

    //     if (!finalEmail) {
    //         setAlertMessage('Email is required.');
    //         setAlertVisible(true);
    //         return;
    //     }

    //     //const uGuid = userData ? userData.uid : userData.userUID;  // Set uGuid based on condition
    //     //setIsLoading(true); // Show loader before form submission starts
    //     try {
    //         const formData = {
    //             useradditionalData: {
    //                 ageRange: [0, 0],
    //                 bodyType: bodyType || 'string',
    //                 children: children || 'string',
    //                 drinking: drinking || 'string',
    //                 education: education || 'string',
    //                 heightInInches: height || 0,
    //                 language: language || 'string',
    //                 relationshipStatus: relationshipStatus || 'string',
    //                 smoking: smoking || 'string'
    //             },
    //             uGuid: userData.userUID,
    //             age: age || 0,
    //             birthday: birthday || 'string',
    //             description: loginObj.description || 'string',
    //             intentions: loginObj.intentions || 'string',
    //             email: finalEmail, // Use the resolved email here
    //             password: '',
    //             ethnicity: ethnicity || 'string',
    //             fullName: fullName || 'string',
    //             gender: gender || 'string',
    //             occupation: loginObj.occupation || 'string',
    //             selectedItems: selectedBills || [0],
    //             images: uploadedImages,
    //             sexuality: sexuality || 'string',
    //             type: logintype || userData?.logintype,
    //             city: city || 'string',
    //             country: country || 'string',
    //             longitude: String(longitude || ''),
    //             latitude: String(latitude || ''),
    //             lookingFor: lookingfor || 'string'
    //         };

    //         console.log("formData = ",formData)
    //         // Submit form data
    //         const response = await fetch(`${API_CONFIG.BASE_URL}/api/account/registerthirdpartyuser`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
    //             },
    //             body: JSON.stringify(formData),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Form submission failed');
    //         }

    //         const data = await response.json();
    //         console.log('Form submitted successfully:', data);

    //         const response2 = await fetch(
    //             `${API_CONFIG.BASE_URL}/api/account/GetUserDetail?uGuid=${userData.userUID}`,
    //             {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Accept': '/',
    //                     'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
    //                 },
    //             }
    //         );

    //         if (response2.status === 200) {
    //             const userData = await response2.json(); // Parse response data as JSON
    //             navigate('/Home', { state: { data: userData } });
    //         } 

    //     } catch (error) {
    //         console.error('Error submitting form:', error);
    //         setAlertMessage('Error submitting form. Please try again.');
    //     } finally {
    //         setIsLoading(false); // Hide loader after form submission
    //     }
    // };

    const submitForm = async () => {
        // Ensure we are using the correct email based on the login type
        const finalEmail = logintype === 'phone' || logintype === 'facebook' ? email : (userData?.email || email);

        if (!finalEmail) {
            setAlertMessage('Email is required.');
            setAlertVisible(true);
            return;
        }

        try {
            // Prepare form data
            const formData = {
                useradditionalData: {
                    ageRange: [0, 0],
                    bodyType: bodyType || 'string',
                    children: children || 'string',
                    drinking: drinking || 'string',
                    education: education || 'string',
                    heightInInches: height || 0,
                    language: language || 'string',
                    relationshipStatus: relationshipStatus || 'string',
                    smoking: smoking || 'string'
                },
                uGuid: userData?.userUID,
                age: age || 0,
                birthday: birthday || 'string',
                description: loginObj.description || 'string',
                intentions: loginObj.intentions || 'string',
                email: finalEmail,
                password: '',
                ethnicity: ethnicity || 'string',
                fullName: fullName || 'string',
                gender: gender || 'string',
                occupation: loginObj.occupation || 'string',
                selectedItems: selectedBills || [0],
                images: uploadedImages,
                sexuality: sexuality || 'string',
                type: logintype || userData?.logintype,
                city: city || 'string',
                country: country || 'string',
                longitude: String(longitude || ''),
                latitude: String(latitude || ''),
                lookingFor: lookingfor || 'string'
            };

            //console.log("formData = ", formData);

            // Show loading indicator
            setIsLoading(true);



            // Submit the registration form
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/account/registerthirdpartyuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            const registrationData = await response.json();
            console.log('Form submitted successfully:', registrationData);

            // If registration is successful, fetch user data
            const response2 = await fetch(
                `${API_CONFIG.BASE_URL}/api/account/GetUserDetail?uGuid=${userData.userUID}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '/',
                        'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,
                    },
                }
            );

            if (response2.status === 200) {
                const userDetail = await response2.json(); // Parse response data as JSON
                console.log('User details:', userDetail);

                // Navigate to home page with user data
                navigate('/Home', { state: { data: userDetail } });
            } else {
                throw new Error('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setAlertMessage('Error submitting form. Please try again.');
            setAlertVisible(true); // Show error alert
        } finally {
            setIsLoading(false); // Hide loader after form submission
        }
    };


    const showAlert = (message) => {
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const validateEmail = async () => {
        if (!email) {
            showAlert('Email is required.');
            return false;
        }

        try {
            const apiUrl = `${API_CONFIG.BASE_URL}/api/account/ValidateUserByEmail?email=${email}`;
            console.log("Appi URl = ", apiUrl)
            const response = await axios.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${API_CONFIG.AUTHORIZATION_KEY}`,
                },
            });

            if (response.status === 200) {
                showAlert('Email already in use');
                return false;
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log("Email not in use")
                return true; // Email does not exist
            } else {
                showAlert('Failed to validate email. Please try again.');
                return false;
            }
        }
        return false;
    };


    const handleNextForm = async (e) => {
        e.preventDefault();
        console.log("I am here")
        console.log("Full Name = ", fullName)
        console.log("birthday = ", birthday)
        console.log("city = ", city)
        console.log("country = ", country)

        if (!fullName || !birthday || !city || !country) {
            setAlertMessage('Please fill in all required fields');
            setAlertVisible(true);
            return;
        }

        if (logintype === 'phone' || logintype === 'facebook') {
            const isEmailValid = await validateEmail();
            if (!isEmailValid) return false;
        }
        console.log("I am out")
        const birthDate = new Date(birthday);
        const today = new Date();
        const calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            calculatedAge--;
        }

        if (calculatedAge < 18) {
            setAlertMessage('You must be at least 18 years old to use this application.');
            setAlertVisible(true);
            return;
        }

        setAge(calculatedAge);
        if (email) {
            const validateEmail = async () => {
                if (!email) {
                    showAlert('Email is required.');
                    return false;
                }

                try {
                    const apiUrl = `${API_CONFIG.BASE_URL}/api/account/ValidateUserByEmail?email=${email}`;
                    console.log("Appi URl = ", apiUrl)
                    const response = await axios.get(apiUrl, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `${API_CONFIG.AUTHORIZATION_KEY}`,
                        },
                    });

                    if (response.status === 200) {
                        showAlert('Email already in use');
                        return false;
                    }
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        console.log("Email not in use")
                        return true; // Email does not exist
                    } else {
                        showAlert('Failed to validate email. Please try again.');
                        return false;
                    }
                }
                return false;
            };

            validateEmail()
        }
        setShowForm((prev) => prev + 1); // Move to the next form
    };

    const totalImages = publicImages.length + privateImages.length;

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-[500px]">
                <CustomAlert
                    isVisible={alertVisible}
                    onClose={handleCloseAlert}
                    animationSource={require('../Assets/Animations/Animation - 1728995823405.json')}
                    message={alertMessage}
                />
                {showForm === 1 && (
                    <div className="py-24 px-10 flex justify-center flex-col items-center">
                        <Link to="/" className="fixed top-4 left-6 inline-block bg-white rounded-[100%] p-3">
                            <FaArrowLeft className='text-[#e9677b]' />
                        </Link>

                        <img className="w-[250px] h-auto mb-5" src={darkLogo} alt="Helpy Logo" />
                        <form onSubmit={handleNextForm} className="w-full">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    defaultValue={loginObj.name}
                                    placeholder="Name"
                                    className="w-full border border-gray-300 rounded-[16px] px-4 py-2 text-gray-700"
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                {(logintype === 'phone' || logintype === 'facebook') && (
                                    <input
                                        type="email"
                                        defaultValue={loginObj.email}
                                        placeholder="Email"
                                        className="w-full border border-gray-300 rounded-[16px] px-4 py-2 text-gray-700 mt-4"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                )}
                                <input
                                    type="date"
                                    defaultValue={loginObj.dateOfBirth}
                                    className="w-full border border-gray-300 rounded-[16px] px-4 py-2 text-gray-700 mt-4"
                                    onChange={(e) => {
                                        setBirthday(e.target.value);
                                        const birthDate = new Date(e.target.value);
                                        const today = new Date();
                                        setAge(today.getFullYear() - birthDate.getFullYear());
                                    }}
                                />

                                <div className="w-full border border-gray-300 flex items-center border-gray-300 rounded-[16px] mt-4 text-gray-700">
                                    <input
                                        type="text"
                                        className="flex-grow px-3 py-2 bg-transparent outline-none border-0 rounded-s-[16px]"
                                        placeholder="Search City or Country"
                                        value={searchText}
                                        onChange={(e) => {
                                            setSearchText(e.target.value);
                                            fetchSuggestions(e.target.value);
                                        }}
                                    />
                                    <button
                                        className="p-2 bg-[#e9677b] text-white rounded-full flex items-center justify-center ml-2 mr-2"
                                        onClick={fetchCurrentLocation}
                                        disabled={isFetchingLocation}
                                    >
                                        <FaLocationArrow />
                                    </button>
                                </div>

                                {suggestions.length > 0 && (
                                    <ul className="absolute mt-1 bg-white border rounded-lg shadow-lg z-10">
                                        {suggestions.map((suggestion) => (
                                            <li
                                                key={suggestion.place_id}
                                                className="p-2 cursor-pointer hover:bg-gray-200"
                                                onClick={() => handleSuggestionClick(suggestion.place_id)}
                                            >
                                                {suggestion.description}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {city && country && (
                                    <p className="mt-2 text-gray-500">
                                        Selected Location: <strong>{`${city}, ${country}`}</strong>
                                    </p>
                                )}
                            </div>
                            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                            <button
                                type="submit"
                                disabled={!loginObj.location && !city && !country} // Ensure Next is enabled only if location is populated
                                className="mt-2 px-2 py-3 w-full rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b]"
                            >
                                Next
                            </button>
                        </form>
                    </div>
                )}
                {showForm === 2 && (
                    <div className="py-24 px-10 flex justify-center flex-col items-center">
                        <button onClick={() => setShowForm(1)} className="fixed top-4 left-6 inline-block bg-white rounded-[100%] p-3">
                            <FaArrowLeft className='text-[#e9677b]' />
                        </button>
                        <img className="w-[250px] h-auto mb-9" src={darkLogo} alt="Helpy Logo" />
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (!gender || !sexuality || !ethnicity || !lookingfor) {
                                setAlertMessage('Please fill in all required fields');
                                setAlertVisible(true);
                                return;
                            }
                            if (gender && sexuality && ethnicity && lookingfor) {
                                setShowForm(3); // Move to next form if all fields are filled
                            } else {
                                setErrorMessage("Please fill in all required fields.");
                            }
                        }} className="w-full">
                            <div className="mb-4">
                                <select
                                    className="w-full border rounded-[16px] p-2 mb-4"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                </select>

                                <label className="block mb-2 text-[#f86a82] text-center font-semibold">Your Sexuality</label>
                                <div className="flex justify-between mb-4">
                                    {[
                                        { value: 'Straight', label: 'Straight', icon: <FaMarsStroke className='text-2xl' /> },
                                        { value: 'Gay', label: 'Gay', icon: <FaPeopleArrows className='text-2xl' /> },
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={`flex-1 mx-2 flex flex-col justify-center items-center gap-2 px-2 py-6 rounded-[16px] ${sexuality === option.value ? 'bg-[#f86a82] text-white' : 'bg-gray-200'
                                                }`}
                                            onClick={() => setSexuality(option.value)}
                                        >
                                            {option.icon}
                                            <span>{option.label}</span>
                                        </button>
                                    ))}
                                </div>


                                <label className="block mb-2 text-[#f86a82] font-semibold text-center">Your Ethnicity</label>
                                <select
                                    className="w-full border rounded-[16px] p-2 mb-4"
                                    value={ethnicity}
                                    onChange={(e) => setEthnicity(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Ethnicity</option>
                                    {[
                                        { label: 'Black/African Descent', value: 'Black/African Descent' },
                                        { label: 'East Asian', value: 'East Asian' },
                                        { label: 'Hispanic/Latino', value: 'Hispanic/Latino' },
                                        { label: 'Middle Eastern', value: 'Middle Eastern' },
                                        { label: 'Native American', value: 'Native American' },
                                        { label: 'Pacific Islander', value: 'Pacific Islander' },
                                        { label: 'South Asian', value: 'South Asian' },
                                        { label: 'Southeast Asian', value: 'Southeast Asian' },
                                        { label: 'White/Caucasian', value: 'White/Caucasian' },
                                        { label: 'Other', value: 'Other' }
                                    ].map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>


                                <label className="block mb-2 text-[#f86a82] font-semibold text-center">What are you looking for</label>
                                <select
                                    className="w-full border rounded-[16px] p-2 mb-4"
                                    value={lookingfor}
                                    onChange={(e) => setLookingfor(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select what you are looking for</option>
                                    <option value="Friendship">Friendship</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Long-Term">Long-Term</option>
                                </select>
                            </div>
                            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                            <button
                                type="submit"
                                className="btn mt-2 px-2 py-3 w-full rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b]"
                            >
                                Next
                            </button>
                        </form>
                    </div>
                )}

                {showForm === 3 && (
                    <div className="min-h-screen bg-base-200 flex items-center">
                        <div className="card mx-auto w-full max-w-[500px]">
                            <div className="py-24 px-10 flex justify-center flex-col items-center">
                                <button onClick={() => setShowForm(2)} className="fixed top-4 left-6 inline-block bg-white rounded-[100%] p-3">
                                    <FaArrowLeft className='text-[#e9677b]' />
                                </button>
                                <img className="w-[250px] h-auto mb-9" src={darkLogo} alt="Helpy Logo" />
                                <h2 className="text-[#f86a82] font-semibold mb-4 text-center">
                                    {gender === 'Men'
                                        ? 'Select the bills you can help with'
                                        : 'Select the Bills you need help with'}
                                </h2>

                                <div className="grid grid-cols-2 gap-4 mb-6 w-full">
                                    {billsData.map((bill) => (
                                        <button
                                            key={bill.id}
                                            type="button"
                                            onClick={() => handleBillSelection(bill.id)}
                                            className={`flex justify-center items-center py-2 px-4 rounded-[16px] border ${selectedBills.includes(bill.id) ? 'bg-[#e9677b] text-white' : 'bg-gray-100'
                                                } hover:bg-[#f86a82] hover:text-white transition`}
                                        >
                                            {bill.name}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className="px-2 py-3 mt-2 w-full rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b]"
                                    onClick={() => {
                                        if (selectedBills.length === 0) {
                                            setAlertMessage('Please select at least one bill.');
                                            setAlertVisible(true);
                                        } else {
                                            setErrorMessage("");
                                            setShowForm(4); // Move to next form if a bill is selected
                                        }
                                    }}
                                >
                                    Next
                                </button>

                                {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {showForm === 4 && (

                    <div className="py-10 px-10 flex justify-center flex-col items-center">
                        <button onClick={() => setShowForm(3)} className="fixed top-4 left-6 inline-block bg-white rounded-[100%] p-3">
                            <FaArrowLeft className='text-[#e9677b]' />
                        </button>
                        <img className="w-[250px] h-auto mb-5" src={darkLogo} alt="Helpy Logo" />
                        <h2 className="text-[#f86a82] font-semibold mb-6 text-center">Tell us about yourself and upload photos</h2>

                        <form
                            className="w-full"
                            onSubmit={(e) => handleSubmitForm(e)}
                        >
                            {/* Occupation Field */}
                            <div className="w-full mb-4">
                                <label className="block mb-2 text-[#f86a82] font-semibold">Your Occupation</label>
                                <input
                                    type="text"
                                    placeholder="Your Current Occupation"
                                    className="input w-full rounded-[16px] border p-2"
                                    value={loginObj.occupation || ''}
                                    onChange={(e) => setLoginObj({ ...loginObj, occupation: e.target.value })}
                                />
                            </div>

                            {/* Describe Yourself Field */}
                            <div className="w-full mb-4">
                                <label className="block mb-2 text-[#f86a82] font-semibold">Describe Yourself...</label>
                                <textarea
                                    placeholder="Describe Yourself..."
                                    className="input w-full rounded-[16px] border p-2 resize-none h-28"
                                    value={loginObj.description || ''}
                                    onChange={(e) => setLoginObj({ ...loginObj, description: e.target.value })}
                                />
                            </div>

                            {/* Intentions Field */}
                            <div className="w-full mb-4">
                                <label className="block mb-2 text-[#f86a82] font-semibold">Your Intentions</label>
                                <textarea
                                    placeholder="Your Intentions"
                                    className="input w-full rounded-[16px] border p-2 resize-none h-28"
                                    value={loginObj.intentions || ''}
                                    onChange={(e) => setLoginObj({ ...loginObj, intentions: e.target.value })}
                                />
                            </div>

                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                    <div
                                        className="bg-[#e9677b] h-2.5 rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            )}

                            {/* Show Buttons Only When Total Images < 8 */}
                            {totalImages < maxTotalImages && (
                                <div className="flex justify-center gap-4 mb-6">
                                    <button
                                        className="py-3 px-2 mt-2 w-full rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b]"
                                        onClick={() => handleSelectImages(true)}
                                    >
                                        Select Public Images
                                    </button>
                                    <button
                                        className="py-3 px-2 mt-2 w-full rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b]"
                                        onClick={() => handleSelectImages(false)}
                                    >
                                        Select Private Images
                                    </button>
                                </div>
                            )}

                            {alertMessage && <p className="text-red-600 text-center mb-4">{alertMessage}</p>}
                            {totalImages > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-l g font-semibold text-[#e9677b] mb-4">Public Images</h3>
                                    <div className="flex gap-4 overflow-x-auto">
                                        {publicImages.map((uri, index) => (
                                            <div
                                                key={index}
                                                className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300"
                                            >
                                                {/* Image */}
                                                <img
                                                    src={uri}
                                                    alt={`Public ${index}`}
                                                    className="w-full h-full object-cover cursor-pointer"
                                                    onClick={() => handleSetProfileImage(uri)}
                                                    style={{
                                                        border: selectedProfileImage === uri ? '2px solid blue' : 'none',
                                                    }}
                                                />

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => handleRemoveImage(uri, true)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                                                >
                                                    <FaTimes size={12} />
                                                </button>

                                                {/* Profile Image Tag */}
                                                {selectedProfileImage === uri && (
                                                    <div className="absolute top-0 left-0 bg-[#e9677b] text-white text-xs font-semibold px-2 py-1 rounded-tr-md">
                                                        Profile Image
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {totalImages > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-[#e9677b] mb-4">Private Images</h3>
                                    <div className="flex gap-4 overflow-x-auto">
                                        {privateImages.map((uri, index) => (
                                            <div
                                                key={index}
                                                className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300"
                                            >
                                                <img
                                                    src={uri}
                                                    alt={`Private ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    onClick={() => handleRemoveImage(uri, false)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                className="py-3 px-2 mt-2 w-full rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b]"
                                onClick={handleSubmit}
                            >
                                Next
                            </button>


                            {/* Error Message Display */}
                            {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
                        </form>
                    </div>
                )}

                {showForm === 5 && (
                    <div className="py-10 px-4 md:px-10 flex flex-col items-center mt-10">
                        <button onClick={() => setShowForm(4)} className="fixed top-4 left-4 inline-block bg-white rounded-[100%] p-2 md:p-3">
                            <FaArrowLeft className='text-[#e9677b] text-sm md:text-base' />
                        </button>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (height && language && bodyType && smoking && drinking && relationshipStatus && education && children) {
                                submitForm(); // Call submitForm function if all fields are filled
                            } else {
                                setErrorMessage("Please fill out all required fields.");
                            }
                        }} className="w-full">
                            <p className="block mb-4 text-[#f86a82] font-semibold text-sm text-left">User Additional Information</p>

                            {/* Height Selector */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#000] font-semibold text-sm">
                                    Height: {Math.floor(height / 12)} feet {height % 12} inches
                                </label>
                                <Slider
                                    min={48}
                                    max={84}
                                    value={height}
                                    onChange={(value) => setHeight(Math.min(84, Math.max(48, value)))}
                                />
                            </div>

                            {/* Language Selector */}
                            <div className="mb-4">
                                <select
                                    className="w-full border rounded-[16px] p-2 mb-4 text-sm"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select a language</option>
                                    {languageItems.map((lang, index) => (
                                        <option key={index} value={lang.value}>
                                            {lang.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Education Selector */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#000] font-semibold text-sm">Education</label>
                                <div className="flex flex-wrap justify-between gap-2 mb-4">
                                    {['High School', "Bachelor's Degree", "Master's Degree", 'Doctorate'].map(status => (
                                        <button
                                            type="button"
                                            key={status}
                                            onClick={() => setEducation(status)}
                                            className={`w-[48%] p-2 rounded-[16px] text-sm ${education === status ? 'bg-[#e9677b] text-white' : 'bg-gray-200'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Children Selector */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#000] font-semibold text-sm">Kids</label>
                                <div className="flex flex-wrap justify-between gap-2 mb-4">
                                    {["Doesn't have Kids", "Have Kids", "Prefer Not To Reveal"].map(status => (
                                        <button
                                            type="button"
                                            key={status}
                                            onClick={() => setChildren(status)}
                                            className={`w-[48%] p-2 rounded-[16px] text-sm ${children === status ? 'bg-[#e9677b] text-white' : 'bg-gray-200'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Smoking Status Selector */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#000] font-semibold text-sm">Smoker</label>
                                <div className="flex flex-wrap justify-between gap-2 mb-4">
                                    {['Non-smoker', 'Occasional Smoker', 'Heavy Smoker'].map(status => (
                                        <button
                                            type="button"
                                            key={status}
                                            onClick={() => setSmoking(status)}
                                            className={`w-[48%] md:w-[30%] p-2 rounded-[16px] text-sm ${smoking === status ? 'bg-[#e9677b] text-white' : 'bg-gray-200'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Drinking Status Selector */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#000] font-semibold text-sm">Drinker</label>
                                <div className="flex flex-wrap justify-between gap-2 mb-4">
                                    {['Non-drinker', 'Social drinker', 'Heavy Drinker'].map(status => (
                                        <button
                                            type="button"
                                            key={status}
                                            onClick={() => setDrinking(status)}
                                            className={`w-[48%] md:w-[30%] p-2 rounded-[16px] text-sm ${drinking === status ? 'bg-[#e9677b] text-white' : 'bg-gray-200'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Relationship Status Selector */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#000] font-semibold text-sm">Relationship Status</label>
                                <div className="flex flex-wrap justify-between gap-2 mb-4">
                                    {['Single', 'In a relationship', 'Married', 'Divorced', 'Situationship'].map(status => (
                                        <button
                                            type="button"
                                            key={status}
                                            onClick={() => setRelationshipStatus(status)}
                                            className={`w-[48%] p-2 rounded-[16px] text-sm ${relationshipStatus === status ? 'bg-[#e9677b] text-white' : 'bg-gray-200'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Body Type Selector */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#000] font-semibold text-sm">Physical Appearance</label>
                                <div className="flex flex-wrap justify-between gap-2 mb-4">
                                    {['Slim', 'Athletic', 'Average', 'Heavyset'].map(type => (
                                        <button
                                            type="button"
                                            key={type}
                                            onClick={() => setBodyType(type)}
                                            className={`w-[48%] md:w-[23%] p-2 rounded-[16px] text-sm ${bodyType === type ? 'bg-[#e9677b] text-white' : 'bg-gray-200'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>


                            <button
                                type="submit"
                                className="py-3 px-2 mt-2 w-full rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b] text-sm md:text-base"
                            >
                                Submit
                            </button>

                            {/* Error Message Display */}
                            {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}

export default UserDetail;


