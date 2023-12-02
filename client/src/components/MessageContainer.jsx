import { MessageItem } from "./MessageItem";

export const MessageContainer = ({ messages, userId }) => {
  return (
    <ul className="flex flex-col">
      {messages.map((msg, index) => (
        <MessageItem msg={msg} index={index} userId={userId} />
      ))}
    </ul>
  );
};
