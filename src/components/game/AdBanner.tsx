"use client";

import { useEffect } from 'react';

declare global {
    interface Window {
         adsbygoogle: any;
    }
}

const AdBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className="w-full text-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-4648414963251970"
          data-ad-slot="1341194686"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
    </div>
  );
};

export default AdBanner;
