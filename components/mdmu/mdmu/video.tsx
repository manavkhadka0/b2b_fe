import React from "react";

export const Video = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
          Latest Facebook Updates
        </h2> */}
        <div className="max-w-4xl mx-auto">
          <div className="aspect-w-16 aspect-h-9">
            <video
              className="w-full h-full rounded-lg shadow-lg"
              controls
              poster="/video-thumbnail.png" // Add a thumbnail image if you have one
            >
              <source src="/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};
