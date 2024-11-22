import { configureExpress } from "./infrastructure/config/express.config";
import { connectToDatabase } from "./infrastructure/config/mongodb.config";

const app = configureExpress();
const PORT = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
