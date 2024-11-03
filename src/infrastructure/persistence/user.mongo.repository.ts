import { Types } from "mongoose";
import { User as UserInterface } from "../../interfaces/user.interface";
import { IUserRepository } from "../../application/repository/user.repository";
import { User } from "../schemas/user/user.schema";

export class UserMongoRepository implements IUserRepository {
  private documentToInterface(doc: any): UserInterface {
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      password: doc.password,
      isAdmin: doc.isAdmin,
    };
  }

  async findAll(): Promise<UserInterface[]> {
    const users = await User.find().lean();
    return users.map((user) => this.documentToInterface(user));
  }

  async findById(id: string): Promise<UserInterface | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const user = await User.findById(id).lean();
    return user ? this.documentToInterface(user) : null;
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    const user = await User.findOne({ email }).lean();
    return user ? this.documentToInterface(user) : null;
  }

  async findByUsername(username: string): Promise<UserInterface | null> {
    const user = await User.findOne({ username }).lean();
    return user ? this.documentToInterface(user) : null;
  }

  async save(user: Omit<UserInterface, "id">): Promise<UserInterface> {
    const newUser = new User(user);
    const savedUser = await newUser.save();
    return this.documentToInterface(savedUser);
  }

  async update(
    id: string,
    userData: Partial<Omit<UserInterface, "id">>
  ): Promise<UserInterface | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: userData },
      { new: true }
    ).lean();
    return updatedUser ? this.documentToInterface(updatedUser) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await User.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
