import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="sm:flex min-h-screen">
        <Sidebar />

        <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
          <Header />

          <div className="container mx-auto mt-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;