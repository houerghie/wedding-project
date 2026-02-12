export default function StorySection() {
  return (
    <section id="story" className="block">
      <h2>Un decor unique, un programme inoubliable</h2>
      <p>
        Rejoignez-nous a Bizerte, Tunisie, a 19:00. La soiree commence avec un
        accueil, suivi du diner a 20:00 puis de la celebration a 22:00.
      </p>
      <div className="photo-grid">
        <div className="photo round media-box">
          <img
            className="media-fill"
            src="/images/2b2bf153-f9ef-465b-ad44-0cb9456da796.jpg"
            alt="Couple - moment 1"
            loading="lazy"
          />
        </div>
        <div className="photo round media-box">
          <img
            className="media-fill"
            src="/images/ff26336b-a10d-47c2-8089-cad0285bfd85.jpg"
            alt="Couple - moment 2"
            loading="lazy"
          />
        </div>
        <div className="photo round media-box">
          <img
            className="media-fill"
            src="/images/2b2bf153-f9ef-465b-ad44-0cb9456da796.jpg"
            alt="Couple - portrait"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
