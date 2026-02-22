import { useRef, useState } from "react";

const INTRO_VIDEO_SRC = "/landing/test1.mov";

export default function CoverSection({ isTransitioning, hasStarted, onStart, onVideoEnd }) {
  const videoRef = useRef(null);
  const isStartingRef = useRef(false);
  const hasHandledErrorRef = useRef(false);
  const [videoErrored, setVideoErrored] = useState(false);

  const handleStart = () => {
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
        });
      return;
    }

    isStartingRef.current = false;
    onStart();
  };

  const handleEnded = () => {
    isStartingRef.current = false;
    onVideoEnd();
  };

  const handleError = () => {
    if (hasHandledErrorRef.current) return;
    hasHandledErrorRef.current = true;
    isStartingRef.current = false;
    setVideoErrored(true);

    if (!hasStarted && !isTransitioning) {
      onStart();
      onVideoEnd();
    }
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
          ref={videoRef}
          className="intro-video"
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          onLoadedData={handleLoadedData}
          onError={handleError}
        >
          <source src={INTRO_VIDEO_SRC} />
        </video>
      </div>
    </section>
  );
}
