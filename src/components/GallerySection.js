const galleryVideos = [
  "/videos/024df4ac-b569-4668-8449-0e9c2e0f4d0f.mp4",
  "/videos/8f0801d7-fcf0-4962-868e-da81cca3b2fc.mp4",
  "/videos/86fb22c2-53a7-4184-8161-79fe63b4b32f.mp4",
  "/videos/e20a6b09-a02e-44fc-bb05-907d211c1585.mp4",
];

export default function GallerySection() {
  return (
    <section id="gallery" className="block">
      <h2>Gallery</h2>
      <div className="gallery">
        {galleryVideos.map((src, index) => (
          <div className="photo media-box" key={src}>
            <video
              className="media-fill"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`Video galerie ${index + 1}`}
            >
              <source src={src} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    </section>
  );
}
