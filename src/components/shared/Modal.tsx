import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import {useEffect, useId, useRef} from 'react';
import type {ReactNode} from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({open, onClose, title, children, className}: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          className="fixed inset-0 z-[120] bg-black/80 px-4 py-6 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{opacity: 0, y: 32}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 16}}
            transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
            className={cn(
              'mx-auto flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0c0c] text-white shadow-[0_32px_120px_rgba(0,0,0,0.45)]',
              className,
            )}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                {title ? (
                  <p id={titleId} className="text-[11px] uppercase tracking-[0.32em] text-white/55">
                    {title}
                  </p>
                ) : (
                  <span />
                )}
              </div>
              <button
                type="button"
                ref={closeButtonRef}
                onClick={onClose}
                className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-white/20 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function cn(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}
