import { UserService } from "./user.service";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../models/user/user.interface";

export class AuthService {
  constructor(private userService: UserService) {}

  async login(username: string, password: string): Promise<string | null> {
    const user = await this.userService.getUserByUsername(username);
    if (user) {
      let isPasswordValid: boolean;

      if (user.password.startsWith('$2b$')) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        isPasswordValid = password === user.password;

        if (isPasswordValid) {
          const hashedPassword = await bcrypt.hash(password, 10);
          await this.userService.updateUser(user.id, { ...user, password: hashedPassword });
        }
      }

      if (isPasswordValid) {
        return this.generateToken(user);
      }
    }
    return null;
  }

  async register(userData: Partial<User>): Promise<User> {
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error("Username, email, and password are required");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser: Omit<User, "id"> = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      isAdmin: userData.isAdmin || false
    };

    return this.userService.createUser(newUser);
  }

  async resetPassword(username: string, newPassword: string): Promise<boolean> {
    const user = await this.userService.getUserByUsername(username);
    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userService.updateUser(user.id, { password: hashedPassword });
      return true;
    }
    return false;
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  }
}
