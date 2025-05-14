import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toast component that can be used without context
const ToastContainer: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-error" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'info':
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success bg-opacity-10 border-success';
      case 'error':
        return 'bg-error bg-opacity-10 border-error';
      case 'warning':
        return 'bg-warning bg-opacity-10 border-warning';
      case 'info':
        return 'bg-primary bg-opacity-10 border-primary';
    }
  };

  return (
    <div className={`rounded-md border px-4 py-3 ${getBgColor()} flex items-center justify-between fade-in`}>
      <div className="flex items-center space-x-3">
        {getIcon()}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Toaster component that displays all toasts
export function Toaster({ toasts = [], removeToast }: { toasts?: Toast[]; removeToast?: (id: string) => void }) {
  const [internalToasts, setInternalToasts] = useState<Toast[]>([]);

  // If we're using internal state (no context)
  const handleRemoveToast = (id: string) => {
    if (removeToast) {
      removeToast(id);
    } else {
      setInternalToasts((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-6 z-50 w-full max-w-sm space-y-2 pointer-events-none">
      {(toasts.length > 0 ? toasts : internalToasts).map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastContainer toast={toast} onClose={() => handleRemoveToast(toast.id)} />
        </div>
      ))}
    </div>
  );
}

// Standalone function to create toasts
let toastContainer: HTMLDivElement | null = null;

export const toast = {
  success: (message: string) => {
    showToast(message, 'success');
  },
  error: (message: string) => {
    showToast(message, 'error');
  },
  warning: (message: string) => {
    showToast(message, 'warning');
  },
  info: (message: string) => {
    showToast(message, 'info');
  },
};

function showToast(message: string, type: ToastType) {
  // Create container if it doesn't exist
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'fixed bottom-0 right-0 p-6 z-50 w-full max-w-sm space-y-2';
    document.body.appendChild(toastContainer);
  }

  // Create toast
  const toast: Toast = {
    id: Math.random().toString(36).substring(2, 9),
    message,
    type,
  };

  // Create toast element
  const toastElement = document.createElement('div');
  toastElement.className = 'toast-item fade-in';
  toastElement.dataset.id = toast.id;

  // Add to container
  toastContainer.appendChild(toastElement);

  // Automatically remove after 5 seconds
  setTimeout(() => {
    toastElement.classList.add('fade-out');
    setTimeout(() => {
      toastElement.remove();
    }, 300);
  }, 5000);
}