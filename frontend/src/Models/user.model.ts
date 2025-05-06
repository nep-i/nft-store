export interface UserInterface {
  // id: string | null | undefined;
  username: string | null | undefined;
  email: string | null | undefined;
  name: string | null | undefined;
}

export default class UserModel implements UserInterface {
  // id: string | null | undefined;
  username: string | null | undefined;
  email: string | null | undefined;
  name: string | null | undefined;

  constructor(username: string, email: string, name: string) {
    this.username = username;
    this.email = email;
    this.name = name;
  }
}
