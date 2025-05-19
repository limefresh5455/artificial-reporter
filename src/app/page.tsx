import React from "react";
import Hero from "./components/Hero";
import HeroSidebar from "./components/HeroSidebar";
import TopStories from "./components/TopStories";
import Features from "./components/Features";
import MidtwoColumn from "./components/MidtwoColumn";
import PopupModal from './components/PopupModal';

const Home: React.FC = () => {
    return (

        <>
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
            <PopupModal />
        </>
    );
};

export default Home;
