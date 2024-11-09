import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../interfaces/user.interface";
import { UserMongoRepository } from "../../infrastructure/persistence/user.mongo.repository";

export class AuthService {
  constructor(private userRepository: UserMongoRepository) {}

  async login(username: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return this.generateToken(user);
  }

  async register(userData: Partial<User>): Promise<User> {
    const validationErrors = [];
    if (!userData.username) validationErrors.push("El nombre de usuario es requerido");
    if (!userData.password) validationErrors.push("La contraseña es requerida");
    if (!userData.email) validationErrors.push("El email es requerido");
  
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(", "));
    }
    const { username, email, password } = userData as Required<Pick<User, 'username' | 'email' | 'password'>>;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser: Omit<User, "id"> = {
        username,
        email,
        password: hashedPassword,
        isAdmin: false,
      };
  
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear usuario: ${error.message}`);
      }
      throw new Error('Error al crear usuario en la base de datos');
    }
}
  async resetPassword(
    username: string,
    email: string,
    verificationCode: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (user.email !== email) {
      throw new Error("El email no coincide con el usuario");
    }

    if (verificationCode !== "123") {
      throw new Error("Código de verificación incorrecto");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.update(user.id, user);
    return true;
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );
  }

  verifyToken(token: string): User | null {
    try {
      return jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as User;
    } catch (error) {
      return null;
    }
  }
}
