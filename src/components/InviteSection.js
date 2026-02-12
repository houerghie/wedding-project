import HeroSection from "./HeroSection";
import StorySection from "./StorySection";
import ScheduleSection from "./ScheduleSection";
import GallerySection from "./GallerySection";
import RsvpSection from "./RsvpSection";
import FooterSection from "./FooterSection";

export default function InviteSection({
  guest,
  inviteOpen,
  inviteRef,
  formRef,
  rsvpMsg,
  onSubmit
}) {
  const inviteClass = ["invite", inviteOpen ? "is-open" : "hidden"]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id="invite"
      className={inviteClass}
      aria-label="Détails de l'invitation"
      ref={inviteRef}
    >
      <div className="page">
        <HeroSection guest={guest} />
        <StorySection />
        <ScheduleSection />
        <GallerySection />
        <RsvpSection formRef={formRef} rsvpMsg={rsvpMsg} onSubmit={onSubmit} />
        <FooterSection />
      </div>
    </section>
  );
}
