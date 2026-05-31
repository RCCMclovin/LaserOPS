import { AuthDTO, SessionData } from './auth.types';
import userService from '../user/user.service'
import { compare} from 'bcryptjs';

const checkAuth = async (
  credentials: AuthDTO,
): Promise<SessionData | null> => {
  const user = await userService.findUserByEmail(credentials.email);
  if(user){
    const accept = await compare(credentials.password, user.password);
    if (accept) {
      return {
        name: user.name,
        email: user.email,
        uid: user.id,
        utid: user.userTypeId,
      };
    }
  }
  else{
    await compare(credentials.password, "Senhafraca"); //Comparação para gastar tempo
  }
  
  return null;
};

export default {
  checkAuth,
}