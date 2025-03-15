import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isLoggedIn = false }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <ParticleBackground />
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="flex-grow pt-20 px-4 overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
