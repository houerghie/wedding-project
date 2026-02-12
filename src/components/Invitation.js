"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";
import CoverSection from "./CoverSection";
import InviteSection from "./InviteSection";
import { db } from "../lib/firebase";

const OPEN_DELAY_MS = 950;
const DEFAULT_EVENT_DATE_TIME = "2026-04-20T19:00";
const ZERO_COUNTDOWN = { days: 0, hours: 0, minutes: 0, seconds: 0 };
const DEFAULT_VENUE = {
  name: "Lieu a definir",
  time: "19:00",
  mapUrl: "https://maps.google.com/?q=Bizerte%2C%20Tunisia"
};
const DEFAULT_DRESS_CODE = {
  title: "Dress code",
  text: "Tenue elegante demandee. Tons neutres et pastel recommandes.",
  palette: "Beige, creme, vert sauge, bordeaux"
};
const DEFAULT_PRESENTS = {
  title: "Presents",
  text: "Votre presence est notre plus beau cadeau.",
  linkLabel: "Voir la liste de cadeaux",
  linkUrl: ""
};

function getCountdownParts(targetDateTime) {
  const target = new Date(targetDateTime).getTime();
  if (Number.isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export default function Invitation() {
  const searchParams = useSearchParams();
  const inviteId = useMemo(() => (searchParams?.get("invite") || "").trim(), [searchParams]);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [revealLetter, setRevealLetter] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [coverHidden, setCoverHidden] = useState(false);
  const [rsvpMsg, setRsvpMsg] = useState("");
  const [guest, setGuest] = useState("Invite");
  const [inviteStatus, setInviteStatus] = useState("idle");
  const [eventDateTime, setEventDateTime] = useState(DEFAULT_EVENT_DATE_TIME);
  const [countdown, setCountdown] = useState(ZERO_COUNTDOWN);
  const [venue, setVenue] = useState(DEFAULT_VENUE);
  const [dressCode, setDressCode] = useState(DEFAULT_DRESS_CODE);
  const [presents, setPresents] = useState(DEFAULT_PRESENTS);

  const inviteRef = useRef(null);
  const formRef = useRef(null);

  const openEnvelope = () => {
    if (isOpening || inviteOpen) return;
    setIsOpening(true);
    setIsOpen(true);

    window.setTimeout(() => {
      setRevealLetter(true);
      setCoverHidden(true);
      setInviteOpen(true);
      setIsOpening(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, OPEN_DELAY_MS);
  };

  useEffect(() => {
    let isMounted = true;

    const loadGuestFromInvite = async () => {
      if (!db) {
        if (isMounted) {
          setInviteStatus("no-config");
          setGuest("Invite");
        }
        return;
      }

      if (!inviteId) {
        if (isMounted) {
          setInviteStatus("missing");
          setGuest("Invite");
        }
        return;
      }

      if (isMounted) setInviteStatus("loading");

      try {
        const snapshot = await getDoc(doc(collection(db, "invitations"), inviteId));
        if (!isMounted) return;

        if (!snapshot.exists()) {
          setInviteStatus("invalid");
          setGuest("Invite");
          return;
        }

        const data = snapshot.data();
        const invitedName =
          typeof data.guestName === "string" && data.guestName.trim()
            ? data.guestName.trim().slice(0, 40)
            : "Invite";

        setGuest(invitedName);
        setInviteStatus("valid");
      } catch (error) {
        if (isMounted) {
          setInviteStatus("error");
          setGuest("Invite");
        }
      }
    };

    loadGuestFromInvite();

    return () => {
      isMounted = false;
    };
  }, [inviteId]);

  useEffect(() => {
    let isMounted = true;

    const loadSiteSettings = async () => {
      if (!db) return;
      try {
        const snapshot = await getDoc(doc(db, "siteContent", "homepage"));
        if (!isMounted || !snapshot.exists()) return;

        const data = snapshot.data();
        if (typeof data.eventDateTime === "string" && data.eventDateTime.trim()) {
          setEventDateTime(data.eventDateTime.trim());
        }
        setVenue({
          name:
            typeof data.venueName === "string" && data.venueName.trim()
              ? data.venueName.trim()
              : DEFAULT_VENUE.name,
          time:
            typeof data.venueTime === "string" && data.venueTime.trim()
              ? data.venueTime.trim()
              : DEFAULT_VENUE.time,
          mapUrl:
            typeof data.venueMapUrl === "string" && data.venueMapUrl.trim()
              ? data.venueMapUrl.trim()
              : DEFAULT_VENUE.mapUrl
        });
        setDressCode({
          title:
            typeof data.dressCodeTitle === "string" && data.dressCodeTitle.trim()
              ? data.dressCodeTitle.trim()
              : DEFAULT_DRESS_CODE.title,
          text:
            typeof data.dressCodeText === "string" && data.dressCodeText.trim()
              ? data.dressCodeText.trim()
              : DEFAULT_DRESS_CODE.text,
          palette:
            typeof data.dressCodePalette === "string" && data.dressCodePalette.trim()
              ? data.dressCodePalette.trim()
              : DEFAULT_DRESS_CODE.palette
        });
        setPresents({
          title:
            typeof data.presentsTitle === "string" && data.presentsTitle.trim()
              ? data.presentsTitle.trim()
              : DEFAULT_PRESENTS.title,
          text:
            typeof data.presentsText === "string" && data.presentsText.trim()
              ? data.presentsText.trim()
              : DEFAULT_PRESENTS.text,
          linkLabel:
            typeof data.presentsLinkLabel === "string" && data.presentsLinkLabel.trim()
              ? data.presentsLinkLabel.trim()
              : DEFAULT_PRESENTS.linkLabel,
          linkUrl:
            typeof data.presentsLinkUrl === "string" && data.presentsLinkUrl.trim()
              ? data.presentsLinkUrl.trim()
              : DEFAULT_PRESENTS.linkUrl
        });
      } catch (error) {
        // Keep default datetime if settings cannot be loaded.
      }
    };

    loadSiteSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setCountdown(getCountdownParts(eventDateTime));
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(eventDateTime));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [eventDateTime]);

  useEffect(() => {
    if (!inviteOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [inviteOpen]);

  useEffect(() => {
    if (!inviteOpen || !inviteRef.current) return;

    const items = inviteRef.current.querySelectorAll(".page > *");
    items.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [inviteOpen]);

  const handleRsvp = async (event) => {
    event.preventDefault();
    setRsvpMsg("Envoi en cours...");

    const form = formRef.current;
    if (!form) return;
    if (!db) {
      setRsvpMsg("Le RSVP n'est pas encore configure. Ajoutez les variables Firebase.");
      return;
    }
    if (!inviteId || inviteStatus !== "valid") {
      setRsvpMsg("Ce lien d'invitation est invalide.");
      return;
    }

    const data = new FormData(form);
    const payload = {
      inviteId,
      guest,
      answer: data.get("answer"),
      count: Number(data.get("count") || 1),
      phone: (data.get("phone") || "").trim(),
      createdAt: serverTimestamp()
    };

    try {
      const rsvpRef = doc(collection(db, "rsvps"), inviteId);
      await runTransaction(db, async (transaction) => {
        const existing = await transaction.get(rsvpRef);
        if (existing.exists()) {
          throw new Error("already-submitted");
        }
        transaction.set(rsvpRef, payload);
      });
      setRsvpMsg("RSVP envoye avec succes.");
      form.reset();
    } catch (error) {
      if (error instanceof Error && error.message === "already-submitted") {
        setRsvpMsg("Le RSVP a deja ete envoye pour cette invitation.");
        return;
      }
      setRsvpMsg("Impossible d'envoyer le RSVP. Veuillez reessayer.");
    }
  };

  return (
    <>
      {!coverHidden && (
        <CoverSection
          guest={guest}
          isOpening={isOpening}
          isOpen={isOpen}
          revealLetter={revealLetter}
          onOpen={openEnvelope}
        />
      )}
      <InviteSection
        guest={guest}
        eventDateTime={eventDateTime}
        countdown={countdown}
        venue={venue}
        dressCode={dressCode}
        presents={presents}
        inviteOpen={inviteOpen}
        inviteRef={inviteRef}
        formRef={formRef}
        rsvpMsg={rsvpMsg}
        onSubmit={handleRsvp}
      />
    </>
  );
}
