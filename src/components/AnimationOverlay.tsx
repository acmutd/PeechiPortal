"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import loadAnimation from '@/public/cgi/logogif.gif';

const AnimationOverlay: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imageRef.current) {
            imageRef.current.src = '';
            imageRef.current.src = loadAnimation.src;
        }

        if (isLoaded) {
            const animationTimer = setTimeout(() => {
                // Start fading out
                setOpacity(0);
            }, 5400);

            const visibilityTimer = setTimeout(() => {
                // Hide component after fade out
                setIsVisible(false);
            }, 6400); // 5400ms (animation) + 1000ms (fade out)

            return () => {
                clearTimeout(animationTimer);
                clearTimeout(visibilityTimer);
            };
        }
    }, [isLoaded]);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out"
             style={{ opacity: opacity }}>
            <Image
                ref={imageRef}
                src={loadAnimation}
                alt="Loading animation"
                width={800}
                height={1422}
                onLoad={handleImageLoad}
                priority
                unoptimized={true}
            />
        </div>
    );

}


export default AnimationOverlay;