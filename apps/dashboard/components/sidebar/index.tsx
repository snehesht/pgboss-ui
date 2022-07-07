import React, { useState, useEffect, Fragment } from 'react';
import packageInfo from '../../../../package.json';
import { Dialog, Transition } from '@headlessui/react';
import {
  CalendarIcon,
  ViewGridIcon,
  ColorSwatchIcon,
  ArchiveIcon,
  CollectionIcon,
  XIcon,
} from '@heroicons/react/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ViewGridIcon, current: true },
  { name: 'Jobs', href: '/jobs', icon: CollectionIcon, current: false },
  { name: 'Schedules', href: '/schedules', icon: CalendarIcon, current: false },
  {
    name: 'Subscriptions',
    href: '/subscriptions',
    icon: ColorSwatchIcon,
    current: false,
  },
  { name: 'Archive', href: '/archive', icon: ArchiveIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/* eslint-disable-next-line */
export interface SidebarProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export function Sidebar(props: SidebarProps) {
  const { sidebarOpen, setSidebarOpen } = props;
  const [currentPath, setCurrentPath] = useState('/dashboard');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleLogout = () => {
    fetch('/api/logout', {
      method: 'POST',
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = '/dashboard';
      }
    });
  };

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <span className="h-8 font-bold text-xl w-auto">
                      PgBoss Dashboard
                    </span>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.href === currentPath
                            ? 'bg-gray-100 text-indigo-500'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-500',
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.href === currentPath
                              ? 'text-indigo-500'
                              : 'text-gray-400 group-hover:text-gray-500',
                            'mr-4 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="h-8 font-bold text-xl w-auto">
                PgBoss Dashboard
              </span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.href === currentPath
                      ? 'bg-indigo-50 text-indigo-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-500',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.href === currentPath
                        ? 'text-indigo-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4 text-sm font-medium text-gray-500 justify-between">
            <span>Version {packageInfo.version}</span>
            <a
              className="text-gray-500 inline-flex items-center"
              href="https://github.com/snehesht/pgbossui"
            >
              pgbossui
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
          <button
            className="px-3 py-3 border-2 bg-indigo-600 text-white uppercase text-sm -mx-1 -my-1"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
