import { User } from "../../interfaces/user.interface";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  save(user: Omit<User, "id">): Promise<User>;
  update(id: string, product: Omit<User, "id">): Promise<User | null>;
  deleteById(id: string): Promise<boolean>;
  findByEmail(email: string): User | PromiseLike<User | null> | null;
  findByUsername(username: string): User | PromiseLike<User | null> | null;
}
