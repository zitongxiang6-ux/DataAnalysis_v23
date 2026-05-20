import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function Layout({ children, className, contentClassName }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Sync sidebar width CSS variable
  useEffect(() => {
    const width = collapsed ? 64 : 240;
    document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
  }, [collapsed]);

  return (
    <div className={cn('min-h-[100dvh] bg-page-bg', className)}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      {/* Topbar */}
      <Navbar />

      {/* Main Content */}
      <main
        className={cn(
          'pt-topbar min-h-[100dvh] flex flex-col transition-all duration-300',
          contentClassName
        )}
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        <div className="flex-1 px-6 py-6">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
