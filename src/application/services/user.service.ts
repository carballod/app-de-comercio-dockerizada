import { UserJsonRepository } from "../../infrastructure/persistence/user.json.repository";
import { User } from "../../models/user/user.interface";

export class UserService {
  constructor(private userRepository: UserJsonRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    return this.userRepository.save(userData);
  }

  async updateUser(
    id: string,
    userData: Partial<Omit<User, "id">>
  ): Promise<User | null> {
    return this.userRepository.update(id, userData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.deleteById(id);
  }
}
