import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_VIDEO_SRC_MOBILE = "/landing/test1.mp4";
const INTRO_VIDEO_SRC_LARGE = "/landing/test2.mp4";
const INTRO_TRANSITION_START_S = 1;

export default function CoverSection({ isTransitioning, hasStarted, onStart, onVideoEnd }) {
  const videoRef = useRef(null);
  const handleStartRef = useRef(() => {});
  const isStartingRef = useRef(false);
  const hasHandledErrorRef = useRef(false);
  const hasTriggeredEndRef = useRef(false);
  const [videoErrored, setVideoErrored] = useState(false);
  const [introVideoSrc, setIntroVideoSrc] = useState(INTRO_VIDEO_SRC_LARGE);

  const fallbackToInvite = useCallback(() => {
    if (!hasStarted && !isTransitioning) {
      onStart();
      onVideoEnd();
    }
  }, [hasStarted, isTransitioning, onStart, onVideoEnd]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateSource = (event) => {
      setIntroVideoSrc(event.matches ? INTRO_VIDEO_SRC_MOBILE : INTRO_VIDEO_SRC_LARGE);
    };

    updateSource(mediaQuery);
    mediaQuery.addEventListener("change", updateSource);

    return () => mediaQuery.removeEventListener("change", updateSource);
  }, []);

  const handleStart = useCallback(() => {
    if (hasStarted || isTransitioning || isStartingRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    if (videoErrored) {
      onStart();
      onVideoEnd();
      return;
    }

    isStartingRef.current = true;

    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt
        .then(() => {
          isStartingRef.current = false;
          onStart();
        })
        .catch((error) => {
          isStartingRef.current = false;
          console.error("Intro video playback failed.", error);
          setVideoErrored(true);
          fallbackToInvite();
        });
      return;
    }

    isStartingRef.current = false;
    onStart();
  }, [fallbackToInvite, hasStarted, isTransitioning, onStart, onVideoEnd, videoErrored]);

  useEffect(() => {
    handleStartRef.current = handleStart;
  }, [handleStart]);

  useEffect(() => {
    if (hasStarted || isTransitioning) return undefined;

    const autoStartTimeout = window.setTimeout(() => {
      handleStartRef.current();
    }, 3000);

    return () => {
      window.clearTimeout(autoStartTimeout);
    };
  }, [hasStarted, isTransitioning, introVideoSrc]);

  const handleEnded = () => {
    if (hasTriggeredEndRef.current) return;
    hasTriggeredEndRef.current = true;
    isStartingRef.current = false;
    onVideoEnd();
  };

  const handleError = () => {
    if (hasHandledErrorRef.current) return;
    hasHandledErrorRef.current = true;
    isStartingRef.current = false;
    setVideoErrored(true);
    fallbackToInvite();
  };

  const handleLoadedData = () => {
    const video = videoRef.current;
    if (!video || hasStarted) return;
    if (video.currentTime > 0) return;

    try {
      video.currentTime = 0.01;
      video.pause();
    } catch {
      // Browsers that block timeline seek here can safely ignore this.
    }
  };

  const handleTimeUpdate = () => {
    if (hasTriggeredEndRef.current) return;

    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    if (video.currentTime >= INTRO_TRANSITION_START_S) {
      hasTriggeredEndRef.current = true;
      onVideoEnd();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleStart();
    }
  };

  const coverClass = ["cover", isTransitioning ? "is-transitioning" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="cover" className={coverClass} aria-label="Invitation intro video">
      <div
        className="intro-video-shell"
        role="button"
        tabIndex={0}
        aria-label="Play intro video"
        onClick={handleStart}
        onKeyDown={handleKeyDown}
      >
        <video
          key={introVideoSrc}
          ref={videoRef}
          className="intro-video"
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={handleLoadedData}
          onError={handleError}
        >
          <source src={introVideoSrc} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
