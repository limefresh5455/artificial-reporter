import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HeroSidebar from "./components/HeroSidebar";
import TopStories from "./components/TopStories";
import Features from "./components/Features";
import MidtwoColumn from "./components/MidtwoColumn";
import Footer from "./components/Footer";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <div className="">
      <Header />
      </div>

      <main className="flex-1 container mx-auto px-20 py-6 space-y-10">
        
      <div className="lg:grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Hero />
        </div>
        <div className="lg:col-span-4">
          <HeroSidebar />
        </div>
      </div>
       
        <TopStories />
        <Features />       
        <MidtwoColumn />        
       
      </main>

      <Footer />
    </div>
  );
};

export default Home;
