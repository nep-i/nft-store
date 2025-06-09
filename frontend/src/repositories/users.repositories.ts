import { BaseRepository } from "./base.repository";
import { BaseModel } from "../models/base.model";
import { gql, DocumentNode } from "@apollo/client";
import { User } from "../models/models";

export class UserModel extends BaseModel {
  // Example implementation
  static deserialize(data: any): UserModel {
    return new UserModel(); // Simplified
  }
  serialize(): any {
    return {}; // Simplified
  }
}

export class UserRepository extends BaseRepository<User> {
  protected getArrayQuery() {
    throw new Error("Method not implemented.");
  }
  protected getSingleQuery() {
    return gql`
      query GetUsers($page: Int, $page_size: Int, $tenant: String) {
        users(page: $page, page_size: $page_size, tenant: $tenant) {
          count
          next
          results {
            id
            name
            email
          }
        }
      }
    `;
  }
  protected getCreateMutation() {
    throw new Error("Method not implemented.");
  }
  protected getMessageSubscription() {
    throw new Error("Method not implemented.");
  }
  id = "users";
  endpoint = "users/";
  model = UserModel;

  async getAllUsers(): Promise<User[] | null> {
    const { result } = await this.mutation(this.getArrayQuery(), {}, true);

    return result;
  }

  async getMyUsers(userId: string): Promise<User[] | null> {
    const variables = {
      userId,
    };

    const { result } = await this.mutation(
      this.getSingleQuery(),
      variables,
      true
    );
    return result;
  }
}
