import { Router } from 'express';
import { getChatList, createChat, getChat, deleteChat } from '../controllers/chatController';

const router = Router();

router.post('/chat', createChat);
router.get('/chat/:id', getChat);
router.get('/chatList', getChatList);
router.delete('/chat/:id', deleteChat);

export default router;
