import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaMarsStroke, FaMarsAndVenus, FaPeopleArrows, FaRegCircleXmark } from 'react-icons/fa6';
import darkLogo from '../Assets/HelpyUpdatedLoog.png';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase/firebase-config';
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { useNavigate } from 'react-router-dom';

function UserDetail() {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate
    const { userUID, email, logintype, userData } = location.state || {};
    console.log("Login Type = ", logintype)
    console.log("userUID = ", userUID)
    console.log("Email = ", email)
    console.log("userData in UserDetails= ", userData)
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loadingLocation, setLoadingLocation] = useState(false); // New loading state
    const INITIAL_LOGIN_OBJ = {
        name: '',
        location: '',
        dateOfBirth: '',
        occupation: '',
        description: '',
        intentions: ''
    };

    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
    const [errorMessage, setErrorMessage] = useState('');
    const [showForm, setShowForm] = useState(1);
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
    const [age, setAge] = useState('');
    const [fullName, setFullName] = useState('');
    const [privatePhotos, setPrivatePhotos] = useState([]);
    // For storing image URLs and types
    const [imageUrls, setImageUrls] = useState([]);  // URLs of selected images
    const [imageTypes, setImageTypes] = useState([]); // Types (profile/private) of selected images
    const [languageItems, setLanguageItems] = useState([]); // New state for fetched languages
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
            const sortedLanguages = [...languageSet].sort().map(language => ({
                label: language,
                value: language,
            }));
            setLanguageItems(sortedLanguages);
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    };

    // Fetch user location on component mount
    useEffect(() => {
        const getUserLocation = () => {
            setLoadingLocation(true); // Start loading when fetching begins
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setLatitude(latitude);
                        setLongitude(longitude);
                        fetchCityCountry(latitude, longitude);
                        setLoadingLocation(false); // Stop loading when done
                    },
                    (error) => {
                        window.alert("Location is required to proceed."); // Show alert if location is not set
                        setErrorMessage("Unable to get your location");
                        setLoadingLocation(false); // Stop loading if there's an error
                    }
                );
            } else {
                setErrorMessage("Geolocation is not supported by this browser.");
                setLoadingLocation(false); // Stop loading if geolocation is unavailable
            }
        };

        getUserLocation();
    }, []);

    // Fetch city and country using Google Maps Geocoding API
    const fetchCityCountry = async (latitude, longitude) => {
        const API_KEY = 'AIzaSyDIARYnW2OXbfRa_UC7caDWDakUwuJgJBw'; // Replace with your actual Google Maps API key
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 'OK') {
                const addressComponents = data.results[0].address_components;
                const cityComponent = addressComponents.find(component =>
                    component.types.includes('locality')
                );
                const countryComponent = addressComponents.find(component =>
                    component.types.includes('country')
                );

                setCity(cityComponent ? cityComponent.long_name : '');
                setCountry(countryComponent ? countryComponent.long_name : '');
                console.log(city)
                console.log(country)
            } else {
                setErrorMessage("Error retrieving city and country.");
            }
        } catch (error) {
            setErrorMessage("Error fetching location data.");
            console.error("Error fetching location:", error);
        }
    };

    // Fetch languages on component mount
    useEffect(() => {
        fetchLanguages();
    }, []);

    useEffect(() => {
        const fetchBillsData = async () => {
            try {
                const response = await fetch('https://usamaanwar-001-site1.atempurl.com/api/account/GetAllBills')
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

    // Initial image selection handler to set profile or private tags
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setImageFiles(files); // Ensure files are added to imageFiles
        const urls = files.map((file) => URL.createObjectURL(file)); // Create URLs for preview
        setImageUrls((prevUrls) => [...prevUrls, ...urls].slice(0, 8)); // Limit to 8 images
        setImageTypes((prevTypes) => [...prevTypes, ...Array(files.length).fill('')].slice(0, 8)); // No default tag
    };

    // Toggle image type for marking profile, private, or post images
    const toggleImageType = (index) => {
        setImageTypes((prevImageTypes) => {
            const newImageTypes = [...prevImageTypes];

            if (newImageTypes[index] === '' && !newImageTypes.includes('profile')) {
                // Set as profile if no profile image is selected
                newImageTypes[index] = 'profile';
            } else if (newImageTypes[index] === 'profile') {
                // If profile image is clicked again, keep it as profile (disable further toggling)
                return newImageTypes;
            } else {
                // Toggle between private and post (untagged)
                newImageTypes[index] = newImageTypes[index] === 'private' ? '' : 'private';
            }

            return newImageTypes;
        });
    };



    // Handle image removal
    const handleRemoveImage = (index) => {
        setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
        setImageTypes((prevTypes) => prevTypes.filter((_, i) => i !== index));
    };

    // Firebase upload function
    const uploadImageToFirebase = async (file, imagePath) => {
        return new Promise((resolve, reject) => {
            const imageRef = ref(storage, imagePath);
            const uploadTask = uploadBytesResumable(imageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Update progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress); // Update state with progress percentage
                },
                (error) => {
                    console.error("Firebase upload error:", error);
                    reject(error); // Propagate error if upload fails
                },
                async () => {
                    // On successful upload, get the download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };


    // Submit form and upload images
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (imageFiles.length === 0) {
            setErrorMessage("Please upload at least one image.");
            return;
        }

        const uploadedImagesArray = [];
        let privateImageIndex = 1;
        let postImageIndex = 1;

        try {
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const imageType = imageTypes[i];
                let imageName;

                if (imageType === 'profile') {
                    imageName = 'profile_image';
                } else if (imageType === 'private') {
                    imageName = `private_image_${privateImageIndex}`;
                    privateImageIndex++;
                } else {
                    imageName = `post_image_${postImageIndex}`;
                    postImageIndex++;
                }

                const imagePath = `Images/${userUID}/${imageName}`;
                const imageUrl = await uploadImageToFirebase(file, imagePath);

                uploadedImagesArray.push({ key: imageName, url: imageUrl });
            }

            setUploadedImages(uploadedImagesArray);
            console.log("Uploaded Images:", uploadedImagesArray);
            setShowForm(5);
        } catch (error) {
            console.error("Error uploading images:", error);
            setErrorMessage("Error uploading images. Please try again.");
        }
    };



    // Final submit function to handle the entire form submission
    const submitForm = () => {
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
            uGuid: userUID || userData?.uid,
            age: age || 0,
            birthday: birthday || 'string',
            description: loginObj.description || 'string',
            intentions: loginObj.intentions || 'string',
            email: email || userData?.email,
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

        console.log("Final form data:", formData);

        // Make the POST request
        fetch('https://usamaanwar-001-site1.atempurl.com/api/account/registerthirdpartyuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('API response from POST:', data);

                // Make the GET request with the userUID
                return fetch(`https://usamaanwar-001-site1.atempurl.com/api/account/GetUserDetail?uGuid=${userUID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(response => response.json())
            .then(userData => {
                console.log('API response from GET:', userData);

                // Navigate to /Home with state containing user data
                navigate('/Home', { state: { data: userData } });
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error here
            });
    };


    const handleNextForm = () => {
        if (!city || !country) {
            window.alert("Location is required to proceed.");  // Show error if location is not set
        } else {
            setErrorMessage(""); // Clear error message
            setShowForm((prev) => prev + 1); // Increment to go to the next form
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-[500px]">
                {showForm === 1 && (
                    <div className="py-24 px-10 flex justify-center flex-col items-center">
                        <Link to="/" className="fixed top-4 left-6 inline-block bg-white rounded-[100%] p-3">
                            <FaArrowLeft className='text-[#e9677b]' />
                        </Link>
                        <img className="w-[250px] h-auto mb-5" src={darkLogo} alt="Helpy Logo" />
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleNextForm(); // Move to next form on submit
                        }} className="w-full">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    defaultValue={loginObj.name}
                                    placeholder="Name"
                                    className="w-full border border-gray-300 rounded-[16px] px-4 py-2 text-gray-700"
                                    onChange={(e) => setFullName(e.target.value)}
                                />
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
                                {loadingLocation ? (
                                    <p className="text-gray-500 mt-4">Fetching location...</p>
                                ) : (
                                    <input
                                        type="text"
                                        value={`${city}, ${country}`} // Display city and country
                                        placeholder="Location"
                                        className="w-full border border-gray-300 rounded-[16px] px-4 py-2 text-gray-700 mt-4"
                                        readOnly // Make this read-only if it's automatically populated
                                    />
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
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                    <option value="other">Other</option>
                                </select>

                                <label className="block mb-2 text-[#f86a82] text-center font-semibold">Your Sexuality</label>
                                <div className="flex justify-between mb-4">
                                    {[
                                        { value: 'straight', label: 'Straight', icon: <FaMarsStroke className='text-2xl' /> },
                                        { value: 'gay', label: 'Gay', icon: <FaPeopleArrows className='text-2xl' /> },
                                        { value: 'bisexual', label: 'Bisexual', icon: <FaMarsAndVenus className='text-2xl' /> }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={`w-[30%] flex flex-col justify-center items-center gap-2 px-2 py-6 rounded-[16px] ${sexuality === option.value ? 'bg-[#f86a82] text-white' : 'bg-gray-200'
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
                                    <option value="asian">Asian</option>
                                    <option value="black">Black</option>
                                    <option value="hispanic">Hispanic</option>
                                    <option value="white">White</option>
                                    <option value="other">Other</option>
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
                                <h2 className="text-[#f86a82] font-semibold mb-4 text-center">Select the bills you can help a friend with:</h2>

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
                                            setErrorMessage("Please select at least one bill.");
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

                            {/* File Upload Button */}
                            <div className='flex justify-center'>
                                <button
                                    type="button"
                                    className="btn flex flex-col justify-center items-center bg-[#e9677b] text-white w-fit py-3 px-6 rounded-[30px] mb-4 hover:bg-[#f86a82] transition"
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <span className="text-sm">Tap to Upload Photos</span>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </button>
                            </div>

                            {/* Image Preview Section */}
                            <div className="grid grid-cols-3 gap-4 w-full">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="relative p-2 border rounded-lg">
                                        <img
                                            src={url}
                                            alt={`uploaded-${index}`}
                                            className="w-full rounded-lg object-contain h-[120px]"
                                            onClick={() => toggleImageType(index)} // Assign tag on click
                                        />
                                        {imageTypes[index] && (
                                            <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs text-white ${imageTypes[index] === 'profile' ? 'bg-blue-500' : 'bg-red-500'}`}>
                                                {imageTypes[index] === 'profile' ? 'Profile' : 'Private'}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-500 shadow-md"
                                        >
                                            <FaRegCircleXmark />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="py-3 px-2 mt-2 w-full rounded-[30px] hover:bg-[#f86a82] text-white bg-[#e9677b]"
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

                            {/* Body Type Selector */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#000] font-semibold text-sm">Body Type</label>
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

                            {/* Smoking Status Selector */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#000] font-semibold text-sm">Smoking</label>
                                <div className="flex flex-wrap justify-between gap-2 mb-4">
                                    {['Non-smoker', 'Occasional', 'Regular'].map(status => (
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
                                <label className="block mb-2 text-[#000] font-semibold text-sm">Drinking</label>
                                <div className="flex flex-wrap justify-between gap-2 mb-4">
                                    {['Non-drinker', 'Social drinker', 'Regular drinker'].map(status => (
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
                                    {['Single', 'In a relationship', 'Married', 'Divorced'].map(status => (
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
                                <label className="block mb-2 text-[#000] font-semibold text-sm">Children</label>
                                <div className="flex flex-wrap justify-between gap-2 mb-4">
                                    {['Yes', "No", "Not Preferred"].map(status => (
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


