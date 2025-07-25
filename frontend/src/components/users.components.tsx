import { FC, useState, useEffect } from "react";
import { User } from "../models/models";
import { UserRepository } from "../repositories/users.repositories";
import { RepositoryFactory } from "../repositories/factory.repository";

// Define props interface
interface UsersProps {
  myId?: string;
}

const Users: FC<UsersProps> = ({ myId }) => {
  const [users, setUsers] = useState<User[] | null>(null);
  const usersRepo = RepositoryFactory.get(UserRepository);

  // Create chat
  useEffect(() => {
    const createChat = async () => {
      try {
        const users: User[] = await usersRepo.getAllUsers();
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    };
    createChat();
  }, []);

  return (
    <div>
      <h1>Welcome to the Chats</h1>
    </div>
  );
};

export default Users;
