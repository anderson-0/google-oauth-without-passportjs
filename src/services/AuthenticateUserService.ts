import axios from 'axios';
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken';
import { base64urlDecode } from '../util/decode64';

interface IAccessTokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
}

interface IGoogleIDTokenPayload {
  email: string;
}

class AuthenticateUserService {
  async getAccessToken(code: string) {
    let url = `${process.env.GOOGLE_ACCESS_TOKEN_URL}?code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}`;
    let { data: {access_token, refresh_token, id_token }} = await axios.post<IAccessTokenResponse>(url);

    // All segment should be base64
    var segments = id_token.split('.');
    var payloadSeg = segments[1]; // get the second segment that contains the payload
    
    // base64 decode and parse JSON to extra the email
    var payload = JSON.parse(base64urlDecode(payloadSeg)) as IGoogleIDTokenPayload;
            
    let user = await prismaClient.user.findFirst({
      where: {
        email: payload.email
      }
    });

    if (!user) {
      
      // Saves access_token and refresh_token in the database
      // The access_token is valid for 60 minutes only but the refresh_token expires only after 200 days
      user = await prismaClient.user.create({
        data: {
          email: payload.email,
          access_token,
          refresh_token
        }
      })
    }

    // Generates JWT Token passing user info as payload
    const token = sign(
      {
        user: {
          email: payload.email,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: payload.email,
        expiresIn: process.env.JWT_EXPIRATION
      }
    )

    // Returning both JWT Token as the user data containing the access_token
    // In Production, the access_token should be stored in a secure way
    return {
      token,
      user
    };
  }

  async getUserInfo(email: string) {
    let user = await prismaClient.user.findFirst({
      where: {
        email
      }
    });

    if (!user) {
      throw new Error("Invalid Email");
    }
    return user;
  }
}

export { AuthenticateUserService }