import { toast as sonnerToast } from 'sonner';

export const mytoast = Object.assign(
  (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast(message, {
        ...options,
        cancel: {
            label: 'Cancel',
            onClick: () => {},
        },
    });
  },
  {
    success: (message: string, options?: Parameters<typeof sonnerToast>[1]) =>
      sonnerToast.success(message, {
        ...options,
        cancel: {
            label: 'Cancel',
            onClick: () => {},
        },
      }),
    error: (message: string, options?: Parameters<typeof sonnerToast>[1]) =>
      sonnerToast.error(message, {
        ...options,
        cancel: {
            label: 'Cancel',
            onClick: () => {},
        },
      }),
    info: (message: string, options?: Parameters<typeof sonnerToast>[1]) =>
      sonnerToast.info(message, {
        ...options,
        cancel: {
            label: 'Cancel',
            onClick: () => {},
        },
      }),
    // copy other methods you need
    dismiss: sonnerToast.dismiss,
  }
);