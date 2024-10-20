
import { Router } from 'express';
import { signup, signin } from '../controllers/auth.controller';

const router = Router();

router.route('/signup').post(signup);

router.route('/login').post(signin);

export { router};