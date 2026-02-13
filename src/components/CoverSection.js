export default function CoverSection({
  guest,
  isOpening,
  isOpen,
  revealLetter,
  onOpen
}) {
  const envelopeClass = [
    "envelope",
    isOpen ? "open" : "",
    revealLetter ? "reveal-letter" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const coverClass = ["cover", isOpening ? "is-opening" : ""]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <section id="cover" className={coverClass} aria-label="Invitation cover">
      <div
        className={envelopeClass}
        id="envelope"
        role="button"
        tabIndex={0}
        aria-label="Open invitation"
        onClick={onOpen}
        onKeyDown={handleKeyDown}
      >
        <div className="env-back"></div>
        <div className="env-flap" id="flap"></div>
        <div className="env-flap env-flap-bottom" aria-hidden="true"></div>

        <div className="env-letter" id="letter">
          <div className="letter-top">
            <div className="mono">M - U</div>
            <div className="sub">This invitation is exclusively reserved for you</div>
            <div className="guest" id="guestName">
              {guest}
            </div>
          </div>
        </div>

        <div className="seal" aria-hidden="true"></div>
      </div>

      <p className="hint">Tap the envelope to open</p>
    </section>
  );
}
