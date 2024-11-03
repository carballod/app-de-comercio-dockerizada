import bcrypt from "bcrypt";
import { UserMongoRepository } from "../infrastructure/persistence/user.mongo.repository";

async function hashExistingPasswords() {
  const userRepository = new UserMongoRepository();
  const users = await userRepository.findAll();

  for (const user of users) {
    if (!user.password.startsWith("$2b$")) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await userRepository.update(user.id, {
        ...user,
        password: hashedPassword,
      });
    }
  }

  console.log("Todas las contraseñas han sido hasheadas");
}

hashExistingPasswords().catch(console.error);
