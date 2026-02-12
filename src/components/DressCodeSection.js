export default function DressCodeSection({ dressCode }) {
  return (
    <section className="block info-block" id="dresscode">
      <h2>{dressCode?.title || "Dress code"}</h2>
      <p>{dressCode?.text || "Tenue elegante demandee."}</p>
      <p className="muted">
        <strong>Palette:</strong> {dressCode?.palette || "Beige, creme, vert sauge"}
      </p>
    </section>
  );
}
