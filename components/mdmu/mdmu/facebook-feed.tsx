import React from "react";

export const FacebookFeed = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
          Latest Facebook Updates
        </h2> */}
        <div className="max-w-7xl mx-auto flex justify-center">
          <iframe
            src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F957653043095420%2F&show_text=true&width=267&t=0"
            width="267"
            height="591"
            style={{ border: "none", overflow: "hidden" }}
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      </div>
    </section>
  );
};
