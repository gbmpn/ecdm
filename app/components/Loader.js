'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Loader() {
  const [percentage, setPercentage] = useState(0);
  const [isOff, setIsOff] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of images from public folder
  const images = Array.from({ length: 17 }, (_, i) => `/${String(i + 1).padStart(2, '0')}.webp`);

  useEffect(() => {
    const duration = 2000; // 3 seconds
    const startTime = Date.now();
    const targetPercentage = 100;

    // Image cycling animation
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 150); // Change image every 150ms for GIF-like effect

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentPercentage = Math.floor(easeOutQuart * targetPercentage);
      
      setPercentage(currentPercentage);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Start animation
    requestAnimationFrame(animate);

    // Hide loader after 3 seconds
    const hideTimer = setTimeout(() => {
      setIsOff(true);
      clearInterval(imageInterval); // Stop image cycling
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearInterval(imageInterval);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <section className={`loader ${isOff ? 'is-off' : ''}`}>
       <Image
            src={images[currentImageIndex]}
            alt="loader bg"
            fill
            style={{
            objectFit: 'cover',
            objectPosition: 'center'
            }}
            className='bg-img'
        />
        <div className="row">
            <span>Loading...</span>
            <span>ecdm</span>
            <span>{percentage}%</span>

        </div>
    </section>
 
  );
}
