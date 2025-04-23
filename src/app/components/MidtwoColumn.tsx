import React from "react";
import Popular from "./Popular";
import InsightsTags from "./InsightsTags";
import NewsletterAd from "./NewsletterAd";
import Podcast from "./Podcast";
import Latest from "./Latest";


const MidtwoColumn: React.FC = () => {
    return (           
      
        <div className="lg:grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Popular />
          <Podcast />
          <Latest />
        </div>
        <div className="lg:col-span-4">
        <NewsletterAd />
        <div className="mt-6">
        <InsightsTags />
        </div>
                  
        </div>
      </div> 
     
    );
  };
  
  export default MidtwoColumn;