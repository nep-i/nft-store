// repositories/message.repository.ts
import { BaseRepository } from "./base.repository";
import { gql, DocumentNode } from "@apollo/client";
import { Message, User } from "../models/models";
import { RepoParams } from "../interfaces/repoParams.interface";

export class MessageRepository extends BaseRepository<Message> {
  id = "message";
  endpoint = "chat/";
  model = Message;

  constructor() {
    super();
  }

  protected getArrayQuery(): DocumentNode {
    return gql`
      query GetMessages($roomId: String!) {
        messages(roomId: $roomId) {
          id
          roomId
          content
          userId
          type
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
          roomId
          content
          userId
          type
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
          roomId
          content
          userId
          type
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
          roomId
          content
          userId
          type
          createdAt
        }
      }
    `;
  }

  async sendMessage(message: Message): Promise<Message> {
    const variables = {
      roomId: message.params.chatId,
      content: message.params.content,
      userId: message.params.sender,
      type: message.params.typeMessage,
    };
    const { result } = await this.mutation(
      this.getCreateMutation(),
      variables,
      true
    );
    return result;
  }
}
