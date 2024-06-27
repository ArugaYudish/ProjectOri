import React from 'react';
import logo from '../../assets/img/Neko_logo.svg';
import { Facebook } from 'iconsax-react';
import { Youtube } from 'iconsax-react';
import { Instagram } from 'iconsax-react';
import '../../assets/css/navbar.css';

const Footer = () => {
  return (
    <>
      <footer className='set-footer py-5 '>
        <div className='padding-general px-16 sm:px-0 mx-auto sm:flex justify-between  border-gray-700'>
          <div className='flex-1 '>
            <img src={logo} alt='' className='set-img-footer' />
            <div className='py-3 text-justify'>
              Results may not be typical and may vary from person to person. All
              content and information on our website, linked sites, associated
              applications, social media accounts, and other platforms are for
              general informational and educational purposes only. Investing in
              the cryptocurrency market carries inherent risks, including
              potential loss of investment. Past performance is not indicative
              of future results. Your investments are your responbility
            </div>
          </div>
          <div className='flex-1  sm:flex justify-end items-center '>
            <div>
              <div className='flex gap-2'>
                <div className='text-gray-600'>Follow Us: </div>
                <div className='flex gap-2'>
                  <Facebook size='24' color='#0a142f' />
                  <Youtube size='24' color='#0a142f' />

                  <Instagram size='24' color='#0a142f' />
                </div>
              </div>
              <div className='py-4 '>
                <div className='flex gap-2'>
                  <div className='text-gray-600'>Contact Us: </div>
                  <div>support@orineko.io</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='padding-general  sm:px-0  mx-auto py-3 text-gray-600'>
          <div className='border-t py-4 border-gray-700'>
            Neko Copyright @2024 All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
