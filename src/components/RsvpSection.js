export default function RsvpSection({ formRef, rsvpMsg, onSubmit }) {
  return (
    <section id="rsvp" className="block">
      <h2>Confirmer votre présence</h2>
      <form id="rsvpForm" className="form wide" ref={formRef} onSubmit={onSubmit}>
        <label>
          Votre réponse
          <select name="answer" required>
            <option value="">Choisir...</option>
            <option value="yes">Oui, je serai présent(e)</option>
            <option value="no">Non, je ne pourrai pas</option>
          </select>
        </label>

        <label>
          Nombre de personnes
          <input name="count" type="number" min="1" max="10" defaultValue="1" required />
        </label>

        <label>
          Téléphone (optionnel)
          <input name="phone" type="tel" placeholder="+216 ..." />
        </label>

        <button type="submit" className="primary">
          Envoyer RSVP
        </button>
        <p className="muted" id="rsvpMsg">
          {rsvpMsg}
        </p>
      </form>
      <p className="muted location">
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
    </section>
  );
}
