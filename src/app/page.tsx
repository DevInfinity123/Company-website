"use client";
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const cursorTrailsRef = useRef<HTMLDivElement[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showMainContent, setShowMainContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!container || !canvas || !video) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Video playback handling
    const handleVideoPlayback = () => {
      if (video.paused || video.ended) {
        video.play().catch(error => {
          console.warn('Video playback failed:', error);
        });
      }
    };

    // Handle video events
    video.addEventListener('ended', handleVideoPlayback);
    video.addEventListener('pause', handleVideoPlayback);
    video.addEventListener('stalled', handleVideoPlayback);
    video.addEventListener('waiting', handleVideoPlayback);
    video.addEventListener('error', handleVideoPlayback);

    // Initial video setup
    video.load();
    video.play().catch(error => {
      console.warn('Initial video playback failed:', error);
    });

    // Set canvas size
    const resizeCanvas = () => {
      // Set canvas size to match device pixel ratio for better quality
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Scale context to match device pixel ratio
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let time = 0;
    let frameCount = 0;
    let lastFrameTime = 0;
    
    // Spring animation parameters
    const springStrength = 0.08;
    const friction = 0.9;
    let velocityX = 0;
    let velocityY = 0;
    
    // Draw frame
    const drawFrame = (currentTime: number) => {
      // Calculate delta time for smooth animation
      const deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;

      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update spring animation with delta time
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      velocityX += dx * springStrength * (deltaTime / 16); // Normalize to 60fps
      velocityY += dy * springStrength * (deltaTime / 16);
      
      velocityX *= friction;
      velocityY *= friction;
      
      currentX += velocityX;
      currentY += velocityY;
      
      // Draw video frame with high quality settings
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.scale(1.05, 1.05);
        // Use imageSmoothingEnabled and imageSmoothingQuality for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(video, -canvas.width/2, -canvas.height/2, canvas.width * 2, canvas.height * 2);
        ctx.restore();
      }

      // Update time with delta time for smooth animation
      time += deltaTime * 0.001;
      frameCount++;

      // Request next frame
      requestAnimationFrame(drawFrame);
    };

    // Handle mouse movement with throttling for smoother performance
    let lastMouseMove = 0;
    const handleMouseMove = (event: MouseEvent) => {
      const currentTime = performance.now();
      if (currentTime - lastMouseMove < 16) return; // Limit to ~60fps
      lastMouseMove = currentTime;

      mouseX = event.clientX;
      mouseY = event.clientY;
      targetX = (event.clientX / window.innerWidth - 0.5) * 30;
      targetY = (event.clientY / window.innerHeight - 0.5) * 30;
    };

    // Start animation with timestamp
    requestAnimationFrame(drawFrame);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      video.removeEventListener('ended', handleVideoPlayback);
      video.removeEventListener('pause', handleVideoPlayback);
      video.removeEventListener('stalled', handleVideoPlayback);
      video.removeEventListener('waiting', handleVideoPlayback);
      video.removeEventListener('error', handleVideoPlayback);
      video.pause();
    };
  }, []);

  useEffect(() => {
    // Initial loading animation
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Show main content after loading animation
      setTimeout(() => {
        setShowMainContent(true);
      }, 1000);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    // Rotate through text phrases with improved smooth transition
    if (!isLoading && showMainContent) {
      const textInterval = setInterval(() => {
        if (!isAnimating) {
          setIsAnimating(true);
          
          // Fade out current text smoothly
          const textElement = document.querySelector('.headline-text');
          if (textElement) {
            textElement.classList.add('animate-fade-out');
            
            // After fade out, change text and fade in
            setTimeout(() => {
              setCurrentTextIndex((prev) => (prev + 1) % 5);
              
              // Reset animation class and fade in
              textElement.classList.remove('animate-fade-out');
              textElement.classList.add('animate-fade-in');
              
              // Animation complete
              setTimeout(() => {
                textElement.classList.remove('animate-fade-in');
                setIsAnimating(false);
              }, 800);
            }, 800);
          }
        }
      }, 5000); // Show each phrase for 5 seconds
      
      return () => clearInterval(textInterval);
    }
  }, [isLoading, showMainContent, isAnimating]);
  
  // Language text content
  const textContent = {
    en: {
      headlines: [
        "Towards Infinity",
        "Product Building Studio",
        "Transforming Ideas into Intelligent Solutions",
        "Turning Concepts into Brilliance",
      ],
      scrollDown: "Scroll Down",
      work: "WORK",
      manifesto: "MANIFESTO", 
      saigonSouls: "SAIGON SOULS",
      team: "TEAM",
      contact: "CONTACT"
    },
    ta: {
      headlines: [
        "டுவர்ட்ஸ் இன்ஃபினிட்டி",
        "தயாரிப்பு ஸ்டுடியோ கட்டிடம்",
        "யோசனைகளை அறிவார்ந்த தீர்வுகளாக மாற்றுதல்",
        "கருத்துக்களை புத்திசாலித்தனமாக மாற்றுதல்",
      ],
      scrollDown: "கீழே உருட்டவும்",
      work: "பணிகள்",
      manifesto: "அறிக்கை",
      saigonSouls: "சைகான் ஆன்மாக்கள்",
      team: "குழு",
      contact: "தொடர்பு"
    }
  };
  
  return (
    <main ref={containerRef} className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white font-[400]">
      {/* Font imports in head */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@300;400;500&display=swap');
        
        body {
          font-family: 'DM Sans', 'Noto Sans Tamil', sans-serif;
        }
        
        .headline-font {
          font-family: 'Instrument Sans', 'Noto Sans Tamil', sans-serif;
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        
        .nav-font {
          font-family: 'DM Sans', 'Noto Sans Tamil', sans-serif;
          letter-spacing: 0.06em;
        }
        
        [lang="ta"] {
          font-family: 'Noto Sans Tamil', sans-serif;
          line-height: 1.4;
        }
      `}</style>
      
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl headline-font mb-4">
              Hello <span className="italic">Voyager</span>
            </h1>
            <div className="w-32 h-1 bg-white/20 mx-auto overflow-hidden">
              <div className="h-full bg-white animate-loading-bar"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-opacity duration-1000 ${showMainContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Scroll Down Indicator */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
          <div className="flex flex-col items-center gap-2">
            <span 
              className="text-[9px] nav-font tracking-[0.25em] uppercase opacity-60"
              lang={language === 'ta' ? 'ta' : undefined}
            >
              {textContent[language].scrollDown}
            </span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center relative">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-lg font-normal nav-font tracking-wider">
              TowardsInfinity <span className="opacity-60 ml-1">.Inc</span>
            </a>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Language Selector */}
            <button 
              onClick={() => setLanguage('en')} 
              className={`text-xs nav-font transition-opacity ${language === 'en' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('ta')} 
              className={`text-xs nav-font transition-opacity ${language === 'ta' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
              lang="ta"
            >
              தமிழ்
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full border border-white/20"
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M4 8h16M4 16h16" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Desktop Right Side Navigation */}
        <div className="hidden md:flex fixed top-1/2 right-12 -translate-y-1/2 z-50 flex-col gap-6 text-xs">
          <a 
            href="#" 
            className="nav-font opacity-60 hover:opacity-100 transition-opacity tracking-widest"
            lang={language === 'ta' ? 'ta' : undefined}
          >
            {textContent[language].work}
          </a>
          <a 
            href="#" 
            className="nav-font opacity-60 hover:opacity-100 transition-opacity tracking-widest"
            lang={language === 'ta' ? 'ta' : undefined}
          >
            {textContent[language].manifesto}
          </a>
          <a 
            href="#" 
            className="nav-font opacity-60 hover:opacity-100 transition-opacity tracking-widest"
            lang={language === 'ta' ? 'ta' : undefined}
          >
            {textContent[language].saigonSouls}
          </a>
          <a 
            href="#" 
            className="nav-font opacity-60 hover:opacity-100 transition-opacity tracking-widest"
            lang={language === 'ta' ? 'ta' : undefined}
          >
            {textContent[language].team}
          </a>
          <a 
            href="#" 
            className="nav-font opacity-60 hover:opacity-100 transition-opacity tracking-widest"
            lang={language === 'ta' ? 'ta' : undefined}
          >
            {textContent[language].contact}
          </a>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`fixed inset-0 bg-black/90 z-40 transition-transform duration-300 flex items-center justify-center ${mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex flex-col items-center gap-8 text-lg">
            <a 
              href="#" 
              className="opacity-80 hover:opacity-100 transition-opacity"
              lang={language === 'ta' ? 'ta' : undefined}
            >
              {textContent[language].work}
            </a>
            <a 
              href="#" 
              className="opacity-80 hover:opacity-100 transition-opacity"
              lang={language === 'ta' ? 'ta' : undefined}
            >
              {textContent[language].manifesto}
            </a>
            <a 
              href="#" 
              className="opacity-80 hover:opacity-100 transition-opacity"
              lang={language === 'ta' ? 'ta' : undefined}
            >
              {textContent[language].saigonSouls}
            </a>
            <a 
              href="#" 
              className="opacity-80 hover:opacity-100 transition-opacity"
              lang={language === 'ta' ? 'ta' : undefined}
            >
              {textContent[language].team}
            </a>
            <a 
              href="#" 
              className="opacity-80 hover:opacity-100 transition-opacity"
              lang={language === 'ta' ? 'ta' : undefined}
            >
              {textContent[language].contact}
            </a>
          </div>
        </div>

        {/* Main Content with Improved Transition */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-30 w-full max-w-5xl">
          <h1 
            className="headline-text headline-font text-[2.4rem] md:text-[3.8rem] leading-tight transition-all duration-800 ease-in-out pb-4"
            style={{
              textShadow: '0 0 15px rgba(255, 255, 255, 0.15)'
            }}
            lang={language === 'ta' ? 'ta' : undefined}
          >
            {textContent[language].headlines[currentTextIndex]}
          </h1>
        </div>

        {/* Hidden Video Element with high quality settings */}
        <video
          ref={videoRef}
          className="hidden"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{ opacity: 0 }}
          onLoadedData={(e) => {
            const video = e.currentTarget;
            video.play().catch(error => {
              console.warn('Video playback failed:', error);
            });
          }}
        >
          <source src="/videos/background.webm" type="video/webm" />
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Background Canvas with high quality settings */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{
            filter: "brightness(0.85) contrast(1.1) saturate(1.3)",
            willChange: "transform",
            imageRendering: "crisp-edges",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-70 z-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-transparent opacity-70 z-20"></div>

        {/* Pointer */}
        <div ref={pointerRef} className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[60]" style={{ transform: 'translate(-50%, -50%)', willChange: 'transform' }}>
          <div className="pointer-inner absolute inset-0 flex items-center justify-center">
            <div className="absolute w-16 h-16 pointer-events-none" style={{
              background: 'rgba(120, 220, 255, 0.15)',
              backdropFilter: 'blur(4px)',
              clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 10px rgba(120, 220, 255, 0.3)'
            }} />
            <div className="absolute w-10 h-10 rounded-full" style={{
              background: 'radial-gradient(circle, rgba(180,255,255,0.2) 0%, rgba(100,200,255,0.1) 70%, rgba(80,180,255,0) 100%)',
              backdropFilter: 'blur(3px)',
              boxShadow: 'inset 0 0 3px rgba(255, 255, 255, 0.4)'
            }} />
            <div className="absolute w-4 h-4 pointer-events-none" style={{
              background: 'rgba(220, 255, 255, 0.8)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              boxShadow: '0 0 8px 2px rgba(180, 255, 255, 0.6)',
              transform: 'rotate(45deg)'
            }} />
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
        
        @keyframes loadingBar {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        
        .animate-loading-bar {
          animation: loadingBar 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .animate-fade-out {
          animation: fadeOut 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </main>
  );
}