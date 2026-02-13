export default function DressCodeSection({ dressCode }) {
  return (
    <section className="block info-block" id="dresscode">
      <h2>{dressCode?.title || "Dress Code"}</h2>
      <p>{dressCode?.text || "Elegant attire requested."}</p>
      <p className="muted">
        <strong>Palette:</strong> {dressCode?.palette || "Beige, cream, sage green"}
      </p>
    </section>
  );
}
