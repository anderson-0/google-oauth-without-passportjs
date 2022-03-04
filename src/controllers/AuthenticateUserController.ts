import { Request, Response } from 'express';
import { AuthenticateUserService } from '../services/AuthenticateUserService';


class AuthenticateUserController {
  async signin(req: Request, res: Response) {
    const url = `${process.env.GOOGLE_OAUTH_URL}?scope=email openid profile &access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&client_id=${process.env.GOOGLE_CLIENT_ID}`;
    res.redirect(url)
  }

  async callback(req: Request, res: Response) {
    const code = req.query.code as string;

    if(!code) {
      return res.status(401).json({ error: 'Code is required' });
    }

    const authenticateUser = new AuthenticateUserService();

    try {
      const response = await authenticateUser.getAccessToken(code);

      // Here instead should redirect the user to some protected page because the user is authenticated now
      return res.json(response);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }    
  }

  async getUserInfo(req: Request, res: Response) {
    const email = req.query.email as string;
    
    if(!email) {
      return res.status(401).json({ error: 'Email is required' });
    }

    const authenticateUser = new AuthenticateUserService();
    try {
      const response = await authenticateUser.getUserInfo(email);
      return res.json(response);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

export { AuthenticateUserController }