import express from 'express'
import { getAllUsers }  from '../controllers/user.controller'

const router = express.Router();

router.route('/g').get(getAllUsers);

export {router};