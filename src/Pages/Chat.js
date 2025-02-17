import React, { useState } from 'react';
import Navbar from './Navbar';

const Sidebar = ({ contacts, onSelectChat }) => {
  return (
    <div className="w-1/4 bg-white border-r border-gray-300 flex flex-col">
      {/* Sidebar Header */}
      <header className="py-3 px-4 border-b border-gray-300 flex justify-between items-center text-dark">
        <h1 className="text-2xl font-bold">Chats</h1>
      </header>

      {/* Contact List */}
      <div className="bg-white shadow-lg rounded-lg h-screen overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-3 border-b last:border-none cursor-pointer"
            onClick={() => onSelectChat(contact)} // Update `currentChat`
          >
            <div className="flex items-center space-x-3 relative">
              <span className="text-xs text-gray-400 absolute right-2 bottom-[30px]">{contact.time}</span>
              {/* Avatar */}
              <div className="w-10 h-10 bg-gray-300 rounded-full">
                <img src={contact.avatar} alt={`${contact.name}'s Avatar`} className="w-full h-full rounded-full" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{contact.name}</h3>
                <p className="text-sm text-gray-500 truncate max-w-[200px]">{contact.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatArea = ({ currentChat }) => {
  const [messages, setMessages] = useState(currentChat ? currentChat.messages : []);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return; // Prevent sending empty messages
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

  // Update messages when `currentChat` changes
  React.useEffect(() => {
    setMessages(currentChat ? currentChat.messages : []);
  }, [currentChat]);

  if (!currentChat) {
    return <div className="flex-1 flex items-center justify-center">Select a chat to start messaging.</div>;
  }

  return (
    <div className="flex-1 relative flex flex-col">
      {/* Chat Header */}
      <header className="bg-white py-3 px-4 text-gray-700 border-b border-gray-300">
        <h1 className="text-2xl font-semibold">{currentChat.name}</h1>
      </header>

      {/* Chat Messages */}
      <div className="h-screen overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-4 items-center ${message.type === "outgoing" ? "justify-end" : ""
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
              className={`flex max-w-96 rounded-lg p-3 ${message.type === "outgoing"
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-700"
                }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <footer className="bg-white border-t border-gray-300 p-4  w-full">
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
      time: '1:45 pm',
      avatar: "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Hoorayy!!",
      messages: [
        { type: "incoming", text: "Hey Bob, how's it going?" },
        { type: "outgoing", text: "Hi Alice! I'm good, just finished a great book." },
        { type: "incoming", text: "That book sounds interesting! What's it about?" },
        { type: "outgoing", text: "It's about an astronaut stranded on Mars, trying to survive." },
        { type: "incoming", text: "Hey Bob, how's it going?" },
        { type: "outgoing", text: "Hi Alice! I'm good, just finished a great book." },
        { type: "incoming", text: "That book sounds interesting! What's it about?" },
        { type: "outgoing", text: "It's about an astronaut stranded on Mars, trying to survive." },
        { type: "incoming", text: "Hey Bob, how's it going?" },
        { type: "outgoing", text: "Hi Alice! I'm good, just finished a great book." },
        { type: "incoming", text: "That book sounds interesting! What's it about?" },
        { type: "outgoing", text: "It's about an astronaut stranded on Mars, trying to survive." },
        { type: "incoming", text: "Hey Bob, how's it going?" },
        { type: "outgoing", text: "Hi Alice! I'm good, just finished a great book." },
        { type: "incoming", text: "That book sounds interesting! What's it about?" },
        { type: "outgoing", text: "It's about an astronaut stranded on Mars, trying to survive." },
      ],
    },
    {
      id: 2,
      name: "Bob",
      time: 'Thursday',
      avatar: "https://placehold.co/200x/ffa500/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Sounds good!",
      messages: [
        { type: "incoming", text: "Hi Alice, any updates on the project?" },
        { type: "outgoing", text: "Yes, the designs are finalized. I'll share soon!" },
        { type: "incoming", text: "Great! Looking forward to it." },
      ],
    },
    {
      id: 1,
      name: "Alice",
      time: '1:45 pm',
      avatar: "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Hoorayy!!",
      messages: [
        { type: "incoming", text: "Hey Bob, how's it going?" },
        { type: "outgoing", text: "Hi Alice! I'm good, just finished a great book." },
        { type: "incoming", text: "That book sounds interesting! What's it about?" },
        { type: "outgoing", text: "It's about an astronaut stranded on Mars, trying to survive." },
      ],
    },
    {
      id: 2,
      name: "Bob",
      time: 'Thursday',
      avatar: "https://placehold.co/200x/ffa500/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Sounds good!",
      messages: [
        { type: "incoming", text: "Hi Alice, any updates on the project?" },
        { type: "outgoing", text: "Yes, the designs are finalized. I'll share soon!" },
        { type: "incoming", text: "Great! Looking forward to it." },
      ],
    },
    {
      id: 1,
      name: "Alice",
      time: '1:45 pm',
      avatar: "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Hoorayy!!",
      messages: [
        { type: "incoming", text: "Hey Bob, how's it going?" },
        { type: "outgoing", text: "Hi Alice! I'm good, just finished a great book." },
        { type: "incoming", text: "That book sounds interesting! What's it about?" },
        { type: "outgoing", text: "It's about an astronaut stranded on Mars, trying to survive." },
      ],
    },
    {
      id: 2,
      name: "Bob",
      time: 'Thursday',
      avatar: "https://placehold.co/200x/ffa500/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Sounds good!",
      messages: [
        { type: "incoming", text: "Hi Alice, any updates on the project?" },
        { type: "outgoing", text: "Yes, the designs are finalized. I'll share soon!" },
        { type: "incoming", text: "Great! Looking forward to it." },
      ],
    },
    {
      id: 1,
      name: "Alice",
      time: '1:45 pm',
      avatar: "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Hoorayy!!",
      messages: [
        { type: "incoming", text: "Hey Bob, how's it going?" },
        { type: "outgoing", text: "Hi Alice! I'm good, just finished a great book." },
        { type: "incoming", text: "That book sounds interesting! What's it about?" },
        { type: "outgoing", text: "It's about an astronaut stranded on Mars, trying to survive." },
      ],
    },
    {
      id: 2,
      name: "Bob",
      time: 'Thursday',
      avatar: "https://placehold.co/200x/ffa500/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Sounds good!",
      messages: [
        { type: "incoming", text: "Hi Alice, any updates on the project?" },
        { type: "outgoing", text: "Yes, the designs are finalized. I'll share soon!" },
        { type: "incoming", text: "Great! Looking forward to it." },
      ],
    },
    {
      id: 1,
      name: "Alice",
      time: '1:45 pm',
      avatar: "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Hoorayy!!",
      messages: [
        { type: "incoming", text: "Hey Bob, how's it going?" },
        { type: "outgoing", text: "Hi Alice! I'm good, just finished a great book." },
        { type: "incoming", text: "That book sounds interesting! What's it about?" },
        { type: "outgoing", text: "It's about an astronaut stranded on Mars, trying to survive." },
      ],
    },
    {
      id: 2,
      name: "Bob",
      time: 'Thursday',
      avatar: "https://placehold.co/200x/ffa500/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
      lastMessage: "Sounds good!",
      messages: [
        { type: "incoming", text: "Hi Alice, any updates on the project?" },
        { type: "outgoing", text: "Yes, the designs are finalized. I'll share soon!" },
        { type: "incoming", text: "Great! Looking forward to it." },
      ],
    },
    // Add more contacts here
  ];

  return (

    <div>
      <Navbar />
      <div className="flex h-screen overflow-hidden">
        <Sidebar contacts={contacts} onSelectChat={setCurrentChat} />
        <ChatArea currentChat={currentChat} />
      </div>
    </div>

  );
};

export default Chat;
