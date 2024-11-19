import React, { useState } from 'react';

const Sidebar = ({ contacts, currentChat, onSelectChat }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="w-1/4 bg-white border-r border-gray-300">
      {/* Sidebar Header */}
      <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
        <h1 className="text-2xl font-semibold">Chat Web</h1>
        <div className="relative">
          <button
            id="menuButton"
            className="focus:outline-none"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-100"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path d="M2 10a2 2 0 012-2h12a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2z" />
            </svg>
          </button>
          {/* Menu Dropdown */}
          {showMenu && (
            <div
              id="menuDropdown"
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg"
            >
              <ul className="py-2 px-3">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:text-gray-400"
                  >
                    Option 1
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:text-gray-400"
                  >
                    Option 2
                  </a>
                </li>
                {/* Add more menu options here */}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Contact List */}
      <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
            onClick={() => onSelectChat(contact)}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img
                src={contact.avatar}
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{contact.name}</h2>
              <p className="text-gray-600">{contact.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatArea = ({ currentChat }) => {
  const [messages, setMessages] = useState(currentChat.messages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    const updatedMessages = [
      ...messages,
      {
        type: "outgoing",
        text: newMessage,
      },
    ];
    setMessages(updatedMessages);
    setNewMessage("");
  };

  return (
    <div className="flex-1">
      {/* Chat Header */}
      <header className="bg-white p-4 text-gray-700">
        <h1 className="text-2xl font-semibold">{currentChat.name}</h1>
      </header>

      {/* Chat Messages */}
      <div className="h-screen overflow-y-auto p-4 pb-36">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-4 cursor-pointer ${
              message.type === "outgoing" ? "justify-end" : ""
            }`}
          >
            {message.type === "incoming" && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                <img
                  src={currentChat.avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
            <div
              className={`flex max-w-96 rounded-lg p-3 gap-3 ${
                message.type === "outgoing"
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              <p>{message.text}</p>
            </div>
            {message.type === "outgoing" && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                <img
                  src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                  alt="My Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

const Chat = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const contacts = [
    {
      id: 1,
      name: "Alice",
      avatar: "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Hoorayy!!",
      messages: [
        { type: "incoming", text: "Hey Bob, how's it going?" },
        { type: "outgoing", text: "Hi Alice! I'm good, just finished a great book." },
        { type: "incoming", text: "That book sounds interesting! What's it about?" },
        { type: "outgoing", text: "It's about an astronaut stranded on Mars, trying to survive." },
      ],
    },
    // More contacts here
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar contacts={contacts} currentChat={currentChat} onSelectChat={setCurrentChat} />
      {currentChat && <ChatArea currentChat={currentChat} />}
    </div>
  );
};

export default Chat;
