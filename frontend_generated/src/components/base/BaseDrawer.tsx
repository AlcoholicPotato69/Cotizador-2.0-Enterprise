import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '../../utils';

export interface BaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | 'full';
}

export function BaseDrawer({ isOpen, onClose, title, children, footer, size = 'lg' }: BaseDrawerProps) {
  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full sm:max-w-3xl'
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className={cn("pointer-events-auto w-screen", sizeClasses[size])}>
                  <div className="flex h-full flex-col bg-bg-surface shadow-xl">
                    <div className="flex items-center justify-between px-4 py-4 sm:px-6 border-b border-border-base">
                      <Dialog.Title className="text-lg font-semibold text-text-primary">
                        {title}
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-md bg-transparent text-text-secondary hover:text-text-primary focus:outline-none"
                        onClick={onClose}
                      >
                        <span className="sr-only">Cerrar panel</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto">
                      {children}
                    </div>
                    {footer && (
                      <div className="flex flex-shrink-0 justify-end px-4 py-4 sm:px-6 border-t border-border-base">
                        {footer}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
