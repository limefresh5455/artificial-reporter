import Link from "next/link";

const Podcast: React.FC = () => {
    return (
      <div className="bg-[#344252] p-6 mt-5">
        <h2 className="text-xl font-bold mt-5 text-white">Podcast</h2>
        <div className="lg:grid lg:grid-cols-12 gap-6 mt-8">
        <div className="lg:col-span-4">
          <img src="https://odeskthemes.com/10/news-portal/assets/img/podcast.png" alt="Podcast" className="w-[100%] h-[215] object-cover" />
        </div>
        <div className="lg:col-span-8">
           <Link href="" className="text-white">A podcast for lorem ipsum dolor sit amet consec adipis elit Lorem ipsum dolor sit amet consec adipis elit Lorem ipsum dolor sit amet consec adipis elit Lorem ipsum dolor sit amet consec adipis elit
            <br></br><br></br>lorem ipsum dolor sit amet consec adipis elit Lorem ipsum dolor sit amet consec adipis elit</Link>
            <div className="mt-3">
            <Link href="" className="btn btn-secondry">View All Episodes</Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Podcast;
  