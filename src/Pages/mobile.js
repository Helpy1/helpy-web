// import React, { useState, useEffect, useRef } from 'react';
// import { Dimensions, View, Text, Button, ScrollView, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Modal, ActivityIndicator } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import DatePicker from 'react-native-date-picker';
// import axios from 'axios'; // Axios to make the API call for reverse geocoding
// import Entypo from 'react-native-vector-icons/Entypo';
// import CustomLoader from './CustomLoader';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CustomAlert from './CustomAlert';
// import Geolocation from 'react-native-geolocation-service';
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';
// import { useNavigation } from '@react-navigation/native';
// import moment from 'moment';
// import languageData from '../../language.json'
// import API_CONFIG from '../../../Api_Config'
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import NotificationSettingsModal from '../Components/Home/NotificationSettingsModal ';
// import { useDataEdited } from '../Context/DataEditedContext';
// import Help from './Help'
// const EditDetailsPopup = ({ route }) => {
//     const { userData, images } = route.params; // Retrieve the passed userData
//     console.log("userData = ", userData)
//     const screenWidth = Dimensions.get('window').width;
//     const [isNotificationModalVisible, setNotificationModalVisible] = useState(false);
//     const { isDataEdited, markDataAsEdited, resetDataEdited } = useDataEdited();
//     const [searchPlaceholder, setSearchPlaceholder] = useState("Search City or Country");
//     const [city, setcity] = useState('');
//     const [suggestions, setSuggestions] = useState([]);
//     const [country, setcountry] = useState('');
//     const [latitude, setLatitude] = useState('');
//     const [longitude, setLongitude] = useState('');
//     const [isModalVisible, setModalVisible] = useState(false);
//     const MAX_IMAGES = 8; // Maximum allowed images
//     //console.log("Received userData:", userData); // Check the data passed in

//     //console.log("Received Images: in Details", images); // Check the data passed in


//     const formatBirthday = (birthday) => {
//         return moment(birthday).format('YYYY-MM-DD');
//     };

//     const openNotificationSettings = () => {
//         setNotificationModalVisible(true);
//     };

//     useEffect(() => {
//         // Initialize user data
//         // Initialize user data from route.params
//         if (userData && userData.length > 0) {
//             const user = userData[0];

//             // Set user personal details
//             setFullName(user.fullName || '');
//             setcity(user.city);
//             setcountry(user.country);
//             setLatitude(user.latitude);
//             setLongitude(user.longitude);
//             setDescription(user.description || '');
//             setOccupation(user.occupation || '');
//             setintentions(user.intentions || '');
//             setBirthday(formatBirthday(user.birthday));
//             setAge(user.age.toString());
//             setSelectedLanguage(user.language || '');
//             setselectedLookingFor(user.lookingFor || '');
//             setGender(user.gender || '');
//             setSelectedEthnicity(user.ethnicity || '');
//             setSexuality(user.sexuality || '');
//             setSelectedBodyType(user.bodyType || '');
//             setSelectedChildren(user.children || '');
//             setSelectedSmoking(user.smoking || '');
//             setSelectedDrinking(user.drinking || '');
//             setSelectedRelationshipStatus(user.relationshipStatus || '');
//             setSelectedEducation(user.education || '');
//             setHeightInInches(user.heightInInches || 54);
//         }



//         // Initialize image URIs with user images from route.params
//         if (images && images.length > 0) {
//             setImageUris(images.map(image => image.url)); // Extract URLs for display

//             // Set profile image if available
//             const profileImage = images.find(image => image.name.includes("Profile_image"));
//             if (profileImage) setSelectedProfileImage(profileImage.url);

//             // Set private photos
//             const privatePhotos = images
//                 .filter(image => image.name.includes("Private"))
//                 .map(image => image.url);
//             setPrivatePhotos(privatePhotos);
//         }

//     }, [userData, images]);


//     const [activeSection, setActiveSection] = useState('details');
//     const [imageUris, setImageUris] = useState([]); // Store up to 5 images
//     // States for new fields
//     const [intentions, setintentions] = useState('')
//     const [fullName, setFullName] = useState('');
//     const [heightRange, setHeightRange] = useState([48, 84]); // Height in inches
//     const [heightInInches, setHeightInInches] = useState(66); // Default height in inches (5 feet 6 inches)
//     const [selectedLanguage, setSelectedLanguage] = useState(null);
//     const [languageItems, setLanguageItems] = useState([]);
//     const [languageModalVisible, setLanguageModalVisible] = useState(false); // To control modal visibility
//     const [searchText, setSearchText] = useState(''); // For filtering languages
//     const [languageSearchText, setLanguageSearchText] = useState('');
//     const [description, setDescription] = useState('');
//     const [lookingFor, setLookingFor] = useState(null);
//     const [occupation, setOccupation] = useState('');
//     const [sexuality, setSexuality] = useState('Straight');
//     const [gender, setGender] = useState(null);
//     const [isLoaderVisible, setIsLoaderVisible] = useState(false);
//     const [isAlertVisible, setAlertVisible] = useState(false);
//     const [alertMessage, setAlertMessage] = useState('');
//     const [alertType, setAlertType] = useState(''); // Can be 'error' or 'success'
//     const [selectedProfileImage, setSelectedProfileImage] = useState(null); // Profile image selection
//     const [age, setAge] = useState('');
//     const [birthday, setBirthday] = useState(null);
//     const [date, setDate] = useState(new Date());
//     const [privatePhotos, setPrivatePhotos] = useState([]); // Array to store URIs of private photos
//     const [showDatePicker, setShowDatePicker] = useState(false);
//     const [hasImageChanges, setHasImageChanges] = useState(false);
//     const [previousPublicImages, setPreviousPublicImages] = useState([]); // To compare with previous state
//     const [previousPrivateImages, setPreviousPrivateImages] = useState([]); // To compare with previous state
//     const [previousSelectedProfileImage, setPreviousSelectedProfileImage] = useState(null); // To compare with previous state
//     // State variables
//     const [imageLinks, setImageLinks] = useState({
//         profileImage: null,
//         publicImages: [],
//         privateImages: [],
//     }); // State to hold all uploaded image links

//     const [initialImageLinks, setInitialImageLinks] = useState({
//         profileImage: null,
//         publicImages: [],
//         privateImages: [],
//     });

//     useEffect(() => {
//         setInitialImageLinks(imageLinks);
//     }, [imageLinks]);


//     const [loading, setLoading] = useState(false); // State to track image upload
//     const [uploadingType, setUploadingType] = useState(null); // State to track which type is uploading ('profile', 'public', 'private')

//     const remainingSlots =
//         MAX_IMAGES -
//         (imageLinks.profileImage ? 1 : 0) -
//         imageLinks.publicImages.length -
//         imageLinks.privateImages.length;




//     const [inputHeight, setInputHeight] = useState(40); // Initial height
//     // Modal visibility states
//     const [selectedBodyType, setSelectedBodyType] = useState('');
//     const [selectedEthnicity, setSelectedEthnicity] = useState('');
//     const [selectedSmoking, setSelectedSmoking] = useState('');
//     const [selectedDrinking, setSelectedDrinking] = useState('');
//     const [selectedRelationshipStatus, setSelectedRelationshipStatus] = useState('');
//     const [selectedEducation, setSelectedEducation] = useState('');
//     const [selectedChildren, setSelectedChildren] = useState('');
//     // Track initial selected image count
//     const [initialSelectedImagesCount, setInitialSelectedImagesCount] = useState(0);
//     const [deletedImages, setDeletedImages] = useState([]); // To track deleted images
//     useEffect(() => {
//         if (userData?.[0]?.imageData && typeof userData[0].imageData === "object") {
//             const privatePhotos = [];
//             const publicPhotos = [];
//             let profileImg = null;

//             Object.keys(userData[0].imageData).forEach((key) => {
//                 const imageUrl = userData[0].imageData[key];
//                 const lowerName = key.toLowerCase();

//                 if (lowerName.includes("private")) {
//                     privatePhotos.push(imageUrl);
//                 } else if (lowerName.includes("profile_image")) {
//                     profileImg = imageUrl;
//                 } else if (lowerName.includes("post")) {
//                     publicPhotos.push(imageUrl);
//                 }
//             });

//             setImageLinks({
//                 profileImage: profileImg,
//                 publicImages: publicPhotos,
//                 privateImages: privatePhotos,
//             });

//         }
//     }, [userData?.[0]?.imageData]);


//     //console.log("publicImages = ", publicImages)
//     //console.log("privateImages = ", privateImages)

//     console.log(" imageLinks =  ", imageLinks)

//     const [selectedLookingFor, setselectedLookingFor] = useState('');
//     const formFields = [
//         { label: 'Education', options: ['High School', 'Bachelor\'s degree', 'Master\'s degree', 'Doctorate'], selected: selectedEducation, setSelected: setSelectedEducation },
//         { label: 'Kids', options: ["Doesn't have Kids", "Have Kids", 'Prefer Not To Reveal'], selected: selectedChildren, setSelected: setSelectedChildren },
//         { label: 'Smoker', options: ['Non-smoker', 'Occasional Smoker', 'Heavy Smoker'], selected: selectedSmoking, setSelected: setSelectedSmoking },
//         { label: 'Drinker', options: ['Non-drinker', 'Social drinker', 'Heavy drinker'], selected: selectedDrinking, setSelected: setSelectedDrinking },
//         { label: 'Relationship Status', options: ['Single', 'In a relationship', 'Married', 'Divorced', 'Situationship'], selected: selectedRelationshipStatus, setSelected: setSelectedRelationshipStatus },
//         { label: 'Physical Appearance', options: ['Slim', 'Athletic', 'Average', 'Heavyset'], selected: selectedBodyType, setSelected: setSelectedBodyType },
//         { label: 'Looking For', options: ['Friendship', 'Casual', 'Long-Term'], selected: selectedLookingFor, setSelected: setselectedLookingFor },
//         {
//             label: 'Ethnicity',
//             options: [
//                 'Black/African Descent',
//                 'East Asian',
//                 'Hispanic/Latino',
//                 'Middle Eastern',
//                 'Native American',
//                 'Pacific Islander',
//                 'South Asian',
//                 'Southeast Asian',
//                 'White/Caucasian',
//                 'Other'
//             ],
//             selected: selectedEthnicity,
//             setSelected: setSelectedEthnicity
//         },
//     ];

//     console.log(selectedSmoking)
//     console.log("SelectedEducation = ", selectedEducation)
//     console.log("selectedLookingFor = ", selectedLookingFor)
//     console.log("selectedChildren = ", selectedChildren)
//     console.log("selectedBodyType = ", selectedBodyType)
//     console.log("selectedEthnicity = ", selectedEthnicity)
//     console.log("selectedDrinking = ", selectedDrinking)
//     console.log("intentions = ", intentions)

//     const fetchPlaces = async (text) => {
//         if (text.length > 2) {
//             try {
//                 const response = await axios.get(
//                     https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${API_CONFIG.YOUR_GOOGLE_API_KEY}
//                 );
//                 console.log('Fetched Suggestions:', response.data.predictions);
//                 setSuggestions(response.data.predictions); // Update the state with fetched suggestions
//             } catch (error) {
//                 console.error('Error fetching places:', error.response || error.message);
//             }
//         }
//     };



//     const fetchPlaceDetails = async (placeId) => {
//         try {
//             const response = await axios.get(
//                 https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_CONFIG.YOUR_GOOGLE_API_KEY}
//             );

//             const result = response.data.result;
//             if (result) {
//                 const location = result.geometry?.location;
//                 if (location) {
//                     setLatitude(location.lat.toString()); // Update latitude
//                     setLongitude(location.lng.toString()); // Update longitude
//                 }

//                 const addressComponents = result.address_components;
//                 const cityComponent = addressComponents.find((c) => c.types.includes('locality'));
//                 const countryComponent = addressComponents.find((c) => c.types.includes('country'));

//                 setcity(cityComponent ? cityComponent.long_name : '');
//                 setcountry(countryComponent ? countryComponent.long_name : '');

//                 console.log('Updated City:', cityComponent?.long_name);
//                 console.log('Updated Country:', countryComponent?.long_name);
//                 console.log('Updated Latitude:', location.lat);
//                 console.log('Updated Longitude:', location.lng);
//             } else {
//                 console.error('No result in API response');
//             }
//         } catch (error) {
//             console.error('Error fetching place details:', error.response || error.message);
//         }
//     };




//     console.log("City  = ", city),
//         console.log("Country  = ", country)
//     console.log("long  = ", longitude),
//         console.log("lat  = ", latitude)

//     const getLocation = async () => {
//         try {
//             setSearchPlaceholder("Getting Your Location...");
//             if (Platform.OS === 'android') {
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                     {
//                         title: 'Location Access Required',
//                         message: 'This app needs to access your location.',
//                     }
//                 );
//                 if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//                     Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
//                     return;
//                 }
//             }

//             Geolocation.getCurrentPosition(
//                 async (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setLatitude(latitude);
//                     setLongitude(longitude);
//                     try {
//                         const response = await axios.get(
//                             https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_CONFIG.YOUR_GOOGLE_API_KEY}
//                         );
//                         const addressComponents = response.data.results[0].address_components;

//                         const cityComponent = addressComponents.find((c) => c.types.includes('locality'));
//                         const countryComponent = addressComponents.find((c) => c.types.includes('country'));

//                         const fetchedCity = cityComponent ? cityComponent.long_name : '';
//                         const fetchedCountry = countryComponent ? countryComponent.long_name : '';

//                         setcity(fetchedCity);
//                         setcountry(fetchedCountry);
//                         setSearchText(${ fetchedCity }, ${ fetchedCountry });
//                     } catch (error) {
//                         console.error('Error fetching location details:', error);
//                     }
//                 },
//                 (error) => {
//                     console.error('Error getting location:', error);
//                     Alert.alert('Location Error', 'Unable to fetch location.');
//                 },
//                 { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//             );
//         } catch (error) {
//             console.warn('Error with location permissions:', error);
//         }
//     };


//     // Close the notification settings modal
//     const closeNotificationSettings = () => {
//         setNotificationModalVisible(false);
//     };

//     const [uID, setUID] = useState('');
//     const [Dbid, setDbid] = useState('');

//     const retrieveUid = async () => {
//         try {
//             const storedUid = await AsyncStorage.getItem('userUid');
//             const storeedDBid = await AsyncStorage.getItem('DbID');
//             if (storedUid !== null || storeedDBid !== null) {
//                 setUID(storedUid);
//                 setDbid(storeedDBid)

//             }
//         } catch (e) {
//             console.error('Failed to retrieve the UID from AsyncStorage', e);
//         }
//     };

//     console.log("Current uID = ", uID)
//     console.log("Current  DbID = ", Dbid)


//     useEffect(() => {
//         const initializeUser = async () => {
//             await retrieveUid(); // Ensure UID is available first
//         };
//         initializeUser();
//     }, []);  // Only run once on component mount


//     const genderItems = [
//         { label: 'Woman', value: 'Woman' },
//         { label: 'Man', value: 'Man' },
//         { label: 'Other', value: 'Other' },
//     ];
//     // Gender options
//     const [items, setItems] = useState([
//         { label: 'Woman', value: 'Woman' },
//         { label: 'Man', value: 'Man' },
//         { label: 'Other', value: 'Other' },
//     ]);


//     useEffect(() => {
//         fetchLanguages();
//     }, []);

//     const renderListItem = (item, setValue, setVisible) => (
//         <TouchableOpacity
//             style={[
//                 styles.languageOption,
//                 selectedLanguage === item.value && { backgroundColor: "#e9677b" }, // Highlight selected
//             ]}
//             onPress={() => {
//                 setValue(item.value); // Update the selected language
//                 setVisible(false); // Close the modal
//             }}
//         >
//             <Text
//                 style={[
//                     styles.languageText,
//                     selectedLanguage === item.value && { color: "white" }, // Change text color for selected
//                 ]}
//             >
//                 {item.label}
//             </Text>
//         </TouchableOpacity>
//     );


//     const fetchLanguages = async () => {
//         try {
//             const languageSet = new Set();
//             languageData.forEach(country => {
//                 if (country.languages) {
//                     Object.values(country.languages).forEach(language => {
//                         languageSet.add(language);
//                     });
//                 }
//             });
//             const sortedLanguages = [...languageSet].sort().map(language => ({
//                 label: language,
//                 value: language,
//             }));
//             setLanguageItems(sortedLanguages);
//             console.log("Fetched languages:", sortedLanguages); // Debugging output
//         } catch (error) {
//             console.error("Error fetching languages:", error);
//         }
//     };

//     const deleteImage = async (imageName, userId) => {
//         const url = ${ API_CONFIG.BASE_URL }/api/DeleteProfileImageInGoogleBucket ? imageName = ${ imageName }& gUid=${ userId };

//         console.log('Delete URL:', url); // Check if the URL is correct

//         try {
//             const response = await fetch(url, {
//                 method: 'DELETE',
//                 headers: {
//                     'accept': '/',
//                     'Authorization': ${ API_CONFIG.AUTHORIZATION_KEY },  // Replace with your actual token
//         },
//     });

//     if (response.ok) {
//         const data = await response.json(); // Assuming the API returns a JSON response
//         console.log('Image folder deleted successfully:', data);
//         return data;
//     } else {
//         console.error('Failed to delete image folder:', response.status);
//         return null;
//     }
// } catch (error) {
//     console.error('Error deleting image folder:', error);
//     return null;
// }
//   };





// // Filter languages based on search text
// const filteredLanguages = languageItems.filter((item) =>
//     item.label.toLowerCase().includes(languageSearchText.toLowerCase())
// );
// // Handle image selection
// const handleSelectImage = async (type) => {
//     if (uploadingType) return; // Prevent multiple uploads at once
//     setUploadingType(type); // Set the uploading type

//     launchImageLibrary(
//         {
//             mediaType: "photo",
//             selectionLimit: 1, // Allow one image selection at a time
//         },
//         async (response) => {
//             if (response.didCancel || response.errorCode) {
//                 setUploadingType(null); // Reset uploading type on cancel/error
//                 return;
//             }

//             const selectedFile = response.assets[0]; // Get the selected file
//             const formData = new FormData();
//             const imageName = generateImageName(type); // Generate the name based on the type

//             formData.append("imageFile", {
//                 uri: selectedFile.uri,
//                 name: imageName,
//                 type: selectedFile.type || "image/jpeg",
//             });

//             try {
//                 const apiResponse = await fetch(
//                     https://webapi.helpyapp.co/api/UploadImageToGoogleBucket?name=${imageName}&gUid=${uID},
//                     {
//                         method: "POST",
//                         headers: {
//                             Accept: "/",
//                             Authorization: "0f910af0-db08-4d2e-8533-f79028b98345", // Replace with your actual token
//                             "Content-Type": "multipart/form-data",
//                         },
//                         body: formData,
//                     }
//                 );

//                 if (apiResponse.ok) {
//                     const result = await apiResponse.json();
//                     const uploadedImageLink = result.imagelink;

//                     // Update the state to show the uploaded image
//                     setImageLinks((prev) => {
//                         if (type === "profile") {
//                             return { ...prev, profileImage: uploadedImageLink };
//                         } else if (type === "public") {
//                             return { ...prev, publicImages: [...prev.publicImages, uploadedImageLink] };
//                         } else if (type === "private") {
//                             return { ...prev, privateImages: [...prev.privateImages, uploadedImageLink] };
//                         }
//                     });

//                     console.log("Image uploaded successfully:", result);
//                 } else {
//                     console.error("Failed to upload image:", apiResponse.status);
//                 }
//             } catch (error) {
//                 console.error("Error uploading image:", error);
//             } finally {
//                 setUploadingType(null); // Reset uploading type
//             }
//         }
//     );
// };

// const generateImageName = (type) => {
//     if (type === "profile") {
//         return "Profile_image";
//     } else if (type === "public") {
//         return Post_${ imageLinks.publicImages.length + 1 };
//     } else if (type === "private") {
//         return Private_Photo_${ imageLinks.privateImages.length + 1 };
//     }
// };


// const handleSelection = (option, setFunction) => {
//     setFunction(option);
// };


// const handleSetProfileImage = (uri) => {
//     setSelectedProfileImage(uri);
// };

// const handleRemoveImage = async (uri, isPublic) => {
//     try {
//         const imageName = uri.split('/').pop(); // Extract image name
//         const userId = uID;

//         console.log('Deleting image for User ID:', userId, 'Image:', imageName);

//         // Delete the image from the server
//         const isDeleted = await deleteImage(imageName, userId);

//         if (!isDeleted) {
//             console.error("Failed to delete image from server");
//             return;
//         }

//         // Update the list of deleted images
//         setDeletedImages((prevDeletedImages) => [...prevDeletedImages, uri]);

//         // Update state based on whether it's a public or private image
//         setImageLinks((prev) => {
//             const updatedPublicImages = isPublic
//                 ? prev.publicImages.filter((imageUri) => imageUri !== uri)
//                 : prev.publicImages;

//             const updatedPrivateImages = !isPublic
//                 ? prev.privateImages.filter((imageUri) => imageUri !== uri)
//                 : prev.privateImages;

//             const updatedProfileImage = prev.profileImage === uri
//                 ? updatedPublicImages[0] || null
//                 : prev.profileImage;

//             return {
//                 ...prev,
//                 publicImages: updatedPublicImages,
//                 privateImages: updatedPrivateImages,
//                 profileImage: updatedProfileImage,
//             };
//         });
//     } catch (error) {
//         console.error("Error during image deletion:", error);
//     }
// };


// // const handleRemoveImage = async (uri, isPublic) => {
// //   const imageName = uri.split('/').pop();
// //   const userId = uID;

// //   console.log('Deleting image for User ID:', userId, 'Image:', imageName);

// //   // Call the delete API to remove the image from the server
// //   const isDeleted = await deleteImage(imageName, userId);

// //   if (!isDeleted) {
// //     console.error("Failed to delete image from server");
// //     return;
// //   }

// //   // Add the image URI to the deletedImages state
// //   setDeletedImages((prevDeletedImages) => [...prevDeletedImages, uri]);

// //   // Update the local state for public or private images
// //   if (isPublic) {
// //     const updatedPublicImages = publicImages.filter((imageUri) => imageUri !== uri);
// //     setPublicImages(updatedPublicImages);

// //     // If the deleted image was the selected profile image, reset it
// //     if (selectedProfileImage === uri) {
// //       setSelectedProfileImage(updatedPublicImages[0] || null);
// //     }
// //   } else {
// //     setPrivateImages(privateImages.filter((imageUri) => imageUri !== uri));
// //   }
// // };

// const navigation = useNavigation();

// const deleteAccount = async (userId) => {
//     try {
//         const response = await fetch(${ API_CONFIG.BASE_URL } / api / DeleteAccount ? userId = ${ userId }, {
//             method: 'POST',
//             headers: {
//                 'Authorization': ${ API_CONFIG.AUTHORIZATION_KEY },
//             'Content-Type': 'application/json',
//         },
// });

// if (response.ok) {
//     const result = await response.json();
//     console.log('Account deleted successfully:', result);

//     await logout(navigation); // Ensure logout happens after account deletion
// } else {
//     const errorDetail = await response.text(); // Log detailed error message
//     console.error(Failed to delete account(Status: ${ response.status }):, errorDetail);
// }
//     } catch (error) {
//     console.error('Error deleting account:', error.message);
// }
//   };


// const handleConfirmDelete = () => {
//     const userId = Dbid; // Replace with the actual userId
//     deleteAccount(userId);

//     setModalVisible(false); // Close modal after confirming
// };

// const logout = async (navigation) => {
//     try {
//         // Retrieve current user's provider data
//         const user = auth().currentUser;
//         if (user) {
//             const providerId = user.providerData[0].providerId;

//             // Handle logout based on provider
//             switch (providerId) {
//                 case 'google.com':
//                     // Google Logout
//                     await GoogleSignin.signOut();
//                     break;

//                 case 'facebook.com':
//                     // Facebook Logout
//                     const currentAccessToken = await AccessToken.getCurrentAccessToken();
//                     if (currentAccessToken) {
//                         LoginManager.logOut();
//                     }
//                     break;

//                 default:
//                     // Firebase logout for email/password or other providers
//                     await auth().signOut();
//                     break;
//             }
//         }

//         // Clear AsyncStorage data
//         await AsyncStorage.clear();

//         // Navigate to the login screen
//         navigation.navigate('Splash')

//         console.log('Logged out successfully.');
//     } catch (error) {
//         console.error('Error during logout:', error);
//     }
// };


// const animationSource =
//     alertType === 'success'
//         ? require('../../Assets/Animations/Animation - 1728995730900.json')
//         : require('../../Assets/Animations/Animation - 1728995823405.json');

// const closeAlert = () => {
//     setAlertVisible(false);
//     if (alertType === 'success') {
//         navigation.navigate('User', { refresh: true }); // Pass refresh parameter
//     }
// };

// const getNewImages = (currentLinks, initialLinks) => {
//     // Helper function to normalize URLs (removes query parameters)
//     const normalizeUrl = (url) => url.split('?')[0];

//     // Find new profile image
//     const newProfileImage =
//         currentLinks.profileImage &&
//             normalizeUrl(currentLinks.profileImage) !== normalizeUrl(initialLinks.profileImage)
//             ? currentLinks.profileImage
//             : null;

//     // Find new public images
//     const newPublicImages = currentLinks.publicImages.filter(
//         (image) =>
//             !initialLinks.publicImages.map(normalizeUrl).includes(normalizeUrl(image))
//     );

//     // Find new private images
//     const newPrivateImages = currentLinks.privateImages.filter(
//         (image) =>
//             !initialLinks.privateImages.map(normalizeUrl).includes(normalizeUrl(image))
//     );

//     return {
//         profileImage: newProfileImage,
//         publicImages: newPublicImages,
//         privateImages: newPrivateImages,
//     };
// };




// // Process and return the image links
// const processImageLinks = (imageLinks) => {
//     // Combine all images into one array, ignoring null or empty values
//     const allImages = [
//         ...(imageLinks.privateImages || []),
//         ...(imageLinks.publicImages || []),
//         ...(imageLinks.profileImage ? [imageLinks.profileImage] : []),
//     ];

//     // Map to the desired format
//     return allImages.map((link) => {
//         // Extract the image name from the URL
//         const imageName = link.split('/').pop(); // Get the last part of the URL
//         return {
//             key: imageName, // Use the image name as the key
//             value: link,    // Original link
//         };
//     });
// };


// // Handle form submission
// const handleSubmit = async () => {
//     // Validate if a profile image is selected
//     try {
//         setIsLoaderVisible(true); // Show loader

//         console.log("imageLinks in Submit =", imageLinks)
//         console.log("initialImageLinks in Submit =", initialImageLinks)
//         // Get only the new images
//         //const newImageLinks = getNewImages(imageLinks, initialImageLinks);

//         // Process only the new images for submission
//         const processedLinks = processImageLinks(imageLinks);
//         console.log('Processed new image links:', processedLinks);

//         if (processedLinks.length === 0) {
//             console.log('No new images to upload');
//             return;
//         }

//         // Prepare form data for submission
//         const formDataToSubmit = {
//             userId: Dbid, // User ID from state
//             images: processedLinks, // Use the uploaded image links
//             city: city || '', // Additional fields like city, country, etc.
//             country: country || '',
//             latitude: latitude || '',
//             longitude: longitude || '',
//             // Add other form data fields if needed
//         };

//         // Additional fields can be added conditionally if they exist
//         if (fullName) formDataToSubmit.fullName = fullName;
//         if (description) formDataToSubmit.description = description;
//         if (intentions) formDataToSubmit.intentions = intentions;
//         if (occupation) formDataToSubmit.occupation = occupation;
//         if (heightInInches) formDataToSubmit.heightInInches = heightInInches;
//         if (selectedLanguage) formDataToSubmit.language = selectedLanguage;
//         if (birthday) formDataToSubmit.birthday = birthday;
//         if (selectedBodyType) formDataToSubmit.bodyType = selectedBodyType;
//         if (selectedLookingFor) formDataToSubmit.lookingFor = selectedLookingFor;
//         if (selectedSmoking) formDataToSubmit.smoking = selectedSmoking;
//         if (selectedEthnicity) formDataToSubmit.ethnicity = selectedEthnicity;
//         if (selectedDrinking) formDataToSubmit.drinking = selectedDrinking;
//         if (selectedRelationshipStatus) formDataToSubmit.relationshipStatus = selectedRelationshipStatus;
//         if (selectedEducation) formDataToSubmit.education = selectedEducation;
//         if (selectedChildren) formDataToSubmit.children = selectedChildren;

//         // Submit the full form data to your API
//         const jsonData = JSON.stringify(formDataToSubmit);
//         console.log('Form data with images:', jsonData); // Log form data for debugging

//         const submitResponse = await fetch(${ API_CONFIG.BASE_URL } / api / account / EditUser, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': ${ API_CONFIG.AUTHORIZATION_KEY },
//         },
//     body: jsonData,
//       });

// if (submitResponse.ok) {
//     const result = await submitResponse.json();
//     console.log('Form submitted successfully:', result);
//     markDataAsEdited();
//     navigation.navigate('User', { refresh: true }); // Navigate or refresh after success
// } else {
//     setAlertMessage('Failed to change your details.');
//     setAlertType('error');
//     setAlertVisible(true);
// }
//     } catch (error) {
//     console.error('Error submitting form:', error);
//     setAlertMessage('An unexpected error occurred. Please try again.');
//     setAlertType('error');
//     setAlertVisible(true);
// } finally {
//     setIsLoaderVisible(false); // Hide loader after submission
// }
//   };

// // Upload images function
// const uploadImages = async () => {
//     try {
//         const formData = new FormData();
//         console.log("Selected Profile Iamge = ", selectedProfileImage)

//         // Add the selected profile image
//         if (selectedProfileImage) {
//             const profileImageUri = selectedProfileImage;
//             console.log("Selected Profile Iamge in Select = ", selectedProfileImage)
//             formData.append('imageFiles', {
//                 uri: profileImageUri,
//                 type: 'image/jpeg', // Adjust based on your image type
//                 name: 'Profile_image', // Explicitly set the profile image name
//             });
//         }

//         // Add public images (excluding the selected profile image)
//         publicImages.forEach((uri, index) => {
//             console.log("Selected Profile Iamge in Public Img = ", selectedProfileImage)
//             if (uri !== selectedProfileImage) {  // Skip the profile image
//                 formData.append('imageFiles', {
//                     uri,
//                     type: 'image/jpeg', // Adjust based on your image type
//                     name: Post_${ index + 1}, // Append as post image
//         });
//     }
//       });

// // Add private images
// privateImages.forEach((uri, index) => {
//     formData.append('imageFiles', {
//         uri,
//         type: 'image/jpeg', // Adjust based on your image type
//         name: Private_Photo_${ index + 1},
//         });
//       });

// console.log('Uploading images with FormData:', formData);

// const response = await axios.post(
//     ${ API_CONFIG.BASE_URL } / api / UploadListOfImagesToGoogleBucket ? gUid = ${ uID },
//     formData,
//     {
//         headers: {
//             Accept: '/',
//             Authorization: ${ API_CONFIG.AUTHORIZATION_KEY },
//     'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

// console.log('Image Upload Response:', response.data);

// // Process and return the image links
// return response.data.map(item => ({
//     key: item.fileName,
//     value: item.imageLink,
// }));
//     } catch (error) {
//     console.error('Image upload failed:', error);
//     throw new Error('Image upload failed');
// }
//   };


// const convertInchesToFeetAndInches = (inches) => {
//     const feet = Math.floor(inches / 12);
//     const remainderInches = inches % 12;
//     return ${ feet } ft ${ remainderInches } in;
// };

// // Calculate age
// const calculateAge = (dob) => {
//     const today = new Date();
//     const birthDate = new Date(dob);
//     let calculatedAge = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();

//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//         calculatedAge--;
//     }

//     return calculatedAge;
// };

// // Handle date change
// const onChangeDate = (selectedDate) => {
//     setShowDatePicker(false);
//     const currentDate = selectedDate || date;
//     setDate(currentDate);

//     // Format date as YYYY-MM-DD
//     const formattedDate = ${ currentDate.getFullYear()
// }-${ String(currentDate.getMonth() + 1).padStart(2, '0') } -${ String(currentDate.getDate()).padStart(2, '0') };
// setBirthday(formattedDate);

// const calculatedAge = calculateAge(currentDate);
// setAge(calculatedAge.toString());
//   };
// // Render dropdown or modal for form fields


// useEffect(() => {
//     // Set the default city and country only when the component loads
//     if (city && country) {
//         setSearchText(${ city }, ${ country });
//     }
// }, [city, country]); // Ensure it updates if city or country changes

// const getUpdatedImageUrl = (urls) => {
//     if (!Array.isArray(urls)) {
//         // Return an empty array if urls is null, undefined, or not an array
//         return [];
//     }
//     return urls.map((url) => ({
//         original: url,
//         updated: ${ url }
//     }));
//   };

// console.log("Images Link = ", imageLinks)

// const updatedPublicImages = getUpdatedImageUrl(imageLinks.publicImages);
// const updatedPrivateImages = getUpdatedImageUrl(imageLinks.privateImages);
// const updatedProfileImage = imageLinks?.profileImage
//     ? ${ imageLinks.profileImage }?t = ${ new Date().getTime()}
//     : null;



// return (
//     <ScrollView style={styles.container}>
//         <View style={styles.header}>
//             <Text style={styles.title}>Edit Your Details</Text>
//             <View style={{ flexDirection: 'row' }}>
//                 <TouchableOpacity style={{ marginTop: 3, padding: 5 }} onPress={() => navigation.navigate('Help')}>
//                     <Entypo name="info-with-circle" size={22} color="#e9677b" />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.NotificationButton} onPress={openNotificationSettings}>
//                     <Ionicons name="notifications" size={22} color="#e9677b" />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.crossButton} onPress={() => navigation.goBack()}>
//                     <MaterialCommunityIcons name="backspace" size={25} color="#e9677b" />
//                 </TouchableOpacity>
//             </View>
//         </View>


//         <DeleteAccountModal
//             visible={isModalVisible}
//             onClose={() => setModalVisible(false)}
//             onConfirm={handleConfirmDelete}
//         />
//         <View style={{ backgroundColor: '#D3D3D3', height: 1 }} />

//         {/* Text labels for switching between sections */}
//         <View style={styles.switchContainer}>
//             <TouchableOpacity
//                 style={[styles.switchText, activeSection === 'details' && styles.activeSwitchText]}
//                 onPress={() => setActiveSection('details')}
//             >
//                 <Text
//                     style={[
//                         styles.switchTextContent,
//                         activeSection === 'details' ? { color: '#fff' } : { color: '#000' },
//                     ]}
//                 >
//                     Edit Details
//                 </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={[styles.switchText, activeSection === 'images' && styles.activeSwitchText]}
//                 onPress={() => setActiveSection('images')}
//             >
//                 <Text
//                     style={[
//                         styles.switchTextContent,
//                         activeSection === 'images' ? { color: '#fff' } : { color: '#000' },
//                     ]}
//                 >
//                     Edit Images
//                 </Text>
//             </TouchableOpacity>
//         </View>

//         <NotificationSettingsModal
//             isVisible={isNotificationModalVisible}
//             onClose={closeNotificationSettings}
//         />


//         {activeSection === 'details' ? (
//             <View style={styles.inputContainer}>
//                 {/* <Text style={styles.sectionHeader2}>Name</Text>
//           <TextInput
//             placeholder="Name"
//             placeholderTextColor={'black'}
//             value={fullName} // Display the current full name
//             onChangeText={setFullName}
//             style={styles.input2}
//           /> */}
//                 <Text style={styles.sectionHeader2}>About me</Text>
//                 <TextInput
//                     placeholder="About me"
//                     placeholderTextColor={'black'}
//                     value={description} // Display the current description
//                     onChangeText={setDescription}
//                     style={styles.input2}
//                     multiline={true} // Enable multiline support
//                 />
//                 <Text style={styles.sectionHeader2}>Occupation</Text>
//                 <TextInput
//                     placeholder="Occupation"
//                     placeholderTextColor={'black'}
//                     value={occupation} // Display the current occupation
//                     onChangeText={setOccupation}
//                     style={styles.input3}
//                     multiline={true} // Enable multiline support
//                 //numberOfLines={4} // Initial number of visible lin

//                 />
//                 <Text style={styles.sectionHeader2}>My Intentions</Text>
//                 <TextInput
//                     placeholder="My Intentions"
//                     placeholderTextColor="black"
//                     value={intentions}
//                     onChangeText={setintentions}
//                     style={styles.input2} // Set minHeight instead of fixed height
//                     multiline={true}
//                 />
//                 <Text style={styles.sectionHeader}>Your Birthday</Text>
//                 {/* New Date Picker for DOB */}
//                 <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
//                     <Text style={birthday ? { color: 'black' } : { color: 'black' }}>
//                         {birthday || 'Birthday (MM-DD-YYYY)'}
//                     </Text>
//                 </TouchableOpacity>

//                 <DatePicker
//                     modal
//                     open={showDatePicker}
//                     date={date}
//                     mode="date"
//                     maximumDate={new Date()}
//                     onConfirm={(date) => onChangeDate(date)}
//                     onCancel={() => setShowDatePicker(false)}
//                 />
//                 <Text style={styles.sectionHeader}>Your Location</Text>
//                 <View style={{ position: 'relative', zIndex: 1000 }}>
//                     <TextInput
//                         placeholder={searchPlaceholder}
//                         placeholderTextColor="grey"
//                         onChangeText={(text) => {
//                             setSearchText(text); // Update the state as the user types
//                             if (text.length > 2) {
//                                 fetchPlaces(text); // Fetch suggestions if the input is long enough
//                             } else {
//                                 setSuggestions([]); // Clear suggestions if input is too short
//                             }
//                         }}
//                         value={searchText} // Always show what's in searchText
//                         style={styles.input9}
//                         onFocus={() => {
//                             // Optional: handle focus events if needed
//                         }}
//                         onBlur={() => {
//                             // Prevent reverting back to default city and country after clearing
//                             if (searchText.trim() === '') {
//                                 setSearchText(''); // Ensure it remains empty when cleared
//                             }
//                         }}
//                     />
//                     {suggestions.length > 0 && (
//                         <ScrollView
//                             style={{
//                                 backgroundColor: '#fff',
//                                 borderWidth: 1,
//                                 borderColor: '#ccc',
//                                 borderRadius: 5,
//                                 maxHeight: 150,
//                                 position: 'absolute',
//                                 top: 50,
//                                 width: '100%',
//                                 zIndex: 1000,
//                             }}
//                             keyboardShouldPersistTaps="handled"
//                         >
//                             {suggestions.map((suggestion, index) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     onPress={() => {
//                                         setSearchText(suggestion.description);
//                                         setSuggestions([]);
//                                         fetchPlaceDetails(suggestion.place_id);
//                                     }}
//                                     style={{
//                                         padding: 10,
//                                         borderBottomWidth: index !== suggestions.length - 1 ? 1 : 0,
//                                         borderBottomColor: '#ccc',
//                                     }}
//                                 >
//                                     <Text style={{ color: 'black' }}>{suggestion.description}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </ScrollView>
//                     )}
//                 </View>





//                 <Text style={styles.sectionHeader}>Height: <Text style={styles.height}>{convertInchesToFeetAndInches(heightInInches)}</Text></Text>
//                 <MultiSlider
//                     values={[heightInInches]} // Pass a single value as an array
//                     onValuesChange={(values) => setHeightInInches(values[0])} // Handle single value change
//                     min={48} // Minimum value (e.g., 4 feet)
//                     max={96} // Maximum value (e.g., 7 feet)
//                     step={1} // Step increment
//                     sliderLength={screenWidth - 48} // Adjust padding if needed
//                     selectedStyle={{ backgroundColor: '#e9677b' }} // Color of the selected portion
//                     unselectedStyle={{ backgroundColor: '#d3d3d3' }} // Color of the unselected portion
//                     markerStyle={{ backgroundColor: '#e9677b' }} // Style for the slider handle/marker
//                 />
//                 {/* Language Selection Button */}
//                 <View style={styles.sectionx}>
//                     <Text style={styles.sectionHeader}>Language</Text>
//                     <TouchableOpacity
//                         style={[styles.languageButton, { backgroundColor: selectedLanguage ? '#e9677b' : '#fff' }]}
//                         onPress={() => setLanguageModalVisible(true)}
//                     >
//                         <Text style={[styles.languageButtonText, { color: selectedLanguage ? '#fff' : '#e9677b' }]}>
//                             {selectedLanguage || "Select a language"}
//                         </Text>
//                     </TouchableOpacity>

//                     {/* Language Selection Modal */}
//                     <Modal
//                         visible={languageModalVisible}
//                         animationType="slide"
//                         transparent={true}
//                         onRequestClose={() => setLanguageModalVisible(false)}
//                     >
//                         <View style={styles.modalContainer}>
//                             <View style={styles.modalContent}>
//                                 <TextInput
//                                     style={styles.searchBar}
//                                     placeholder="Search languages..."
//                                     placeholderTextColor="grey"
//                                     value={languageSearchText}
//                                     onChangeText={setLanguageSearchText}
//                                 />
//                                 <FlatList
//                                     data={filteredLanguages}
//                                     keyExtractor={(item) => item.value}
//                                     renderItem={({ item }) => renderListItem(item, setSelectedLanguage, setLanguageModalVisible)}
//                                     ListEmptyComponent={
//                                         <Text style={{ textAlign: "center", color: "gray" }}>No languages found</Text>
//                                     }
//                                 />
//                                 <TouchableOpacity
//                                     style={styles.closeButton}
//                                     onPress={() => setLanguageModalVisible(false)}
//                                 >
//                                     <Text style={styles.closeButtonText}>Close</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </Modal>


//                 </View>

//                 {formFields.map((item, index) => (
//                     <View key={index} style={{ backgroundColor: 'transparent' }}>
//                         <Text style={styles.sectionHeader}>{item.label}</Text>
//                         <View style={styles.buttonContainer}>
//                             {item.options.map((option) => (
//                                 <TouchableOpacity
//                                     key={option}
//                                     onPress={() => handleSelection(option, item.setSelected)}
//                                     style={[
//                                         styles.optionButton,
//                                         item.selected === option && styles.optionButtonSelected
//                                     ]}
//                                 >
//                                     <Text
//                                         style={[
//                                             {
//                                                 fontSize: 12,
//                                                 color: '#2c3e50',
//                                                 fontWeight: 'bold',
//                                             },
//                                             item.selected === option && { color: 'white' } // Change text color when selected
//                                         ]}
//                                     >
//                                         {option}
//                                     </Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>
//                     </View>
//                 ))}

//                 {/* Submit Button */}
//                 <View style={{ alignItems: 'center', marginTop: 20 }}>
//                     <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//                         <Text style={styles.submitButtonText}>Done</Text>
//                     </TouchableOpacity>
//                 </View>
//                 <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
//                     <Text style={styles.deleteButtonText}>Delete Account</Text>
//                 </TouchableOpacity>

//             </View>
//         ) : (
//             <View style={styles.ctr2}>

//                 {/* Profile Image Section */}
//                 <View style={styles.overAllCont}>
//                     <Text style={styles.sectionHeader}>Profile Image</Text>
//                     <View style={styles.imageList}>
//                         {updatedProfileImage ? (
//                             <View style={styles.thumbnailContainer}>
//                                 <Image source={{ uri: updatedProfileImage }} style={styles.photoThumbnail} />
//                                 <TouchableOpacity
//                                     style={styles.removeButton}
//                                     onPress={() => handleSelectImage("profile")}
//                                 >
//                                     <Entypo name="pencil" size={20} color="#fff" />
//                                 </TouchableOpacity>
//                             </View>
//                         ) : uploadingType === "profile" ? (
//                             <TouchableOpacity
//                                 style={styles.emptySlot}
//                             >
//                                 <ActivityIndicator style={styles.activityIndicator} size="large" color="#e9677b" />
//                             </TouchableOpacity>
//                         ) : (
//                             <TouchableOpacity
//                                 style={styles.emptySlot}
//                                 onPress={() => handleSelectImage("profile")}
//                             >
//                                 <Entypo name="plus" size={30} color="#e9677b" />
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 </View>

//                 {/* Public Images Section */}
//                 <View style={styles.overAllCont}>
//                     <Text style={styles.sectionHeader}>Public Photos</Text>
//                     <View style={styles.imageList}>
//                         {updatedPublicImages.map((imgObj, index) => (
//                             <View key={index} style={styles.thumbnailContainer}>
//                                 <Image source={{ uri: imgObj.updated }} style={styles.photoThumbnail} />
//                                 <TouchableOpacity
//                                     style={styles.removeButton}
//                                     onPress={() => handleRemoveImage(imgObj.original, true)}
//                                 >
//                                     <Entypo name="circle-with-cross" size={20} color="#fff" />
//                                 </TouchableOpacity>
//                             </View>
//                         ))}
//                         {uploadingType === "public" ? (
//                             <TouchableOpacity
//                                 style={styles.emptySlot}
//                             >
//                                 <ActivityIndicator style={styles.activityIndicator} size="large" color="#e9677b" />
//                             </TouchableOpacity>
//                         ) : remainingSlots > 0 ? (
//                             <TouchableOpacity
//                                 style={styles.emptySlot}
//                                 onPress={() => handleSelectImage("public")}
//                             >
//                                 <Entypo name="plus" size={30} color="#e9677b" />
//                             </TouchableOpacity>
//                         ) : null}
//                     </View>
//                 </View>

//                 {/* Private Images Section */}
//                 <View style={styles.overAllCont}>
//                     <Text style={styles.sectionHeader}>Private Photos</Text>
//                     <View style={styles.imageList}>
//                         {updatedPrivateImages.map((imgObj, index) => (
//                             <View key={index} style={styles.thumbnailContainer}>
//                                 <Image source={{ uri: imgObj.updated }} style={styles.photoThumbnail} />
//                                 <TouchableOpacity
//                                     style={styles.removeButton}
//                                     onPress={() => handleRemoveImage(imgObj.original, true)}
//                                 >
//                                     <Entypo name="circle-with-cross" size={20} color="#fff" />
//                                 </TouchableOpacity>
//                             </View>
//                         ))}
//                         {uploadingType === "private" ? (
//                             <TouchableOpacity
//                                 style={styles.emptySlot}
//                             >
//                                 <ActivityIndicator style={styles.activityIndicator} size="large" color="#e9677b" />
//                             </TouchableOpacity>
//                         ) : remainingSlots > 0 ? (
//                             <TouchableOpacity
//                                 style={styles.emptySlot}
//                                 onPress={() => handleSelectImage("private")}
//                             >
//                                 <Entypo name="plus" size={30} color="#e9677b" />
//                             </TouchableOpacity>
//                         ) : null}
//                     </View>
//                 </View>

//                 {/* Submit Button */}
//                 <View style={{ alignItems: 'center', marginTop: 20 }}>
//                     <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//                         <Text style={styles.submitButtonText}>Done</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>


//         )}


//         <CustomAlert
//             isVisible={isAlertVisible}
//             onClose={closeAlert}
//             animationSource={animationSource}
//             message={alertMessage}
//         />
//         <CustomLoader isVisible={isLoaderVisible} />
//     </ScrollView>
// );
// };


// const DeleteAccountModal = ({ visible, onClose, onConfirm }) => {
//     return (
//         <Modal
//             animationType="slide"
//             transparent={true}
//             visible={visible}
//             onRequestClose={onClose}
//         >
//             <View style={styles.modalOverlay}>
//                 <View style={styles.modalContent}>
//                     <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
//                     <View style={styles.buttonContainer}>
//                         <TouchableOpacity style={styles.buttonYes} onPress={onConfirm}>
//                             <Text style={styles.buttonText}>Yes</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.buttonNo} onPress={onClose}>
//                             <Text style={styles.buttonText}>No</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </Modal>
//     );
// };



// export default EditDetailsPopup;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f4f4f4', // Light background color for better readability
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 15,
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#e9677b', // Highlight color for the title
//     },
//     NotificationButton: {
//         borderRadius: 22,
//         padding: 9,

//     },
//     crossButton: {
//         padding: 5,
//     },
//     switchContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//     },
//     sectionHeader: {
//         fontSize: 14,
//         paddingVertical: 4,
//         fontWeight: '600',
//         color: '#e9677b', // Consistent section title color
//     },
//     photoUploadButton: {
//         backgroundColor: '#e9677b',
//         padding: 10,
//         margin: 15,
//         borderRadius: 20,
//         alignItems: 'center'
//     },
//     photoUploadButtonText: {
//         color: 'white',
//         fontSize: 12
//     },
//     sectionHeader2: {
//         fontSize: 14,
//         marginTop: 4,
//         fontWeight: '600',
//         color: '#e9677b', // Consistent section title color
//     },
//     height: {
//         fontSize: 14,
//         marginTop: 10,
//         marginBottom: 10,
//         fontWeight: '600',
//         color: 'black', // Consistent section title color
//     },
//     switchText: {
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         width: '50%',
//         backgroundColor: '#f4f4f4', // Default background color for inactive sections
//         alignItems: 'center',
//     },
//     activeSwitchText: {
//         backgroundColor: '#e9677b', // Active background color
//     },
//     switchTextContent: {
//         fontSize: 14,
//         color: '#000', // Default text color
//     },
//     inputContainer: {
//         marginBottom: 20,
//         padding: 15
//     },
//     input: {
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//         paddingVertical: 8,
//         marginBottom: 15,

//         fontSize: 14,
//         color: '#000', // Darker text for input fields
//     },
//     input2: {
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//         paddingVertical: 8,
//         marginBottom: 5,
//         fontSize: 14,
//         color: '#000', // Darker text for input fields
//     },
//     input3: {
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//         fontSize: 14,
//         color: '#000', // Darker text for input fields
//         height: 40, // Adjust this value to make the input smaller
//         paddingVertical: 5, // Adjust to reduce padding
//         paddingHorizontal: 5, // Optional: adjust for smaller width padding
//     },
//     sexualityContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 10,
//     },
//     sexualityButton: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#F0F0F0',
//         borderRadius: 12,
//         padding: 12,
//         width: 100,
//         height: 100,
//     },
//     selectedButtonStraight: {
//         backgroundColor: '#318CE7',
//     },
//     selectedButtonGay: {
//         backgroundColor: '#e9677b',
//     },
//     selectedButtonBi: {
//         backgroundColor: '#800080',
//     },
//     input9: {
//         borderColor: '#d1d1d1', // Softer border color
//         borderRadius: 10,
//         paddingVertical: 4,
//         paddingHorizontal: 10,
//         width: '100%',
//         fontSize: 12,
//         backgroundColor: '#ecf0f1',
//         color: '#2c3e50', // Darker text for input fields
//     },
//     buttonText: {
//         marginTop: 10,
//         fontSize: 14,
//     },
//     sectionTitle: {
//         fontSize: 16,
//         marginBottom: 10,
//         marginTop: 10,
//         fontWeight: '600',
//         color: '#e9677b', // Consistent section title color
//     },
//     imageContainer: {
//         marginBottom: 20,
//         alignItems: 'center',
//     },
//     profileImage: {
//         width: 200,
//         height: 200,
//         borderRadius: 100, // Circular image
//         marginTop: 12,
//     },
//     removeIcon: {
//         position: 'absolute',
//         top: 10,
//         right: 0,
//         backgroundColor: '#FFF', // White background for icon
//         borderRadius: 15,
//     },
//     submitButton: {
//         backgroundColor: '#e9677b',
//         paddingVertical: 12,
//         paddingHorizontal: 30,
//         borderRadius: 25,
//         alignItems: 'center',
//     },
//     submitButtonText: {
//         fontSize: 16,
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     btn: {
//         backgroundColor: '#318CE7',
//         alignItems: 'center',
//         marginTop: 10,
//         borderRadius: 10,
//         padding: 12,
//         width: '50%',
//     },
//     dropdown: {
//         backgroundColor: '#fafafa',
//         borderWidth: 1,
//         borderColor: '#ccc',
//         paddingVertical: 10,
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//     },
//     optionButton: {
//         width: '48%', // Adjust this width to control button size consistency
//         paddingVertical: 10,
//         paddingHorizontal: 10,
//         backgroundColor: '#ecf0f1',
//         borderRadius: 8,
//         marginVertical: 4,
//         alignItems: 'center',
//     },
//     optionButtonn: {
//         width: '48%', // Make same as optionButton for uniformity
//         paddingVertical: 10,
//         paddingHorizontal: 10,
//         backgroundColor: '#ddd',
//         borderRadius: 8,
//         marginVertical: 4,
//         alignItems: 'center',
//     },
//     optionButtonSelected: {
//         backgroundColor: '#e9677b',
//     },
//     dropdownContainer: {
//         borderColor: '#ccc',
//         zIndex: 9999, // Ensure dropdown stays above other components
//     },
//     placeholderStyle: {
//         color: 'grey',
//         fontSize: 16,
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
//     },
//     modalContent: {
//         backgroundColor: '#fff',
//         padding: 20,
//         width: '80%',
//         borderRadius: 10,
//         maxHeight: '70%', // Limit height for better user experience
//     },
//     searchBar: {
//         height: 40,
//         color: 'black',
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         marginBottom: 10,
//     },
//     languageOption: {
//         paddingVertical: 8,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     languageText: {
//         fontSize: 16,
//         color: 'black',
//     },
//     closeButton: {
//         marginTop: 10,
//         paddingVertical: 10,
//         backgroundColor: '#e9677b',
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     closeButtonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         backgroundColor: '#fff',
//         padding: 20,
//         height: '60%',
//         width: '80%',
//         borderRadius: 10,
//     },
//     searchBar: {
//         height: 40,
//         color: 'black',
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         marginBottom: 10,
//     },
//     languageOption: {
//         paddingVertical: 8,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     languageText: {
//         fontSize: 16,
//         color: 'black',
//     },
//     closeButton: {
//         marginTop: 10,
//         paddingVertical: 10,
//         backgroundColor: '#e9677b',
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     closeButtonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     languageButton: {
//         paddingVertical: 10,
//         paddingHorizontal: 12,
//         backgroundColor: '#ddd',
//         borderRadius: 8,
//         marginTop: 8,
//         marginBottom: 8
//     },
//     languageButtonText: {
//         fontSize: 13,
//         color: 'black',
//     },
//     ctr2: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     photoUploadContainer: {
//         backgroundColor: '#e9677b',
//         paddingVertical: 12,
//         paddingHorizontal: 30,
//         borderRadius: 25,
//         color: 'white',
//         alignItems: 'center',
//         marginTop: 20,
//         marginBottom: 20
//     },
//     photoPlaceholder: {
//         justifyContent: 'center',
//         color: 'white',
//         alignItems: 'center',
//         borderRadius: 8,
//     },
//     photoPlaceholderText: {
//         color: 'white',
//     },
//     imageList: {
//         flexDirection: 'row',
//         flexWrap: 'wrap', // Allows thumbnails to wrap if there are too many
//         justifyContent: 'center',
//     },
//     thumbnailContainer: {
//         position: 'relative',
//         margin: 5,
//     },
//     photoThumbnail: {
//         width: 100,
//         height: 100,
//         borderRadius: 8,
//     },
//     selectedProfileImage: {
//         borderWidth: 2,
//         borderColor: '#00f', // Highlight the selected image with a border
//     },
//     removeButton: {
//         position: 'absolute',
//         top: 5,
//         right: 5,
//         backgroundColor: '#318CE7',
//         borderRadius: 12,
//         padding: 2,
//     },
//     selectedImageContainer: {
//         marginTop: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     largeProfileImage: {
//         width: 300,
//         height: 300,
//         borderRadius: 100, // Circular profile image
//         borderWidth: 2,
//         borderColor: '#318CE7',
//     },
//     labelContainer: {
//         position: 'absolute',
//         top: 5,
//         left: 5,
//         backgroundColor: 'white',
//         paddingVertical: 2,
//         paddingHorizontal: 5,
//         borderRadius: 5,
//     },
//     labelText: {
//         fontSize: 10,
//         color: 'black',
//         fontWeight: 'bold',
//     },
//     imageList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginbottom: 10 },
//     thumbnailContainer: { position: 'relative', margin: 5, marginBottom: 10 },
//     photoThumbnail: { width: 100, height: 100, borderRadius: 10 },
//     removeButton: { position: 'absolute', top: 5, right: 5, backgroundColor: '#000', borderRadius: 10, padding: 2 },
//     emptySlot: {
//         width: 100,
//         height: 100,
//         margin: 5,
//         borderRadius: 10,
//         borderWidth: 2,
//         borderColor: '#ccc',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 10
//     },
//     overAllCont: {
//         backgroundColor: 'white',
//         width: '85%',
//         marginTop: 10,
//         alignItems: 'center',
//         borderRadius: 10
//     },
//     deleteButton: {
//         width: '80%',
//         alignSelf: 'center',
//         padding: 15,
//         borderWidth: 1,          // Add border width
//         borderColor: '#e9677b',   // Border color
//         marginTop: 30,
//         backgroundColor: 'transparent',
//         borderRadius: 20,
//     },
//     deleteButtonText: {
//         color: '#e9677b',
//         fontWeight: 'bold',
//         fontSize: 16,
//         textAlign: 'center'
//     },
//     modalOverlay: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         width: '80%',
//         padding: 20,
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         alignItems: 'center',
//     },
//     modalText: {
//         fontSize: 14,
//         textAlign: 'center',
//         marginBottom: 20,
//         color: 'black'
//     },
//     // buttonContainer: {
//     //   flexDirection: 'row',
//     //   justifyContent: 'space-between',
//     //   width: '100%',
//     // },
//     buttonYes: {
//         backgroundColor: '#e9677b',
//         padding: 10,
//         borderRadius: 5,
//         marginRight: 10,
//         flex: 1,
//         alignItems: 'center',
//     },
//     buttonNo: {
//         backgroundColor: '#ccc',
//         padding: 10,
//         borderRadius: 5,
//         flex: 1,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
// });