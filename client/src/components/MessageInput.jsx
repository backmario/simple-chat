export const MessageInput = ({
  inputMessage,
  setInputMessage,
  handleKeyDown,
}) => {
  return (
    <input
      type="text"
      placeholder="Type your message..."
      value={inputMessage}
      onChange={(e) => setInputMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      className="p-3 m-4 border border-stone-600 rounded-br-xl outline-none text-lg bg-transparent w-full"
    />
  );
};
