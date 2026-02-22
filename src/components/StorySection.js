export default function StorySection({ venue }) {
  const destinationName = venue?.name || "[Destination Name]";

  return (
    <section id="story" className="block">
      <h2>Come laugh, dance, and witness the magic unfold</h2>
      <p>
        Grace us with your presence to make our day more special
      </p>
    </section>
  );
}
