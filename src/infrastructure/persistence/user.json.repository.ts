import fs from "fs/promises";
import path from "path";
import { IUserRepository } from "../../application/repository/user.repository";
import { User } from "../../models/user/user.interface";

const usersFile = path.join(__dirname, "../../../data/users.json");

export class UserJsonRepository implements IUserRepository {
  private async readUsers(): Promise<User[]> {
    const data = await fs.readFile(usersFile, "utf-8");
    return JSON.parse(data);
  }

  private async writeUsers(users: User[]): Promise<void> {
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  }

  async findAll(): Promise<User[]> {
    return this.readUsers();
  }

  async findById(id: string): Promise<User | null> {
    const users = await this.readUsers();
    return users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.readUsers();
    return users.find((user) => user.email === email) || null;
  }
  async findByUsername(username: string): Promise<User | null> {
    const users = await this.readUsers();
    return users.find((user) => user.username === username) || null;
  }

  async save(user: Omit<User, "id">): Promise<User> {
    const users = await this.readUsers();
    const newUser = { ...user, id: Date.now().toString() };
    users.push(newUser);
    await this.writeUsers(users);
    return newUser;
  }

  async update(
    id: string,
    user: Partial<Omit<User, "id">>
  ): Promise<User | null> {
    const users = await this.readUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...user };
    await this.writeUsers(users);
    return users[index];
  }

  async deleteById(id: string): Promise<boolean> {
    const users = await this.readUsers();
    const filteredUsers = users.filter((user) => user.id !== id);
    if (filteredUsers.length === users.length) return false;

    await this.writeUsers(filteredUsers);
    return true;
  }
}
