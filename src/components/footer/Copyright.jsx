import React from 'react';

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const Copyright = () => {
  const currentYear = getCurrentYear();

  return (
    <footer className="fixed bottom-0 w-full bg-gray-800 text-white text-center p-4">
      <p className='text-metal'>1997 - {currentYear} &copy; <a href="https://www.zendevx.com" target="_blank" rel="noopener noreferrer">ZenDevX</a></p>
    </footer>
  );
};

export default Copyright;
