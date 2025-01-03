// components/ShareButtons.tsx
"use client"; // Enable client-side rendering

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "next-share";

const ShareButtons = ({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description?: string;
}) => {
  return (
    <div className="flex space-x-4">
      <FacebookShareButton
        url={url}
        quote={title}
        hashtag={"#YourEventHashtag"}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton
        url={url}
        title={title}
        hashtags={["YourEventHashtag"]}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton
        url={url}
        title={title}
        summary={description}
        source="YourEventSource"
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );
};

export default ShareButtons;
