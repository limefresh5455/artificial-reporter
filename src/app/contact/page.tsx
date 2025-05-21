
import { Phone, Navigation, House } from 'lucide-react';


export default function Contact() {
    return (
        <section className="contact py-4 lg:py-12">
            <div className="container mx-auto p-4 lg:p-8">
                <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 lg:gap-8">

                    <div className="contact_left">
                        <h2 className="section_heading text-2x1 lg:text-3xl font-semibold mb-3">Contact Us</h2>
                        <div className="links mt-5">
                            <ul>
                                <li>
                                    <a href="#" className="flex items-center space-x-2">
                                        <span className="icon-contact"><Phone size={16} color='#fff' /></span>
                                        <span>123-456-789</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center space-x-2">
                                        <span className="icon-contact"><Navigation size={16} color='#fff' /></span>
                                        <span>example@gmail.com</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center space-x-2">
                                        <span className="icon-contact"><House size={16} color='#fff' /></span>
                                        <span>13th Street 47 W 13th St, New York, NY 10011, USA</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="form">
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <input type="text" placeholder="First Name" className="form-control w-full px-4 py-2 border rounded-md mb-4" />
                            </div>
                            <div className="col-span-1">
                                <input type="text" placeholder="Last Name" className="form-control w-full px-4 py-2 border rounded-md mb-4" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <input type="text" placeholder="Phone Number" className="form-control w-full px-4 py-2 border rounded-md mb-4" />
                            </div>
                            <div className="col-span-1">
                                <input type="email" placeholder="Email Address" className="form-control w-full px-4 py-2 border rounded-md mb-4" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="col-span-1">
                                <textarea id="message" name="message" rows={5} placeholder="Message" className="form-control w-full px-4 py-2 border rounded-md mb-4"></textarea>
                            </div>
                        </div>
                        <button className=" bg-[#134c90] text-white py-2 px-6 rounded-md hover:bg-[#d21118]" >Submit</button>
                    </div>
                </div>
            </div>
        </section>

    );
}
