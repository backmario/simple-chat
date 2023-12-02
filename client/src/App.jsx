import { useState, useEffect } from "react";
import io from "socket.io-client";
import { MessageInput } from "./components/MessageInput";
import { MessageContainer } from "./components/MessageContainer";

const socket = io("http://localhost:5000"); // Update with your server URL

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      socket.emit("chat message", inputMessage);
      setInputMessage("");
    }
  };

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("chat message", (msg) => {
      if (msg.sender === "system") {
        const match = msg.text.match(/Your ID is (\w+)/);
        if (match) {
          setUserId(match[1]);
        }
      }
    });

    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stop typing", () => {
      setIsTyping(false);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [isTyping]);

  return (
    <div className="font-inconsolata h-screen grid bg-stone-900 text-white content-between overflow-y-auto">
      <div className="">
        <MessageContainer messages={messages} userId={userId} />
      </div>
      <div className="flex justify-center items-center">
        {isTyping && <div>User is typing...</div>}
        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
export default App;
