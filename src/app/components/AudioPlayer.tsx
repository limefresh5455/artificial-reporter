import { CirclePause, CirclePlay } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const formatTime = (time: number) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);
    return [hrs, mins, secs].map(v => String(v).padStart(2, '0')).join(':');
};

const AudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const onLoaded = () => setDuration(audio.duration || 0);
        const onEnded = () => setIsPlaying(false);
        const onPauseAll = () => {
            if (audio && !audio.paused) {
                audio.pause();
                setIsPlaying(false);
            }
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', onLoaded);
        audio.addEventListener('ended', onEnded);
        window.addEventListener('pauseAllAudio', onPauseAll);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', onLoaded);
            audio.removeEventListener('ended', onEnded);
            window.removeEventListener('pauseAllAudio', onPauseAll);
        };
    }, []);

    const togglePlayback = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            // Dispatch global pause event before playing
            window.dispatchEvent(new Event('pauseAllAudio'));
            audio.play();
            setIsPlaying(true);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const newTime = (parseFloat(e.target.value) / 100) * audio.duration;
        audio.currentTime = newTime;
        setProgress(parseFloat(e.target.value));
    };

    return (
        <div className="flex flex-col space-y-2 mt-3">
            <div className="flex items-center space-x-3">


                <button
                    onClick={togglePlayback}
                    className="apply-btn-play bg-green-800 text-white px-3 py-1 rounded flex items-center gap-1 transition"
                >
                    {isPlaying ? (<><CirclePause size={16} /> Pause</>) : (<><CirclePlay size={16} /> Play</>)}
                </button>

            </div>
            {isPlaying ? (
                <div className='grid-col-12 grid'>
                    <span className="text-sm text-gray-700 font-mono col-span-6 text-left">
                        {formatTime(currentTime)}
                    </span>
                    <span className="text-sm text-gray-700 font-mono col-span-6 text-right">
                        {formatTime(duration)}
                    </span>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={0.1}
                        value={progress}
                        onChange={handleSeek}
                        
                        className="w-full accent-[#005025] col-span-12 range-slider__range"
                    />
                </div>
            ) : ''}


            <audio ref={audioRef} src={audioUrl} preload="metadata" />
        </div>
    );
};

export default AudioPlayer;
