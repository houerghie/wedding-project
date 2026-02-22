function formatEventDateTime(dateTime) {
  const dt = new Date(dateTime);
  if (Number.isNaN(dt.getTime())) {
    return "Date to be confirmed";
  }

  const datePart = dt.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const timePart = dt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  return `${datePart} - ${timePart}`;
}

const MAIN_HERO_VIDEO = "/videos/7b4422c9-e483-43c3-a91d-2659f249f898.mp4";
const BACKDROP_VIDEOS = [
  "/videos/024df4ac-b569-4668-8449-0e9c2e0f4d0f.mp4",
  "/videos/29023b6c-492c-41a3-9a06-12483b43841b.mp4",
  "/videos/2cf23b77-df68-4665-a60e-1d640c53250b.mp4",
  "/videos/b2e0a0e8-f879-43c3-9539-40cbaacebeff.mp4",
  "/videos/eed371aa-a02a-4ab0-9a6c-61e448f91b3a.mp4",
  "/videos/fa5cc28f-606d-48dc-b27a-88efd638afc0.mp4"
];

export default function HeroSection({ guest, eventDateTime }) {
  return (
    <header className="hero">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-backdrop-grid">
          {BACKDROP_VIDEOS.map((src) => (
            <div className="hero-backdrop-tile" key={src}>
              <video
                className="hero-backdrop-video"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
              >
                <source src={src} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
        
      </div>
      <div className="hero-overlay" aria-hidden="true"></div>

      <div className="hero-head">
        <div className="brand">Now &amp; Forever</div>
      </div>

      <div className="hero-center">
        {/* <div className="brand">Now &amp; Forever</div> */}
        <p className="hero-line">Dear {guest},</p>
        <p className="hero-line">You are invited to the wedding of</p>
        <h1>
          <span>Khawla Hadj Taieb</span>
          <span className="amp">&amp;</span>
          <span>Ahmed Yassine Trabelsi</span>
        </h1>
        <p className="hero-sub">
          And your presence is mandatory!
        </p>
      </div>

      <div className="hero-deco">
        <div className="seal-mark">{formatEventDateTime(eventDateTime)}</div>
      </div>

      <a className="hero-scroll" href="#event-details" aria-label="Scroll to next section">
        <span aria-hidden="true">&darr;</span>
      </a>
    </header>
  );
}
