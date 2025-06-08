// repositories/chat.repository.ts
import { BaseRepository } from "./base.repository";
import { Message } from "../models";
import { gql, DocumentNode } from "@apollo/client";
import { RepoParams } from "../Interfaces/repoParams.interface";

export class ChatRepository extends BaseRepository<Message> {
  id = "message";
  endpoint = "chat/";
  model = Message;

  protected getArrayQuery(): DocumentNode {
    return gql`
      query GetMessages($roomId: String!) {
        messages(roomId: $roomId) {
          id
          content
          userId
          createdAt
        }
      }
    `;
  }

  protected getSingleQuery(): DocumentNode {
    return gql`
      query GetMessage($id: String!) {
        message(id: $id) {
          id
          content
          userId
          createdAt
        }
      }
    `;
  }

  protected getCreateMutation(): DocumentNode {
    return gql`
      mutation SendMessage(
        $roomId: String!
        $content: String!
        $userId: String!
        $type: String!
      ) {
        sendMessage(
          roomId: $roomId
          content: $content
          userId: $userId
          type: $type
        ) {
          id
          content
          userId
          createdAt
        }
      }
    `;
  }

  protected getMessageSubscription(): DocumentNode {
    return gql`
      subscription MessageAdded($roomId: String!) {
        messageAdded(roomId: $roomId) {
          id
          content
          userId
          createdAt
        }
      }
    `;
  }

  async sendMessage(
    mode
    roomId: string,
    content: string,
    userId: string,
    typeMessage: "permanent" | "temporary" = "permanent"
  ): Promise<Message> {
    const repoParams: RepoParams = {
      roomId,
      content,
      userId,
      type: typeMessage,
    };
    const { result } = await this.create(repoParams);
    return result;
  }
}
