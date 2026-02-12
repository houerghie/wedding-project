export default function HeroSection({ guest }) {
  return (
    <header className="hero">
      <div className="hero-media" aria-hidden="true">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-overlay" aria-hidden="true"></div>

      <div className="brand">The Rose &amp; Forever</div>
      <nav className="nav">
        <a href="#story">Story</a>
        <a href="#schedule">Program</a>
        <a href="#gallery">Moments</a>
        <a href="#rsvp">RSVP</a>
      </nav>

      <div className="hero-center">
        <p className="hero-line">Dear {guest},</p>
        <h1>
          <span>Julie Carlin</span>
          <span className="amp">&amp;</span>
          <span>Karlox Gebin</span>
        </h1>
        <p className="hero-sub">We invite you to celebrate our wedding day.</p>
        <button className="primary hero-cta" type="button">
          Make Reservation
        </button>
      </div>

      <div className="hero-deco">
        <div className="leaf left"></div>
        <div className="leaf right"></div>
        <div className="seal-mark">April 20, 2026</div>
      </div>
    </header>
  );
}
