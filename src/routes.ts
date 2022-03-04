import { Router } from "express";

import { AuthenticateUserController } from "./controllers/AuthenticateUserController";

const router = Router();

const authenticateUserController = new AuthenticateUserController();

router.get('/google/signin', authenticateUserController.signin);

router.get('/google/callback', authenticateUserController.callback);

router.get('/google/user', authenticateUserController.getUserInfo);

export { router };