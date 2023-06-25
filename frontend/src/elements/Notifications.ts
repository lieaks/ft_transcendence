import { toast, type ToastPosition, type ToastTransition, type ToastType } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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

  const notifyError = (message: string) => {
    notify(message, 'error');
  };

  const notifySuccess = (message: string) => {
    notify(message, 'success');
  };

  const notifyInfo = (message: string) => {
    notify(message, 'info');
  };

  const notifyWarning = (message: string) => {
    notify(message, 'warning');
  };

  const notifyAuthError = (message: string) => {
    notifyError(message);
  };

  const notifyGameInvite = (message: string) => {
    notify(message, 'info', {
      icon: '🔔',
      autoClose: 10000,
      type: 'default',
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
    notifyError,
    notifySuccess,
    notifyInfo,
    notifyWarning,
    notifyAuthError,
    notifyGameInvite,
    notifyFollow,
    notifyUnfollow,
    notifyBlock,
    notifyUnblock,
  };
};
