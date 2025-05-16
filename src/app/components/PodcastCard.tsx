import { PortableText, toPlainText } from "@portabletext/react";
import { ExternalLink, Download, CirclePlay, CirclePause } from 'lucide-react';
import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import SharePopup from "./SharePopup";

const PodcastCard = ({ podcast }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const plainText = podcast.body ? toPlainText(podcast.body.slice(0, 1)) : "";
    const previewText = plainText.slice(0, 200);
    console.log(podcast)

    return (
        <div key={podcast._id} className="podcast-card bg-white rounded-lg border border-gray-200 p-5 flex flex-col md:flex-row items-start gap-4">
            <img src={podcast?.coverImage?.asset.url} className="w-50 h-full object-cover rounded" alt="Podcast Cover" />
            <div className="flex-1">
                <a href="#" className="text-xl font-semibold text-[#000] hover:text-[#31795a]">{podcast.title}</a>

                <div className="  mt-2">
                    {podcast.audioFile ? (
                        <AudioPlayer audioUrl={podcast.audioFile?.asset.url} title={podcast.title} />
                    ) :
                        podcast.embedCode ? <div dangerouslySetInnerHTML={{ __html: podcast.embedCode }} /> : ''
                    }
                </div>

                {/* <div className="text-sm mt-3">
                    {podcast.body ? toPlainText(podcast.body.slice(0, 1)).slice(0, 200) : ''}...
                </div> */}
                <div className="text-sm mt-2">
                    {isExpanded ? (
                        podcast.body ? <PortableText value={podcast.body} /> : ""
                    ) : (
                        <>
                            {previewText}
                            {plainText.length > 200 && "..."}
                        </>
                    )}

                    {plainText.length > 200 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-blue-600 hover:underline ml-1"
                        >
                            {isExpanded ? "Read Less" : "Read More"}
                        </button>
                    )}
                </div>

            </div>
            <div className=" flex flex-col  gap-1">
                {/* <a href={podcast.platformUrl} className="apply-btn  px-5 py-1 rounded-2xl inline-flex items-center gap-2">Share <ExternalLink size={16} /></a> */}
                <SharePopup platformUrl={podcast.platformUrl} />


                {/* <a href="#" className="apply-btn  px-5 py-1 rounded-2xl inline-flex items-center gap-2">Download <Download size={16} /></a> */}
            </div>
        </div>
    );

};

export default PodcastCard;