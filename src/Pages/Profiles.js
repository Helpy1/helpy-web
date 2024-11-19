import React from 'react';

const Profiles = () => {
  const profiles = [
    { id: 1, name: 'Kelly h', age: 26, location: 'La Esperanza, ANT', image: 'https://media.istockphoto.com/id/175219420/photo/sunrise-during-morning-mist-farm-road-landscape-hdr-xxxl.jpg?s=2048x2048&w=is&k=20&c=glrf5uV_hv5OkPL_KuYcdZgymdntvpofYp4yuXBdkcE=' },
    { id: 2, name: 'Kathia', age: 22, location: 'Medellín, ANT', image: 'https://media.istockphoto.com/id/175219420/photo/sunrise-during-morning-mist-farm-road-landscape-hdr-xxxl.jpg?s=2048x2048&w=is&k=20&c=glrf5uV_hv5OkPL_KuYcdZgymdntvpofYp4yuXBdkcE=' },
    { id: 3, name: 'Mayca', age: 34, location: 'Santo Tomás, ATL', image: 'https://media.istockphoto.com/id/175219420/photo/sunrise-during-morning-mist-farm-road-landscape-hdr-xxxl.jpg?s=2048x2048&w=is&k=20&c=glrf5uV_hv5OkPL_KuYcdZgymdntvpofYp4yuXBdkcE=' },
  ];

  return (
<div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative w-full h-72"> {/* Fixed height */}
              <img
                src={profile.image}
                alt={profile.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{profile.name}</h2>
              <p className="text-sm text-gray-600">{profile.age} - {profile.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profiles;
