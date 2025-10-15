import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MdClose } from 'react-icons/md';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        'relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl w-full',
        'animate-in zoom-in-95 duration-200',
        sizes[size]
      )}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a] bg-[#0a0a0a]/50">
            <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all duration-200"
              aria-label="Close modal"
            >
              <MdClose size={24} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

