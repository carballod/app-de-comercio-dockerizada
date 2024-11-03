import { User } from "../../interfaces/user.interface";
import { IUserRepository } from "../repository/user.repository";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }
  async createUser(userData: Omit<User, "id">): Promise<User> {
    return this.userRepository.save(userData);
  }

  async updateUser(
    id: string,
    userData: Partial<Omit<User, "id">>
  ): Promise<User | null> {
    return this.userRepository.update(id, userData as Omit<User, "id">);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.deleteById(id);
  }
}
