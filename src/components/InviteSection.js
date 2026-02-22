import HeroSection from "./HeroSection";
import EventDetailsSection from "./EventDetailsSection";
import StorySection from "./StorySection";
import ScheduleSection from "./ScheduleSection";
import GallerySection from "./GallerySection";
import RsvpSection from "./RsvpSection";
import FooterSection from "./FooterSection";

export default function InviteSection({
  guest,
  eventDateTime,
  countdown,
  venue,
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
      aria-label="Invitation details"
      ref={inviteRef}
    >
      <HeroSection guest={guest} eventDateTime={eventDateTime} />
      <div className="page">
        <EventDetailsSection countdown={countdown} venue={venue} />
        <StorySection venue={venue} />
        {/* <ScheduleSection /> */}
        <GallerySection />
        <RsvpSection formRef={formRef} rsvpMsg={rsvpMsg} onSubmit={onSubmit} />
        <FooterSection />
      </div>
    </section>
  );
}
