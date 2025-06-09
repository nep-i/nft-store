// repositories/chatEntity.repository.ts
import { BaseRepository } from "./base.repository";
import { gql, DocumentNode } from "@apollo/client";
import { Chat, User } from "../models/models";

export class ChatRepository extends BaseRepository<Chat> {
  id = "chat";
  endpoint = "chat/";
  model = Chat;

  constructor() {
    super();
  }

  protected getArrayQuery(): DocumentNode {
    return gql`
      query GetChats {
        chats {
          id
          participants {
            id
            username
            email
          }
          messages {
            id
            roomId
            content
            userId
            type
            createdAt
          }
        }
      }
    `;
  }

  protected getSingleQuery(): DocumentNode {
    return gql`
      query GetChat($id: String!) {
        chat(id: $id) {
          id
          participants {
            id
            username
            email
          }
          messages {
            id
            roomId
            content
            userId
            type
            createdAt
          }
        }
      }
    `;
  }

  protected getCreateMutation(): DocumentNode {
    return gql`
      mutation CreateChat($participants: [String!]!) {
        createChat(participants: $participants) {
          id
          participants {
            id
            username
            email
          }
          messages {
            id
            roomId
            content
            userId
            type
            createdAt
          }
        }
      }
    `;
  }

  protected getMessageSubscription(): DocumentNode {
    throw new Error("Subscriptions not supported for ChatEntityRepository");
  }

  async createChat(participants: string[]): Promise<Chat> {
    const variables = {
      participants: participants.map((id) => new User({ id })),
    };

    const { result } = await this.mutation(
      this.getCreateMutation(),
      variables,
      true
    );
    return result;
  }

  async getChat(roomId: string): Promise<Chat | null> {
    const variables = {
      roomId,
    };

    const { result } = await this.mutation(
      this.getSingleQuery(),
      variables,
      true
    );
    return result;
  }
}

// // repositories/chat.repository.ts
// import { BaseRepository } from "./base.repository";
// import { gql, DocumentNode } from "@apollo/client";
// import { Chat, User, Message } from "../Models/models";

// export class ChatRepository extends BaseRepository<Chat | Message> {
//   id = "chat";
//   endpoint = "chat/";
//   model: any;

//   constructor(type?: "chat" | "message") {
//     super();
//     if (!type || type === "chat") this.model = Chat;
//     if (type === "message") this.model = Message;
//   }

//   protected getArrayQuery(): DocumentNode {
//     return gql`
//       query GetMessages($roomId: String!) {
//         messages(roomId: $roomId) {
//           id
//           content
//           userId
//           createdAt
//         }
//       }
//     `;
//   }

//   protected getSingleQuery(): DocumentNode {
//     return gql`
//       query GetMessage($id: String!) {
//         message(id: $id) {
//           id
//           content
//           userId
//           createdAt
//         }
//       }
//     `;
//   }

//   protected getCreateMutation(): DocumentNode {
//     if (typeof this.model === typeof Message)
//       return gql`
//         mutation SendMessage(
//           $roomId: String!
//           $content: String!
//           $userId: String!
//           $type: String!
//         ) {
//           sendMessage(
//             roomId: $roomId
//             content: $content
//             userId: $userId
//             type: $type
//           ) {
//             id
//             content
//             userId
//             createdAt
//           }
//         }
//       `;
//     else
//       return gql`
//         mutation CreateChat($participants: [String!]!) {
//           createChat(participants: $participants) {
//             id
//             participants {
//               id
//             }
//             messages {
//               id
//               roomId
//               content
//               userId
//               type
//               createdAt
//             }
//           }
//         }
//       `;
//   }

//   protected getMessageSubscription(): DocumentNode {
//     return gql`
//       subscription MessageAdded($roomId: String!) {
//         messageAdded(roomId: $roomId) {
//           id
//           content
//           userId
//           createdAt
//         }
//       }
//     `;
//   }

//   async sendMessage(message: Message): Promise<Chat | Message> {
//     const variables = {
//       roomId: message.params.chatId,
//       content: message.params.content,
//       userId: message.params.sender,
//       type: message.params.typeMessage,
//     };
//     const { result } = await this.mutation(variables, true);
//     return result as Message;
//   }

//   async createChat(chat: Chat): Promise<Chat | Message> {
//     const variables = {
//       participants: chat.params.participants.map((user) => user.id),
//     };
//     const { result } = await this.mutation(variables, true);
//     return result as Chat;
//   }
// }
