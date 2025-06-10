import React, { useState, useEffect, FC } from "react";
import { RepositoryFactory } from "../repositories/factory.repository";
import { MessageRepository } from "../repositories/message.repository";
import { ChatRepository } from "../repositories/chat.repository";
import { Message, Chat as ChatEntity, User } from "../models/models";

const Chat: FC<{ userId: string; participantIds: string[] }> = ({
  userId,
  participantIds,
}) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messageRepo = RepositoryFactory.get(MessageRepository);
  const chatRepo = RepositoryFactory.get(ChatRepository);

  useEffect(() => {
    const createChat = async () => {
      try {
        const chat: ChatEntity = await chatRepo.createChat([
          userId,
          ...participantIds,
        ]);
        setRoomId(chat.id ? chat.id : null);
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    };
    createChat();
  }, [userId, participantIds]);

  useEffect(() => {
    if (!roomId) return;

    const subscription = messageRepo.subscribeToMessages(roomId).subscribe({
      next: (data) => {
        const newMessage = Message.deserialize(data.messageAdded);
        setMessages((prev) => [...prev, newMessage]);
      },
      error: (error) => console.error("Subscription error:", error),
    });

    const loadMessages = async () => {
      try {
        const chat = await chatRepo.getChat(roomId);
        setMessages(chat?.params.messages ? chat?.params.messages : []);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    loadMessages();

    // return () => subscription.unsubscribe();
  }, [roomId]);

  const handleSend = async () => {
    if (!roomId) return;
    try {
      const message = await messageRepo.sendMessage(
        new Message({
          chatId: roomId,
          sender: new User({ id: userId }),
          timestamp: new Date(Date.now()),
          typeMessage: "permanent",
          content: content,
        })
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
            <strong>{msg.params.sender.id}:</strong> {msg.params.content} (
            {msg.params.timestamp.toISOString()})
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
