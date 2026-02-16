export default function RsvpSection({ formRef, rsvpMsg, onSubmit }) {
  return (
    <section id="rsvp" className="block rsvp-section">
      <h2>Confirm Your Attendance</h2>
      <p className="rsvp-intro">
        Reply in a few seconds to help us organize this special day.
      </p>

      <div className="rsvp-shell">
        <form id="rsvpForm" className="form wide rsvp-form" ref={formRef} onSubmit={onSubmit}>
          <label>
            <span>Your response</span>
            <select name="answer" required>
              <option value="">Choose...</option>
              <option value="yes">Yes, I will attend</option>
              <option value="no">No, I will not be able to attend</option>
            </select>
          </label>

          <label>
            <span>Number of guests</span>
            <input name="count" type="number" min="1" max="10" defaultValue="1" required />
          </label>

          <label>
            <span>Phone (optional)</span>
            <input name="phone" type="tel" placeholder="+216 ..." />
          </label>

          <div className="rsvp-actions">
            <button type="submit" className="primary rsvp-submit">
              Confirm Your Attendance
            </button>
            <p className="muted rsvp-msg" id="rsvpMsg">
              {rsvpMsg}
            </p>
          </div>
        </form>

        <p className="muted location rsvp-location">
          <span>Venue:</span>{" "}
          <a
            className="link"
            target="_blank"
            rel="noreferrer"
            href="https://maps.google.com/?q=Hotel%20l%27Acropole%20Bizerte"
          >
            Open in Google Maps
          </a>
        </p>
      </div>
    </section>
  );
}
