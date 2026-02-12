function formatEventDateTime(dateTime) {
  const dt = new Date(dateTime);
  if (Number.isNaN(dt.getTime())) {
    return "Date a definir";
  }

  const datePart = dt.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const timePart = dt.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return `${datePart} - ${timePart}`;
}

export default function HeroSection({ guest, eventDateTime }) {
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

      <div className="brand">La Rose &amp; Pour Toujours</div>
      <nav className="nav">
        <a href="#story">Histoire</a>
        <a href="#schedule">Programme</a>
        <a href="#gallery">Moments</a>
        <a href="#rsvp">RSVP</a>
      </nav>

      <div className="hero-center">
        <p className="hero-line">Cher/Chere {guest},</p>
        <h1>
          <span>Khawla ben hadj taieb</span>
          <span className="amp">&amp;</span>
          <span>Ahmed Yassine Trabelsi</span>
        </h1>
        <p className="hero-sub">Nous vous invitons a celebrer notre mariage.</p>
        <button className="primary hero-cta" type="button">
          Confirmer votre presence
        </button>
      </div>

      <div className="hero-deco">
        <div className="leaf left"></div>
        <div className="leaf right"></div>
        <div className="seal-mark">{formatEventDateTime(eventDateTime)}</div>
      </div>
    </header>
  );
}
