import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import navlogo from '../Assets/logo-white.png';
import { FaSistrix, FaHeart, FaMessage } from 'react-icons/fa6';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { auth, signOut } from "../firebase/firebase-config";
import { useNavigate } from 'react-router-dom';

const Navbar = ({onSearchClick }) => {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // Retrieve data from localStorage on component mount
    const savedName = localStorage.getItem('name');
    const savedUID = localStorage.getItem('uid');
    const savedProfileImage = localStorage.getItem('profileImage');
    const savedDBID = localStorage.getItem('dbID');
    const savedGender = localStorage.getItem('gender');
    const savedSexuality = localStorage.getItem('sexuality');

    // Log data to console
    //console.log("Retrieved Data from LocalStorage:");
    //console.log("Name:", savedName);
    //console.log("UID:", savedUID);
    //console.log("Profile Image:", savedProfileImage);
    //console.log("DB ID:", savedDBID);
    console.log("Gender:", savedGender);
    console.log("Sexuality:", savedSexuality);

    setName(savedName);
    setProfileImage(savedProfileImage);
}, []);
  
  console.log(profileImage)
  console.log(name)
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate('/'); // Replace '/splash' with your actual splash screen route
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/Home" className="flex items-center ">
            <img src={navlogo} className="h-auto w-32" alt="Flowbite Logo" />
            {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Helpy</span> */}
          </Link>
          <div className="items-center justify-between  w-full md:flex md:w-auto " id="navbar-language">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <div
                onClick={onSearchClick}
                  className="flex flex-col gap-2 items-center justify-center py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent text-center md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  <FaSistrix />
                  <span>Search</span>
                </div>
              </li>
              <li>
                <Link
                  to="/Interest"
                  className="flex flex-col gap-2 items-center justify-center py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent text-center md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  <FaHeart />
                  <span>Interests</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="flex flex-col gap-2 items-center justify-center py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent text-center md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  <FaMessage />
                  <span>Messages</span>
                </Link>
              </li>
            </ul>

          </div>
          <div className="flex items-center  relative">
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <MenuButton className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <img
                      src={profileImage} // Replace this with the actual path to the avatar image.
                      alt="Profile"
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span className="text-gray-900">{name}</span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className={`-mr-1 h-5 w-5 transition duration-300 text-gray-400 ${open ? 'rotate-180' : ''}`}
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <MenuItem>
                        {({ active }) => (
                          <a
                            href="#"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                          >
                            Edit Profile
                          </a>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <a
                            href="#"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                          >
                            View Profile
                          </a>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <a
                            href="#"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                          >
                            Boost Your Profile
                          </a>
                        )}
                      </MenuItem>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-1"></div>

                      <MenuItem>
                        {({ active }) => (
                          <a
                            href="#"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                          >
                            Get ID Verified
                          </a>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <a
                            href="#"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                          >
                            Settings
                          </a>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <a
                            href="#"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                          >
                            Help Center
                          </a>
                        )}
                      </MenuItem>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-1"></div>

                      <form action="#" method="POST">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              type="submit"
                              className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                            >
                              Log Out
                            </button>
                          )}
                        </MenuItem>
                      </form>
                    </div>
                  </MenuItems>
                </>
              )}
            </Menu>

          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;
