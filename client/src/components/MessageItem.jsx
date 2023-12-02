import React from "react";

export const MessageItem = ({ index, msg, userId }) => {
  const isCurrentUser = msg.sender === userId;

  return (
    <li
      key={index}
      className={`flex flex-col m-2 rounded-lg text-white text-lg w-fit max-w-[50%]  p-2 ${
        isCurrentUser ? "bg-sky-500 self-end flex-row-reverse" : "bg-stone-600"
      }`}
    >
      {!isCurrentUser && (
        <span className="text-stone-300 text-sm p-2">{msg.sender}</span>
      )}

      <span className="flex items-end">
        {msg.sender === "system" ? (
          <i
            className={`fa-solid fa-computer p-4 ${
              isCurrentUser ? "hidden" : ""
            }`}
          ></i>
        ) : (
          <i
            className={`fa-solid fa-user p-4 ${isCurrentUser ? "hidden" : ""}`}
          ></i>
        )}
        {msg.text}
      </span>
    </li>
  );
};
