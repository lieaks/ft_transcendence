import { toast, type ToastPosition, type ToastTransition, type ToastType } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useUserStore } from '@/stores/userStore';

const defaultToastOptions = {
  autoClose: 3500,
  position: 'top-right' as ToastPosition,
  closeOnClick: true,
  pauseOnHover: true,
  transition: 'Vue-Toastification__bounce' as ToastTransition,
};

export const useNotifications = () => {
  const notify = (message: string, type: string, options?: any) => {
    toast(message, {
      ...defaultToastOptions,
      type: type as ToastType,
      ...options,
    });
  };

  const notifyGameInvite = (name: string, id: string) => {
    const user = useUserStore();
    notify(`Invited by ${name}`, 'info', {
      icon: '🔔',
      autoClose: 10000,
      type: 'default',
      onClick: () => {
        user.socket?.emit('acceptInvite', { id });
      }
    });
  };

  const notifyFollow = (name: string) => {
    notify(`Started following ${name}`, 'info', {
      type: 'info',
      icon: '✨',
    });
  }

  const notifyUnfollow = (name: string) => {
    notify(`Unfollowed ${name}`, 'info', {
      type: 'info',
      icon: '🗑️',
    });
  }

  const notifyBlock = (name: string) => {
    notify(`Blocked ${name}`, 'info', {
      type: 'info',
      icon: '🚫',
    });
  }

  const notifyUnblock = (name: string) => {
    notify(`Unblocked ${name}`, 'info', {
      type: 'info',
      icon: '🏳️',
    });
  }

  return {
    notifyGameInvite,
    notifyFollow,
    notifyUnfollow,
    notifyBlock,
    notifyUnblock,
  };
};
