"use client";

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
         adsbygoogle: any;
    }
}

const AdBanner = () => {
  const insRef = useRef<HTMLModElement>(null);
  const adPushed = useRef(false);

  useEffect(() => {
    // We only want to push the ad once.
    // If the ref is there and we haven't pushed before, push the ad.
    if (insRef.current && !adPushed.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adPushed.current = true; // Mark as pushed
        } catch (err) {
          console.error(err);
        }
    }
  }, []);

  return (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-4648414963251970"
      data-ad-slot="1341194686"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdBanner;
