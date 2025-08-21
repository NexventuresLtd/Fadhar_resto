import React, { useState, useEffect } from 'react';
import NavBar from '../components/HomePage/NavBar';
import Hero from '../components/HomePage/Hero';
import Footer from '../components/Shared/Footer';
import OurMenu from '../components/HomePage/OurMenu';
import BestDel from '../components/HomePage/BestDel';
import AboutUS from '../components/HomePage/AboutUS';


const Homepage: React.FC = () => {

 



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <NavBar />
<div className="pt-20"></div>
      <Hero />
      <OurMenu />
      <AboutUS />
      <BestDel />

      <Footer />
    </div>
  );
};

export default Homepage;