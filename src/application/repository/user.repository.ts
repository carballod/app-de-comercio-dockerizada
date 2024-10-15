import { User } from "../../models/user/user.interface";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  save(user: Omit<User, "id">): Promise<User>;
  update(id: string, product: Omit<User, "id">): Promise<User | null>;
  deleteById(id: string): Promise<boolean>;
}
