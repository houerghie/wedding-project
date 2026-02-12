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
  }, [inviteId, db]);

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
        inviteOpen={inviteOpen}
        inviteRef={inviteRef}
        formRef={formRef}
        rsvpMsg={rsvpMsg}
        onSubmit={handleRsvp}
      />
    </>
  );
}
