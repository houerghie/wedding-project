function getEmbedMapUrl(mapUrl) {
  if (!mapUrl) {
    return "https://www.google.com/maps?q=Bizerte%2C%20Tunisia&output=embed";
  }

  try {
    const url = new URL(mapUrl);
    const q = url.searchParams.get("q");
    if (q) {
      return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    }
    if (url.hostname.includes("google.com") && url.pathname.includes("/maps/embed")) {
      return mapUrl;
    }
  } catch (error) {
    // Fallback to default embedded map URL.
  }

  return "https://www.google.com/maps?q=Bizerte%2C%20Tunisia&output=embed";
}

export default function EventDetailsSection({ countdown, venue }) {
  const destinationName = venue?.name || "[Destination Name]";
  const countdownItems = [
    { label: "Jours", value: countdown?.days ?? 0 },
    { label: "Heures", value: countdown?.hours ?? 0 },
    { label: "Minutes", value: countdown?.minutes ?? 0 },
    { label: "Secondes", value: countdown?.seconds ?? 0 }
  ];
  const mapLink = venue?.mapUrl || "https://maps.google.com/?q=Bizerte%2C%20Tunisia";
  const embedUrl = getEmbedMapUrl(mapLink);

  return (
    <section id="event-details" className="event-section">
      <div className="event-countdown" aria-label="Compte a rebours avant l'evenement">
        {countdownItems.map((item) => (
          <div className="countdown-item" key={item.label}>
            <div className="countdown-value">{String(item.value).padStart(2, "0")}</div>
            <div className="countdown-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="event-venue">
        <h3>Ou celebrons-nous</h3>
        <p>
          You&apos;re invited to witness our love bloom in the stunning backdrop of{" "}
          {destinationName}. Please join us for a destination wedding filled with
          joy, laughter, and cherished memories.
        </p>
        <p className="event-venue-name">{venue?.name || "Lieu a definir"}</p>
        <p className="event-venue-time">Heure: {venue?.time || "19:00"}</p>

        <div className="event-map-wrap">
          <iframe
            title="Carte du lieu"
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="event-map"
          />
        </div>

        <a className="event-venue-link" href={mapLink} target="_blank" rel="noreferrer">
          Ouvrir dans Google Maps
        </a>
      </div>
    </section>
  );
}
