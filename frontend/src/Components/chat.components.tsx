// src/components/Chat.tsx
import React, { useState, useEffect } from "react";
import { RepositoryFactory } from "../Repositories/factory.repository";
import { ChatRepository } from "../Repositories/chat.repository";
import { Message } from "../Models/models";

const Chat: React.FC<{ roomId: string; userId: string }> = ({
  roomId,
  userId,
}) => {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatRepo = RepositoryFactory.get(ChatRepository);

  // Subscription
  useEffect(() => {
    const subscription = chatRepo.subscribeToMessages(roomId).subscribe({
      next: ({ data }) => {
        const newMessage = Message.deserialize(data.messageAdded);
        setMessages((prev) => [...prev, newMessage]);
      },
      error: (error) => console.error("Subscription error:", error),
    });

    return () => subscription.unsubscribe();
  }, [roomId]);

  const handleSend = async () => {
    try {
      const message = await chatRepo.sendMessage(
        roomId,
        content,
        userId,
        "permanent"
      );
      setMessages((prev) => [...prev, message]);
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender?.username || "Unknown"}:</strong> {msg.content}{" "}
            ({msg.timestamp.toISOString()})
          </div>
        ))}
      </div>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
