export default function RsvpSection({ formRef, rsvpMsg, onSubmit }) {
  return (
    <section id="rsvp" className="block rsvp-section">
      <h2>Confirmer votre presence</h2>
      <p className="rsvp-intro">
        Repondez en quelques secondes pour nous aider a organiser cette journee.
      </p>

      <div className="rsvp-shell">
        <form id="rsvpForm" className="form wide rsvp-form" ref={formRef} onSubmit={onSubmit}>
          <label>
            <span>Votre reponse</span>
            <select name="answer" required>
              <option value="">Choisir...</option>
              <option value="yes">Oui, je serai present(e)</option>
              <option value="no">Non, je ne pourrai pas</option>
            </select>
          </label>

          <label>
            <span>Nombre de personnes</span>
            <input name="count" type="number" min="1" max="10" defaultValue="1" required />
          </label>

          <label>
            <span>Telephone (optionnel)</span>
            <input name="phone" type="tel" placeholder="+216 ..." />
          </label>

          <div className="rsvp-actions">
            <button type="submit" className="primary rsvp-submit">
              Envoyer RSVP
            </button>
            <p className="muted rsvp-msg" id="rsvpMsg">
              {rsvpMsg}
            </p>
          </div>
        </form>

        <p className="muted location rsvp-location">
          <span>Lieu:</span>{" "}
          <a
            className="link"
            target="_blank"
            rel="noreferrer"
            href="https://maps.google.com/?q=Bizerte%2C%20Tunisia"
          >
            Ouvrir dans Google Maps
          </a>
        </p>
      </div>
    </section>
  );
}
