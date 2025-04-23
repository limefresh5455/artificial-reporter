const NewsletterAd: React.FC = () => {
    return (
      <div className="">
        <div className="">
        <div className="flex items-center justify-between bg-light py-3 px-4 mb-3 bgh3">
        <h3 className="text-2xl font-medium">Newsletter</h3>       
      </div>
      <div className="bg-white py-5">
          <p className="p-4">Aliqu justo et labore at eirmod justo sea erat diam dolor diam vero kasd</p>
        <div className="flex p-4 pt-0">
        <div className="input-group w-100 flex">
            <input type="text" className="form-control form-control-lg border-[1px] pl-3 border-gray-200 w-[200px]" placeholder="Your Email" />
            <div className="input-group-append">
                <button className="btn-primary btnsign">Sign Up</button>
            </div>
        </div>
        </div>
        </div>


        <div className="mt-6">         
          <img src="https://odeskthemes.com/10/news-portal/assets/img/news-500x280-4.png" alt="Ad" className="" />
        </div>
        </div>
      </div>
    );
  };
  
  export default NewsletterAd;
  