export default function RsvpSection({ formRef, rsvpMsg, onSubmit }) {
  return (
    <section id="rsvp" className="block">
      <h2>Make Reservation</h2>
      <form id="rsvpForm" className="form wide" ref={formRef} onSubmit={onSubmit}>
        <label>
          Your answer
          <select name="answer" required>
            <option value="">Choose...</option>
            <option value="yes">Yes, I will attend</option>
            <option value="no">No, I can&#39;t</option>
          </select>
        </label>

        <label>
          Number of guests
          <input name="count" type="number" min="1" max="10" defaultValue="1" required />
        </label>

        <label>
          Phone (optional)
          <input name="phone" type="tel" placeholder="+216 ..." />
        </label>

        <button type="submit" className="primary">
          Send RSVP
        </button>
        <p className="muted" id="rsvpMsg">
          {rsvpMsg}
        </p>
      </form>
      <p className="muted location">
        <span>Location:</span>{" "}
        <a
          className="link"
          target="_blank"
          rel="noreferrer"
          href="https://maps.google.com/?q=Bizerte%2C%20Tunisia"
        >
          Open in Google Maps
        </a>
      </p>
    </section>
  );
}
