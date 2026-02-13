function getEmbedMapUrl(mapUrl) {
  if (!mapUrl) {
    return "https://www.google.com/maps?q=Hotel%20l%27Acropole%20Bizerte&output=embed";
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

  return "https://www.google.com/maps?q=Hotel%20l%27Acropole%20Bizerte&output=embed";
}

export default function EventDetailsSection({ countdown, venue }) {
  const destinationName = venue?.name || "[Destination Name]";
  const countdownItems = [
    { label: "Days", value: countdown?.days ?? 0 },
    { label: "Hours", value: countdown?.hours ?? 0 },
    { label: "Minutes", value: countdown?.minutes ?? 0 },
    { label: "Seconds", value: countdown?.seconds ?? 0 }
  ];
  const mapLink = venue?.mapUrl || "https://maps.google.com/?q=Hotel%20l%27Acropole%20Bizerte";
  const embedUrl = getEmbedMapUrl(mapLink);

  return (
    <section id="event-details" className="event-section">
      <div className="event-countdown" aria-label="Event countdown">
        {countdownItems.map((item) => (
          <div className="countdown-item" key={item.label}>
            <div className="countdown-value">{String(item.value).padStart(2, "0")}</div>
            <div className="countdown-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="event-venue">
        <h3>Where we celebrate</h3>
        <p>
          You&apos;re invited to witness our love bloom in the stunning backdrop of{" "}
          {destinationName}. Please join us for a destination wedding filled with
          joy, laughter, and cherished memories.
        </p>
        <p className="event-venue-name">{venue?.name || "Venue to be confirmed"}</p>
        <p className="event-venue-time">Time: {venue?.time || "19:00"}</p>

        <div className="event-map-wrap">
          <iframe
            title="Venue map"
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="event-map"
          />
        </div>

        <a className="event-venue-link" href={mapLink} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}
