"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";

const DEFAULT_EVENT_DATE_TIME = "2026-04-20T19:00";

export default function AdminInvitesPage() {
  const [name, setName] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [status, setStatus] = useState("");
  const [tableStatus, setTableStatus] = useState("Chargement des RSVP...");
  const [invitationStatus, setInvitationStatus] = useState("Chargement des invitations...");
  const [actionStatus, setActionStatus] = useState("");
  const [eventStatus, setEventStatus] = useState("");
  const [eventDateTime, setEventDateTime] = useState(DEFAULT_EVENT_DATE_TIME);
  const [venueName, setVenueName] = useState("Lieu a definir");
  const [venueTime, setVenueTime] = useState("19:00");
  const [venueMapUrl, setVenueMapUrl] = useState("https://maps.google.com/?q=Bizerte%2C%20Tunisia");
  const [dressCodeTitle, setDressCodeTitle] = useState("Dress code");
  const [dressCodeText, setDressCodeText] = useState(
    "Tenue elegante demandee. Tons neutres et pastel recommandes."
  );
  const [dressCodePalette, setDressCodePalette] = useState(
    "Beige, creme, vert sauge, bordeaux"
  );
  const [presentsTitle, setPresentsTitle] = useState("Presents");
  const [presentsText, setPresentsText] = useState(
    "Grace us with your beautiful presence and become the witness of our epic union"
  );
  const [presentsLinkLabel, setPresentsLinkLabel] = useState("Voir la liste de cadeaux");
  const [presentsLinkUrl, setPresentsLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [activeInviteId, setActiveInviteId] = useState("");

  const getInviteUrl = (inviteId) => `${window.location.origin}/?invite=${inviteId}`;

  const loadRsvps = async () => {
    if (!db) {
      setTableStatus("Firebase n'est pas configure.");
      return;
    }

    setTableStatus("Chargement des RSVP...");
    try {
      const snapshot = await getDocs(collection(db, "rsvps"));
      const rows = snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          guest: typeof data.guest === "string" ? data.guest : "-",
          answer: typeof data.answer === "string" ? data.answer : "-",
          count: Number(data.count) || 0,
          phone: typeof data.phone === "string" && data.phone.trim() ? data.phone.trim() : "-"
        };
      });
      setRsvps(rows);
      setTableStatus(rows.length ? "" : "Aucun RSVP pour le moment.");
    } catch (error) {
      setTableStatus("Impossible de charger les RSVP.");
    }
  };

  const loadInvitations = async () => {
    if (!db) {
      setInvitationStatus("Firebase n'est pas configure.");
      return;
    }

    setInvitationStatus("Chargement des invitations...");
    try {
      const snapshot = await getDocs(collection(db, "invitations"));
      const rows = snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          guestName:
            typeof data.guestName === "string" && data.guestName.trim()
              ? data.guestName.trim()
              : "Invite"
        };
      });
      rows.sort((a, b) => a.guestName.localeCompare(b.guestName));
      setInvitations(rows);
      setInvitationStatus(rows.length ? "" : "Aucune invitation pour le moment.");
    } catch (error) {
      setInvitationStatus("Impossible de charger les invitations.");
    }
  };

  const loadEventSettings = async () => {
    if (!db) {
      setEventStatus("Firebase n'est pas configure.");
      return;
    }

    setEventStatus("Chargement de la date de l'evenement...");
    try {
      const snapshot = await getDoc(doc(db, "siteContent", "homepage"));
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (typeof data.eventDateTime === "string" && data.eventDateTime.trim()) {
          setEventDateTime(data.eventDateTime.trim());
        }
        if (typeof data.venueName === "string" && data.venueName.trim()) {
          setVenueName(data.venueName.trim());
        }
        if (typeof data.venueTime === "string" && data.venueTime.trim()) {
          setVenueTime(data.venueTime.trim());
        }
        if (typeof data.venueMapUrl === "string" && data.venueMapUrl.trim()) {
          setVenueMapUrl(data.venueMapUrl.trim());
        }
        if (typeof data.dressCodeTitle === "string" && data.dressCodeTitle.trim()) {
          setDressCodeTitle(data.dressCodeTitle.trim());
        }
        if (typeof data.dressCodeText === "string" && data.dressCodeText.trim()) {
          setDressCodeText(data.dressCodeText.trim());
        }
        if (typeof data.dressCodePalette === "string" && data.dressCodePalette.trim()) {
          setDressCodePalette(data.dressCodePalette.trim());
        }
        if (typeof data.presentsTitle === "string" && data.presentsTitle.trim()) {
          setPresentsTitle(data.presentsTitle.trim());
        }
        if (typeof data.presentsText === "string" && data.presentsText.trim()) {
          setPresentsText(data.presentsText.trim());
        }
        if (typeof data.presentsLinkLabel === "string" && data.presentsLinkLabel.trim()) {
          setPresentsLinkLabel(data.presentsLinkLabel.trim());
        }
        if (typeof data.presentsLinkUrl === "string") {
          setPresentsLinkUrl(data.presentsLinkUrl.trim());
        }
      }
      setEventStatus("");
    } catch (error) {
      setEventStatus("Impossible de charger la date de l'evenement.");
    }
  };

  const loadAll = async () => {
    await Promise.all([loadRsvps(), loadInvitations(), loadEventSettings()]);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const stats = useMemo(() => {
    if (!rsvps.length) {
      return { comingPeople: 0, averageCount: 0 };
    }

    const comingPeople = rsvps.reduce((sum, row) => {
      return row.answer === "yes" ? sum + row.count : sum;
    }, 0);
    const totalCount = rsvps.reduce((sum, row) => sum + row.count, 0);

    return {
      comingPeople,
      averageCount: totalCount / rsvps.length
    };
  }, [rsvps]);

  const rsvpByInviteId = useMemo(() => {
    const map = new Map();
    rsvps.forEach((row) => {
      map.set(row.id, row);
    });
    return map;
  }, [rsvps]);

  const handleCopyUrl = async (inviteId) => {
    const inviteUrl = getInviteUrl(inviteId);
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setActionStatus("URL d'invitation copiee.");
    } catch (error) {
      setActionStatus("Impossible de copier l'URL automatiquement.");
    }
  };

  const handleResetInvitation = async (inviteId) => {
    if (!db) return;
    setActiveInviteId(inviteId);
    setActionStatus("Reinitialisation du RSVP...");
    try {
      await deleteDoc(doc(db, "rsvps", inviteId));
      await loadRsvps();
      setActionStatus("RSVP reinitialise. Cet invite peut repondre a nouveau.");
    } catch (error) {
      setActionStatus("Impossible de reinitialiser le RSVP.");
    } finally {
      setActiveInviteId("");
    }
  };

  const handleDeleteInvitation = async (inviteId) => {
    if (!db) return;
    setActiveInviteId(inviteId);
    setActionStatus("Suppression de l'invitation...");
    try {
      await Promise.all([
        deleteDoc(doc(db, "invitations", inviteId)),
        deleteDoc(doc(db, "rsvps", inviteId))
      ]);
      await loadAll();
      setActionStatus("Invitation supprimee.");
    } catch (error) {
      setActionStatus("Impossible de supprimer l'invitation.");
    } finally {
      setActiveInviteId("");
    }
  };

  const createInvite = async (event) => {
    event.preventDefault();
    const guestName = name.trim();

    if (!guestName) {
      setStatus("Veuillez saisir un nom d'invite.");
      return;
    }
    if (!db) {
      setStatus("Firebase n'est pas configure. Verifiez vos variables d'environnement.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Creation de l'invitation...");

    try {
      const ref = await addDoc(collection(db, "invitations"), {
        guestName,
        createdAt: serverTimestamp()
      });

      const inviteUrl = getInviteUrl(ref.id);
      setResultUrl(inviteUrl);
      setStatus("Invitation creee.");
      setName("");
      await loadAll();
    } catch (error) {
      setStatus("Impossible de creer l'invitation. Veuillez reessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveEventDateTime = async (event) => {
    event.preventDefault();
    if (!db) {
      setEventStatus("Firebase n'est pas configure.");
      return;
    }
    if (!eventDateTime) {
      setEventStatus("Veuillez choisir une date et une heure.");
      return;
    }
    if (!venueName.trim()) {
      setEventStatus("Veuillez saisir le nom du lieu.");
      return;
    }
    if (!venueMapUrl.trim()) {
      setEventStatus("Veuillez saisir le lien Google Maps.");
      return;
    }

    setIsSavingEvent(true);
    setEventStatus("Enregistrement de la date...");

    try {
      await setDoc(
        doc(db, "siteContent", "homepage"),
        {
          eventDateTime,
          venueName: venueName.trim(),
          venueTime: venueTime.trim() || "19:00",
          venueMapUrl: venueMapUrl.trim(),
          dressCodeTitle: dressCodeTitle.trim() || "Dress code",
          dressCodeText: dressCodeText.trim() || "Tenue elegante demandee.",
          dressCodePalette: dressCodePalette.trim() || "Beige, creme, vert sauge",
          presentsTitle: presentsTitle.trim() || "Presents",
          presentsText:
            presentsText.trim() ||
            "Grace us with your beautiful presence and become the witness of our epic union",
          presentsLinkLabel: presentsLinkLabel.trim() || "Voir la liste de cadeaux",
          presentsLinkUrl: presentsLinkUrl.trim(),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      setEventStatus("Date enregistree.");
    } catch (error) {
      setEventStatus("Impossible d'enregistrer la date.");
    } finally {
      setIsSavingEvent(false);
    }
  };

  return (
    <main className="admin-wrap">
      <section className="admin-card">
        <h1>Administration des invitations</h1>
        <p className="muted">
          Creez un lien unique par invite. L'identifiant dans le lien permet de
          retrouver le nom et d'autoriser un seul RSVP.
        </p>

        <section className="admin-rsvp">
          <h2>Date, lieu et sections configurables</h2>
          <form className="form" onSubmit={saveEventDateTime}>
            <label>
              Date et heure
              <input
                type="datetime-local"
                value={eventDateTime}
                onChange={(event) => setEventDateTime(event.target.value)}
                required
              />
            </label>
            <label>
              Nom du lieu
              <input
                type="text"
                value={venueName}
                onChange={(event) => setVenueName(event.target.value)}
                placeholder="Ex: Dar El Jeld"
                required
              />
            </label>
            <label>
              Heure du lieu (affichage)
              <input
                type="text"
                value={venueTime}
                onChange={(event) => setVenueTime(event.target.value)}
                placeholder="Ex: 19:00"
              />
            </label>
            <label>
              Lien Google Maps
              <input
                type="url"
                value={venueMapUrl}
                onChange={(event) => setVenueMapUrl(event.target.value)}
                placeholder="https://maps.google.com/?q=..."
                required
              />
            </label>
            <label>
              Titre Dress code
              <input
                type="text"
                value={dressCodeTitle}
                onChange={(event) => setDressCodeTitle(event.target.value)}
              />
            </label>
            <label>
              Texte Dress code
              <input
                type="text"
                value={dressCodeText}
                onChange={(event) => setDressCodeText(event.target.value)}
              />
            </label>
            <label>
              Palette couleurs
              <input
                type="text"
                value={dressCodePalette}
                onChange={(event) => setDressCodePalette(event.target.value)}
              />
            </label>
            <label>
              Titre Presents
              <input
                type="text"
                value={presentsTitle}
                onChange={(event) => setPresentsTitle(event.target.value)}
              />
            </label>
            <label>
              Texte Presents
              <input
                type="text"
                value={presentsText}
                onChange={(event) => setPresentsText(event.target.value)}
              />
            </label>
            <label>
              Libelle lien cadeaux
              <input
                type="text"
                value={presentsLinkLabel}
                onChange={(event) => setPresentsLinkLabel(event.target.value)}
              />
            </label>
            <label>
              URL cadeaux (optionnel)
              <input
                type="url"
                value={presentsLinkUrl}
                onChange={(event) => setPresentsLinkUrl(event.target.value)}
                placeholder="https://..."
              />
            </label>
            <button className="primary" type="submit" disabled={isSavingEvent}>
              {isSavingEvent ? "Enregistrement..." : "Enregistrer la configuration"}
            </button>
          </form>
          {eventStatus ? <p className="muted">{eventStatus}</p> : null}
        </section>

        <form className="form" onSubmit={createInvite}>
          <label>
            Nom de l'invite
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex: Sarah Ben Ali"
              maxLength={80}
              required
            />
          </label>
          <button className="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creation..." : "Creer le lien d'invitation"}
          </button>
        </form>

        <p className="muted">{status}</p>
        {resultUrl ? (
          <div className="admin-result">
            <label>
              URL generee
              <input type="text" readOnly value={resultUrl} />
            </label>
          </div>
        ) : null}

        <section className="admin-rsvp">
          <h2>Tableau de bord RSVP</h2>
          <div className="admin-grid">
            <aside className="admin-stats">
              <div className="admin-stat">
                <div className="admin-stat-label">Personnes presentes</div>
                <div className="admin-stat-value">{stats.comingPeople}</div>
              </div>
              <div className="admin-stat">
                <div className="admin-stat-label">Moyenne de personnes / RSVP</div>
                <div className="admin-stat-value">{stats.averageCount.toFixed(2)}</div>
              </div>
            </aside>

            <div className="admin-table-wrap">
              {tableStatus ? <p className="muted">{tableStatus}</p> : null}
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Reponse</th>
                    <th>Nombre</th>
                    <th>Telephone</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((row) => (
                    <tr key={row.id}>
                      <td>{row.guest}</td>
                      <td>{row.answer}</td>
                      <td>{row.count}</td>
                      <td>{row.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="admin-rsvp">
          <h2>Invitations</h2>
          {actionStatus ? <p className="muted">{actionStatus}</p> : null}
          <div className="admin-table-wrap">
            {invitationStatus ? <p className="muted">{invitationStatus}</p> : null}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>ID d'invitation</th>
                  <th>RSVP</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((row) => {
                  const hasRsvp = rsvpByInviteId.has(row.id);
                  const isBusy = activeInviteId === row.id;
                  return (
                    <tr key={row.id}>
                      <td>{row.guestName}</td>
                      <td>{row.id}</td>
                      <td>{hasRsvp ? "Envoye" : "En attente"}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-mini"
                            onClick={() => handleCopyUrl(row.id)}
                          >
                            Copier URL
                          </button>
                          <button
                            type="button"
                            className="admin-mini"
                            disabled={isBusy}
                            onClick={() => handleResetInvitation(row.id)}
                          >
                            Reinitialiser RSVP
                          </button>
                          <button
                            type="button"
                            className="admin-mini admin-danger"
                            disabled={isBusy}
                            onClick={() => handleDeleteInvitation(row.id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
