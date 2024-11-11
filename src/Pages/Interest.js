import React, { useState } from 'react';

// Components for each section
const ViewedMe = () => (
  <div className="flex items-center bg-white p-4 mt-4 rounded-lg shadow-sm">
    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
      <img src="https://via.placeholder.com/100" alt="Profile" className="w-full h-full object-cover" />
      <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">15</span>
    </div>
    <div className="ml-4 flex-grow">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold">Sweetelo</h2>
        <span className="text-blue-500">✔</span>
      </div>
      <p className="text-gray-600">I have a passport ready to use</p>
      <p className="text-sm text-gray-500">32, Cartagena, Bolivar, Colombia</p>
      <div className="flex items-center space-x-4 mt-2">
        <button className="text-red-600 text-sm">Send Message</button>
        <button className="text-gray-500 text-sm">Favorite</button>
      </div>
    </div>
    <div className="text-sm text-gray-600 space-y-1 ml-4">
      <p><span className="font-semibold">Height:</span> 156 cm</p>
      <p><span className="font-semibold">Body:</span> Average</p>
      <p><span className="font-semibold">Ethnicity:</span> Latin / Hispanic</p>
      <p className="text-right text-xs text-gray-400">Viewed Me 6 days ago</p>
    </div>
  </div>
);

const Favorites = () => (
  <div className="flex items-center bg-white p-4 mt-4 rounded-lg shadow-sm">
    {/* Sample content for the Favorites component */}
    <p className="text-gray-600">You don't have any favorites yet.</p>
  </div>
);

const FavoritedMe = () => (
  <div className="flex items-center bg-white p-4 mt-4 rounded-lg shadow-sm">
    {/* Sample content for the Favorited Me component */}
    <p className="text-gray-600">No one has favorited you yet.</p>
  </div>
);

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('viewedMe');

  return (
    <div className="max-w-screen-lg mx-auto bg-gray-50 p-4">
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-300 text-sm">
        <button
          onClick={() => setActiveTab('viewedMe')}
          className={`pb-2 font-semibold ${activeTab === 'viewedMe' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-600'}`}
        >
          VIEWED ME
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-2 font-semibold ${activeTab === 'favorites' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-600'}`}
        >
          FAVORITES
        </button>
        <button
          onClick={() => setActiveTab('favoritedMe')}
          className={`pb-2 font-semibold ${activeTab === 'favoritedMe' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-600'}`}
        >
          FAVORITED ME
        </button>
        <div className="ml-auto">
          <select className="text-gray-600 text-sm border border-gray-300 rounded-md p-1">
            <option>Sort By: When Viewed</option>
          </select>
        </div>
      </div>

      {/* Render Components Based on Active Tab */}
      <div className="content mt-4">
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

export default ProfileTabs;