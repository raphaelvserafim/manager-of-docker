import dotenv from 'dotenv';
dotenv.config();

export const envs = {
  token: process.env.ADMIN_KEY as string,
  imageName: process.env.IMAGE_NAME as string,
  serverPort: process.env.IMAGE_NAME || 3001,
}

