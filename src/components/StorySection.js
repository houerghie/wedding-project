export default function StorySection({ venue }) {
  const destinationName = venue?.name || "[Destination Name]";

  return (
    <section id="story" className="block">
      <h2>Come laugh, dance, and witness the magic unfold</h2>
      <p>
        You&apos;re invited to witness our love bloom in the stunning backdrop of{" "}
        {destinationName}. Please join us for a destination wedding filled with
        joy, laughter, and cherished memories.
      </p>
    </section>
  );
}
