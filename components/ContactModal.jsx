import React, { useState } from "react";

export default function ContactModal({ isOpen, onClose, resource }) {
  const [message, setMessage] = useState("");
  const maxChars = 250;

  if (!isOpen) return null;

  const handleSend = () => {
    console.log("Message ready for API:", message);
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Contact about: {resource.title}</h2>

        <p className="mb-2 text-gray-700">{resource.description}</p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={maxChars}
          placeholder="Write your message..."
          className="w-full p-2 border rounded mb-2"
        />
        <div className="text-right text-sm text-gray-500 mb-4">
          {message.length}/{maxChars}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
