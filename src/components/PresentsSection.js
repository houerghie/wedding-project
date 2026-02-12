export default function PresentsSection({ presents }) {
  const hasLink = Boolean(presents?.linkUrl);

  return (
    <section className="block info-block" id="presents">
      <h2>{presents?.title || "Presents"}</h2>
      <p>{presents?.text || "Votre presence est notre plus beau cadeau."}</p>
      {hasLink ? (
        <p>
          <a
            className="link"
            href={presents.linkUrl}
            target="_blank"
            rel="noreferrer"
          >
            {presents?.linkLabel || "Voir la liste de cadeaux"}
          </a>
        </p>
      ) : null}
    </section>
  );
}
