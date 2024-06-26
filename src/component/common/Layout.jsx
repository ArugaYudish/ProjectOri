import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar /> {/* Panggil komponen Navbar di sini */}
      <div id='content'>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
