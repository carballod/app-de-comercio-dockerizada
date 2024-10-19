import { User } from '../../models/user/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
