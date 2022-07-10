import { MenuIcon } from '@heroicons/react/outline';

/* eslint-disable-next-line */
export interface SidebarButtonProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export function SidebarButton(props: SidebarButtonProps) {
  const { setSidebarOpen } = props;
  return (
    <>
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}

export default SidebarButton;
