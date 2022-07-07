import React, { useState } from 'react';
import { Sidebar } from '../sidebar';
import { SidebarButton } from '../sidebar-button';

/* eslint-disable-next-line */
export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout(props: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { children } = props;
  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SidebarButton
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main>{children}</main>
    </>
  );
}

export default Layout;
