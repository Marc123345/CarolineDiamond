import React, { useState } from 'react';
import { Play, Quote } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

interface VideoTestimonialProps {
  customerName: string;
  location: string;
  project: string;
  videoSrc: string;
  videoPoster: string;
  duration: string;
  category: string;
  quote: string;
  featured?: boolean;
}

export const VideoTestimonial: React.FC<VideoTestimonialProps> = ({
  customerName,
  location,
  project,
  videoSrc,
  videoPoster,
  duration,
  category,
  quote,
  featured = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`card-elevated overflow-hidden group ${featured ? 'ring-2 ring-Color-Light-300' : ''}`}>
      {/* Video Container */}
      <div className="relative h-64 overflow-hidden">
        {isPlaying ? (
          <VideoPlayer
            src={videoSrc}
            poster={videoPoster}
            title={`${customerName} - ${project}`}
            description={`${location} • ${duration}`}
            autoPlay={true}
            className="h-full"
          />
        ) : (
          <div
            className="relative h-full cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-Color-Netural-White hover:bg-Color-Light-300 flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 rounded-full">
                <Play className="h-6 w-6 text-Color-Dark-500 ml-1" />
              </div>
            </div>

            {/* Video Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="typography-caption bg-Color-Light-300 text-Color-Netural-Black px-2 py-1">
                  {category}
                </span>
                <span className="typography-caption bg-black/50 px-2 py-1">
                  {duration}
                </span>
              </div>
              <h4 className="typography-h6 text-Color-Netural-White">{customerName}</h4>
              <p className="typography-caption text-Color-Light-300">{location} • {project}</p>
            </div>
          </div>
        )}
      </div>

      {/* Testimonial Content */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Quote className="h-5 w-5 text-Color-Light-300 mr-2" />
          <span className="typography-body font-medium text-Color-Dark-500">{customerName}</span>
        </div>
        
        <blockquote className="typography-body text-Color-Gray-700 italic mb-4">
          "{quote}"
        </blockquote>
        
        <div className="flex items-center justify-between">
          <span className="typography-caption text-Color-Light-300">{project}</span>
          <button
            onClick={() => setIsPlaying(true)}
            className="btn--text text-Color-Light-300 hover:text-Color-Dark-500"
          >
            <span>Bekijk Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};