import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Assuming you have a notificationController with these methods
import { 
  getUserNotifications,
  markNotificationAsRead as markAsRead,
  markAllNotificationsAsRead as markAllAsRead,
  deleteNotification
} from '../controllers/notificationController.js';

// Protect all routes
router.use(protect);

router.route('/')
  .get(getUserNotifications);

router.put('/read/:id', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

export default router;
