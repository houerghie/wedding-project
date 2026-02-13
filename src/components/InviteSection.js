import HeroSection from "./HeroSection";
import EventDetailsSection from "./EventDetailsSection";
import StorySection from "./StorySection";
import ScheduleSection from "./ScheduleSection";
import GallerySection from "./GallerySection";
import DressCodeSection from "./DressCodeSection";
import PresentsSection from "./PresentsSection";
import RsvpSection from "./RsvpSection";
import FooterSection from "./FooterSection";

export default function InviteSection({
  guest,
  eventDateTime,
  countdown,
  venue,
  dressCode,
  presents,
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
      <HeroSection guest={guest} eventDateTime={eventDateTime} />
      <div className="page">
        <EventDetailsSection countdown={countdown} venue={venue} />
        <StorySection venue={venue} />
        <ScheduleSection />
        <GallerySection />
        <DressCodeSection dressCode={dressCode} />
        <PresentsSection presents={presents} />
        <RsvpSection formRef={formRef} rsvpMsg={rsvpMsg} onSubmit={onSubmit} />
        <FooterSection />
      </div>
    </section>
  );
}
