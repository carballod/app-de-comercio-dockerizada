import { configureExpress } from "./infrastructure/config/express.config";

const app = configureExpress();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
