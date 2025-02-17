
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdVerified } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";
import { FaHeart, FaRegHeart, FaCamera } from 'react-icons/fa6';
import Navbar from './Navbar';
import API_CONFIG from '../Api_Config'
import { useNavigate } from 'react-router-dom';
import CustomLoader from './Components/CustomLoader';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('Viewed Me');
  const [dbid, setdbid] = useState('')
  const [CurrentData, setCurrentData] = useState([]);
  const [data, setData] = useState([]); // Holds API response data
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const navigate = useNavigate();
  useEffect(() => {
    // Retrieve data from localStorage on component mount
    const savedName = localStorage.getItem('name');
    const savedUID = localStorage.getItem('uid');
    const savedProfileImage = localStorage.getItem('profileImage');
    const savedDBID = localStorage.getItem('dbID');
    const savedGender = localStorage.getItem('gender');
    const savedSexuality = localStorage.getItem('sexuality');
    setdbid(savedDBID)

  }, []);



  // Fetch API calls

  //views me users
  const fetchViewedMeUsers = async (userId) => {
    const url = `${API_CONFIG.BASE_URL}/view/GetViewedUser?userId=${userId}`;

    try {
      console.log("Fetching URL:", url);
      const response = await fetch(url, {
        method: 'POST',  // Keep using POST as in the second function
        headers: {
          'accept': 'text/plain',  // Match the Accept header as in the second function
          'Authorization': `${API_CONFIG.AUTHORIZATION_KEY}`,  // Same authorization key
          'Content-Type': 'application/json',  // Include the Content-Type header as in the second function
        },
      });

      if (response.ok) {
        const text = await response.json();  // Process the response as JSON
        console.log("GetUserViewedList response:", JSON.stringify(text));
        return text ? text : [];  // Return the text or an empty array if no data
      } else {
        console.error(`Error: Server responded with status ${response.status}`);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
      }
    } catch (error) {
      console.error(`Error fetching viewed me users: ${error.message}`);
    }

    return [];  // Return empty array if there's an error or no data
  };


  //people i follow 

  const fetchFollowedUsers = async (userId) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/view/GetFavoriteUsers?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '/',
          Authorization: `${API_CONFIG.AUTHORIZATION_KEY}`,
        },
      });
      if (response.ok) {
        const text = await response.text();
        return text ? JSON.parse(text) : [];
      }
      console.error(`Error: Server responded with status ${response.status}`);
    } catch (error) {
      console.error(`Error fetching followed users: ${error.message}`);
    }
    return [];
  };

  //followed me 
  const fetchFollowedMeUsers = async (userId) => {
    console.log("fetching the followed me users")
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/view/GetUserViewsList?userId=${userId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Accept: '/',
          Authorization: `${API_CONFIG.AUTHORIZATION_KEY}`,

        },

      });
      if (response.ok) {
        const text = await response.text();
        console.log("the text is", text)
        return text ? JSON.parse(text) : [];
      }
      console.error(`Error: Server responded with status ${response.status}`);
    } catch (error) {
      console.error(`Error fetching followed users: ${error.message}`);
    }
    return [];
  }


  // Fetch Data Based on Tab
  const fetchTabData = async (tab, userId) => {
    setIsLoading(true)
    let data = [];
    try {
      if (tab === 'Viewed Me') {
        data = await fetchViewedMeUsers(userId);
        setData(data)
      }
      else if (tab === 'People I Follow') {
        data = await fetchFollowedUsers(userId);
        setData(data)
      }
      else if (tab === 'Followed Me') {
        data = await fetchFollowedMeUsers(userId);
        setData(data)
      }
      console.log("Data in View Follow is = ", data)
      if (data && data.data) {
        // setData(data.data || []); // Safely handle null or undefined data
        console.log("Fetched data without filter:", data.data);
      } else {
        console.error("No data found in the response.");
      }

    } catch (error) {
      console.error(`Error fetching data for tab "${tab}":`, error);
    }
    finally {
      setIsLoading(false)
    }
    return data.data;
  };

  // Fetch data when the active tab or dbid changes
  useEffect(() => {
    const fetchData = async () => {
      if (dbid) {
        console.log(`the db id is ${dbid} and the active tab is ${activeTab}`)
        const result = await fetchTabData(activeTab, dbid);
        console.log("the data from line no 150", result)
        setData(result);
      }
    };
    fetchData();
  }, [activeTab, dbid]);
  console.log("data from line no 96", data)

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleUserClick = (user) => {
    navigate(`/member/${user.userId}`, { state: { profile: user } }); // Pass user data in state
  };


  return (
    <div>
      <Navbar />

      {isLoading ? (
        <CustomLoader isVisible={isLoading} />
      ) : (
        <div className="max-w-[1200px] mx-auto bg-gray-50 px-2 md:px-4 pt-2 pb-4 my-6">
          {/* Tab Navigation */}
          <div className='flex sm:flex-row flex-col justify-between border-b border-gray-300 items-center sm:items-start pb-3 sm:pb-0'>
            <div className="flex space-x-4 text-sm sm:mb-0 mb-2 md:pb-0 border-b sm:border-none border-gray-300 sm:w-fit w-full ">
              <button
                onClick={() => setActiveTab('Viewed Me')}
                className={`pb-3 pt-2 text-[14px] font-semibold mb-[-1px] ${activeTab === 'Viewed Me' ? 'border-b-2 border-[#E9677B] text-[#E9677B]' : 'text-gray-600 border-b-2 border-transparent'
                  }`}
              >
                VIEWED ME
              </button>
              <button
                onClick={() => setActiveTab('People I Follow')}
                className={`pb-3 pt-2 text-[14px] font-semibold mb-[-1px] ${activeTab === 'People I Follow' ? 'border-b-2 border-[#E9677B] text-[#E9677B]' : 'text-gray-600 border-b-2 border-transparent'
                  }`}
              >
                People I Follow
              </button>
              <button
                onClick={() => setActiveTab('Followed Me')}
                className={`pb-3 pt-2 text-[14px] font-semibold mb-[-1px] ${activeTab === 'Followed Me' ? 'border-b-2 border-[#E9677B] text-[#E9677B]' : 'text-gray-600 border-b-2 border-transparent'
                  }`}
              >
                Followed Me
              </button>
            </div>
          </div>

          {/* User Cards */}
          <ul className="flex flex-col">
            {console.log("the data from line no 496", data)}
            {data?.length > 0 ? (
              data.map((user, index) => (
                <li key={index} onClick={() => handleUserClick(user)}>
                  <div className="bg-white sm:p-4 p-2 mt-4 rounded-lg shadow-sm w-full flex flex-row">
                    {/* Profile Image */}
                    <div className="relative w-fit pr-3">
                      <img
                        className="sm:w-[108px] sm:max-h-[144px] max-h-[100px] min-w-[80px] min-h-[100px] sm:min-w-[108px] sm:min-h-[144px] rounded-md object-cover object-center"
                        src={user.imageData.Profile_image || 'https://via.placeholder.com/100'}
                        alt="Profile"
                      />
                    </div>

                    {/* User Details */}
                    <div className="flex flex-row w-full justify-between">
                      {/* Left Section */}
                      <div className="flex flex-col gap-1 sm:w-[50%] w-full max-w-[350px]">
                        <div className="flex flex-row justify-between gap-3">
                          <div className="flex items-center mb-1 gap-2">
                            <h1 className="md:text-[18px] text-[14px] font-medium leading-[18px]">
                              {user.fullName}
                            </h1>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[14px] text-gray-600">{user.city}, {user.country}</span>
                          <div className="flex flex-row gap-2 text-[12px] md:text-[14px]">
                            <div className="mt-2 flex flex-wrap gap-2">
                              {user.bills.split(',').map((bill, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full shadow-sm"
                                >
                                  {bill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col gap-1 sm:w-[50%] w-full max-w-[350px]">
                        <div className="flex flex-row items-center gap-3 text-[14px]">
                          <span className="font-medium">Height</span>
                          <span>{Math.floor(user.heightInInches / 12)}'{user.heightInInches % 12}"</span>
                        </div>
                        <div className="flex flex-row items-center gap-3 text-[14px]">
                          <span className="font-medium">Physical Appearance</span>
                          <span>{user.bodyType}</span>
                        </div>
                        <div className="flex flex-row items-center gap-3 text-[14px]">
                          <span className="font-medium">Sexuality</span>
                          <span>{user.sexuality}</span>
                        </div>
                        <div className="flex flex-row items-center gap-3 text-[14px]">
                          <span className="font-medium">Age</span>
                          <span>{calculateAge(user.birthday)}</span>
                        </div>
                        <div className="flex flex-row items-center gap-3 text-[14px]">
                          <span className="font-medium">Gender</span>
                          <span>{user.gender}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No data available for {activeTab}</p>
            )}
          </ul>


        </div>
      )}


    </div>

  );
};
export default ProfileTabs;
