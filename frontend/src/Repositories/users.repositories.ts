import { BaseRepository } from "./base.repository";
import { BaseModel } from "../Models/base.model";
import { gql, DocumentNode } from "@apollo/client";

export class UserModel extends BaseModel {
  // Example implementation
  static deserialize(data: any): UserModel {
    return new UserModel(); // Simplified
  }
  serialize(): any {
    return {}; // Simplified
  }
}

export class UserRepository extends BaseRepository<UserModel> {
  id = "users";
  endpoint = "users/";
  model = UserModel;

  public getQuery(): DocumentNode {
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
}
