import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdVerified } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";
import { FaHeart, FaRegHeart, FaCamera } from 'react-icons/fa6';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('viewedMe');

  return (
    <div className="max-w-[1200px] mx-auto bg-gray-50 px-2 md:px-4 pt-2 pb-4 my-6">
      {/* Tab Navigation */}
      <div className='flex sm:flex-row flex-col justify-between border-b border-gray-300 items-center sm:items-start pb-3 sm:pb-0'>
        <div className="flex space-x-4 text-sm sm:mb-0 mb-2 md:pb-0 border-b sm:border-none border-gray-300 sm:w-fit w-full ">
          <button
            onClick={() => setActiveTab('viewedMe')}
            className={`pb-3 pt-2 text-[14px] font-semibold mb-[-1px] ${activeTab === 'viewedMe' ? 'border-b-2 border-[#E9677B] text-[#E9677B]' : 'text-gray-600 border-b-2 border-transparent'
              }`}
          >
            VIEWED ME
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 pt-2 text-[14px] font-semibold mb-[-1px] ${activeTab === 'favorites' ? 'border-b-2 border-[#E9677B] text-[#E9677B]' : 'text-gray-600 border-b-2 border-transparent'
              }`}
          >
            FAVORITES
          </button>
          <button
            onClick={() => setActiveTab('favoritedMe')}
            className={`pb-3 pt-2 text-[14px] font-semibold mb-[-1px] ${activeTab === 'favoritedMe' ? 'border-b-2 border-[#E9677B] text-[#E9677B]' : 'text-gray-600 border-b-2 border-transparent'
              }`}
          >
            FAVORITED ME
          </button>
        </div>

        <select
          className="border rounded-[6px] py-1 pl-[3] text-[14px] sm:w-fit w-full"
          style={{ outline: 'none', boxShadow: 'none' }}
        >
          <option>Sort By: When Viewed</option>
        </select>
      </div>

      {/* Render Components Based on Active Tab */}
      <div className="content mt-1 sm:mt-4">
        {activeTab === 'viewedMe' && <ViewedMe />}
        {activeTab === 'favorites' && <Favorites />}
        {activeTab === 'favoritedMe' && <FavoritedMe />}
      </div>

      {/* Footer Note */}
      <p className="text-center text-gray-500 text-xs mt-4">
        Note: Profile views are only shown for the previous 180 days.
      </p>
    </div>
  );
};
// Components for each section
const ViewedMe = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited); // Toggle favorite status
  };

  return (
    <ul className='flex flex-col'>
      <li>
        <Link to="/" className='bg-white sm:p-4 p-2 mt-4 rounded-lg shadow-sm w-full flex flex-row'>
          <div className='relative w-fit pr-3'>
            <img
              className='sm:w-[108px]  sm:max-h-[144px] max-h-[100px] min-w-[80px] min-h-[100px] sm:min-w-[108px] sm:min-h-[144px] rounded-md object-cover object-center'
              src='https://firebasestorage.googleapis.com/v0/b/helpy-6f93d.appspot.com/o/Images%2FmuRNCeQ2t5WZLEU6ZMKYfVNd7KP2%2FPost_3.jpg?alt=media&token=b93fae7b-e176-4a66-bf2d-acd45ab32dab'
              alt='Profile'
            />
            <div className='text-white absolute right-5 bottom-1 flex flex-row gap-1 items-center text-[12px]'>
              <FaCamera />
              <span>10</span>
            </div>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <div className='flex flex-row justify-between gap-3'>
              <div className="flex items-center mb-1 gap-2">
                <h1 className="md:text-[18px] text-[14px] font-medium leading-[18px]">Sweetelo</h1>
                <MdVerified className='text-[#4A90E2]' />
              </div>
              <span className='hidden md:inline text-[14px]'>
                Viewed Me 5 days ago
              </span>

              {/* This span is visible on mobile screens (below md) */}
              <span className='inline md:hidden text-[12px]'>
                5 days ago
              </span>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col w-full sm:w-[50%] max-w-[350px] gap-1'>
                <span className='text-[14px]'>I have a passport ready to use</span>
                <span className='text-[14px] text-gray-600'>Cartagena, Bolivar, Colombia</span>
                <div className='flex flex-row gap-2 text-[12px] md:text-[14px]'>
                  <button className='flex flex-row gap-1 items-center text-red-500'>
                    <AiOutlineMessage className='w-5 h-4' />
                    <span className='w-14 sm:w-[auto] overflow-hidden text-ellipsis whitespace-nowrap'>Send Message</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      handleFavoriteClick();
                    }}
                    className='flex flex-row gap-1 items-center'
                  >
                    {isFavorited ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
                  </button>
                </div>
              </div>
              <div className='sm:flex flex-col w-[50%] max-w-[350px] gap-1 hidden '>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Height </span>
                  <span>5'1"</span>
                </div>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Body </span>
                  <span>Average</span>
                </div>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Ethnicity </span>
                  <span>Latin / Hispanic</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </li>
      <li>
        <Link to="/" className='bg-white sm:p-4 p-2 mt-4 rounded-lg shadow-sm w-full flex flex-row'>
          <div className='relative w-fit pr-3'>
            <img
              className='sm:w-[108px]  sm:max-h-[144px] max-h-[100px] min-w-[80px] min-h-[100px] sm:min-w-[108px] sm:min-h-[144px] rounded-md object-cover object-center'
              src='https://firebasestorage.googleapis.com/v0/b/helpy-6f93d.appspot.com/o/Images%2FmuRNCeQ2t5WZLEU6ZMKYfVNd7KP2%2FPost_3.jpg?alt=media&token=b93fae7b-e176-4a66-bf2d-acd45ab32dab'
              alt='Profile'
            />
            <div className='text-white absolute right-5 bottom-1 flex flex-row gap-1 items-center text-[12px]'>
              <FaCamera />
              <span>10</span>
            </div>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <div className='flex flex-row justify-between gap-3'>
              <div className="flex items-center mb-1 gap-2">
                <h1 className="md:text-[18px] text-[14px] font-medium leading-[18px]">Sweetelo</h1>
                <MdVerified className='text-[#4A90E2]' />
              </div>
              <span className='hidden md:inline text-[14px]'>
                Viewed Me 5 days ago
              </span>

              {/* This span is visible on mobile screens (below md) */}
              <span className='inline md:hidden text-[12px]'>
                5 days ago
              </span>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col w-full sm:w-[50%] max-w-[350px] gap-1'>
                <span className='text-[14px]'>I have a passport ready to use</span>
                <span className='text-[14px] text-gray-600'>Cartagena, Bolivar, Colombia</span>
                <div className='flex flex-row gap-2 text-[12px] md:text-[14px]'>
                  <button className='flex flex-row gap-1 items-center text-red-500'>
                    <AiOutlineMessage className='w-5 h-4' />
                    <span className='w-14 sm:w-[auto] overflow-hidden text-ellipsis whitespace-nowrap'>Send Message</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      handleFavoriteClick();
                    }}
                    className='flex flex-row gap-1 items-center'
                  >
                    {isFavorited ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
                  </button>
                </div>
              </div>
              <div className='sm:flex flex-col w-[50%] max-w-[350px] gap-1 hidden '>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Height </span>
                  <span>5'1"</span>
                </div>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Body </span>
                  <span>Average</span>
                </div>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Ethnicity </span>
                  <span>Latin / Hispanic</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </li>
    </ul>
  );
};

const Favorites = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited); // Toggle favorite status
  };

  return (
    <ul className='flex flex-col'>

      <li>
        <Link to="/" className='bg-white sm:p-4 p-2 mt-4 rounded-lg shadow-sm w-full flex flex-row'>
          <div className='relative w-fit pr-3'>
            <img
              className='sm:w-[108px]  sm:max-h-[144px] max-h-[100px] min-w-[80px] min-h-[100px] sm:min-w-[108px] sm:min-h-[144px] rounded-md object-cover object-center'
              src='https://firebasestorage.googleapis.com/v0/b/helpy-6f93d.appspot.com/o/Images%2FmuRNCeQ2t5WZLEU6ZMKYfVNd7KP2%2FPost_3.jpg?alt=media&token=b93fae7b-e176-4a66-bf2d-acd45ab32dab'
              alt='Profile'
            />
            <div className='text-white absolute right-5 bottom-1 flex flex-row gap-1 items-center text-[12px]'>
              <FaCamera />
              <span>10</span>
            </div>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <div className='flex flex-row justify-between gap-3'>
              <div className="flex items-center mb-1 gap-2">
                <h1 className="md:text-[18px] text-[14px] font-medium leading-[18px]">Sweetelo</h1>
                <MdVerified className='text-[#4A90E2]' />
              </div>
              <span className='hidden md:inline text-[14px]'>
                Viewed Me 5 days ago
              </span>

              {/* This span is visible on mobile screens (below md) */}
              <span className='inline md:hidden text-[12px]'>
                5 days ago
              </span>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col w-full sm:w-[50%] max-w-[350px] gap-1'>
                <span className='text-[14px]'>I have a passport ready to use</span>
                <span className='text-[14px] text-gray-600'>Cartagena, Bolivar, Colombia</span>
                <div className='flex flex-row gap-2 text-[12px] md:text-[14px]'>
                  <button className='flex flex-row gap-1 items-center text-red-500'>
                    <AiOutlineMessage className='w-5 h-4' />
                    <span className='w-14 sm:w-[auto] overflow-hidden text-ellipsis whitespace-nowrap'>Send Message</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      handleFavoriteClick();
                    }}
                    className='flex flex-row gap-1 items-center'
                  >
                    {isFavorited ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
                  </button>
                </div>
              </div>
              <div className='sm:flex flex-col w-[50%] max-w-[350px] gap-1 hidden '>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Height </span>
                  <span>5'1"</span>
                </div>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Body </span>
                  <span>Average</span>
                </div>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Ethnicity </span>
                  <span>Latin / Hispanic</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </li>
    </ul>
  );
};

const FavoritedMe = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited); // Toggle favorite status
  };

  return (
    <ul className='flex flex-col'>

      <li>
        <Link to="/" className='bg-white sm:p-4 p-2 mt-4 rounded-lg shadow-sm w-full flex flex-row'>
          <div className='relative w-fit pr-3'>
            <img
              className='sm:w-[108px]  sm:max-h-[144px] max-h-[100px] min-w-[80px] min-h-[100px] sm:min-w-[108px] sm:min-h-[144px] rounded-md object-cover object-center'
              src='https://firebasestorage.googleapis.com/v0/b/helpy-6f93d.appspot.com/o/Images%2FmuRNCeQ2t5WZLEU6ZMKYfVNd7KP2%2FPost_3.jpg?alt=media&token=b93fae7b-e176-4a66-bf2d-acd45ab32dab'
              alt='Profile'
            />
            <div className='text-white absolute right-5 bottom-1 flex flex-row gap-1 items-center text-[12px]'>
              <FaCamera />
              <span>10</span>
            </div>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <div className='flex flex-row justify-between gap-3'>
              <div className="flex items-center mb-1 gap-2">
                <h1 className="md:text-[18px] text-[14px] font-medium leading-[18px]">Sweetelo</h1>
                <MdVerified className='text-[#4A90E2]' />
              </div>
              <span className='hidden md:inline text-[14px]'>
                Viewed Me 5 days ago
              </span>

              {/* This span is visible on mobile screens (below md) */}
              <span className='inline md:hidden text-[12px]'>
                5 days ago
              </span>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col w-full sm:w-[50%] max-w-[350px] gap-1'>
                <span className='text-[14px]'>I have a passport ready to use</span>
                <span className='text-[14px] text-gray-600'>Cartagena, Bolivar, Colombia</span>
                <div className='flex flex-row gap-2 text-[12px] md:text-[14px]'>
                  <button className='flex flex-row gap-1 items-center text-red-500'>
                    <AiOutlineMessage className='w-5 h-4' />
                    <span className='w-14 sm:w-[auto] overflow-hidden text-ellipsis whitespace-nowrap'>Send Message</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      handleFavoriteClick();
                    }}
                    className='flex flex-row gap-1 items-center'
                  >
                    {isFavorited ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
                  </button>
                </div>
              </div>
              <div className='sm:flex flex-col w-[50%] max-w-[350px] gap-1 hidden '>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Height </span>
                  <span>5'1"</span>
                </div>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Body </span>
                  <span>Average</span>
                </div>
                <div className='flex flex-row items-center gap-3 text-[14px]'>
                  <span className='font-medium'>Ethnicity </span>
                  <span>Latin / Hispanic</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </li>
    </ul>
  );
};



export default ProfileTabs;
