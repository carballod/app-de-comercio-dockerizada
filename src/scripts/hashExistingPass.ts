import { UserJsonRepository } from "../../data/persistence/user.json.repository";
import bcrypt from "bcrypt";

async function hashExistingPasswords() {
  const userRepository = new UserJsonRepository();
  const users = await userRepository.findAll();

  for (const user of users) {
    if (!user.password.startsWith('$2b$')) { 
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await userRepository.update(user.id, { ...user, password: hashedPassword });
    }
  }

  console.log('Todas las contraseñas han sido hasheadas');
}

hashExistingPasswords().catch(console.error);