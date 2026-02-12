"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";

export default function AdminInvitesPage() {
  const [name, setName] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [status, setStatus] = useState("");
  const [tableStatus, setTableStatus] = useState("Chargement des RSVP...");
  const [invitationStatus, setInvitationStatus] = useState("Chargement des invitations...");
  const [actionStatus, setActionStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [activeInviteId, setActiveInviteId] = useState("");

  const getInviteUrl = (inviteId) => `${window.location.origin}/?invite=${inviteId}`;

  const loadRsvps = async () => {
    if (!db) {
      setTableStatus("Firebase n'est pas configuré.");
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
      setInvitationStatus("Firebase n'est pas configuré.");
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
              : "Invité"
        };
      });
      rows.sort((a, b) => a.guestName.localeCompare(b.guestName));
      setInvitations(rows);
      setInvitationStatus(rows.length ? "" : "Aucune invitation pour le moment.");
    } catch (error) {
      setInvitationStatus("Impossible de charger les invitations.");
    }
  };

  const loadAll = async () => {
    await Promise.all([loadRsvps(), loadInvitations()]);
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
      setActionStatus("URL d'invitation copiée.");
    } catch (error) {
      setActionStatus("Impossible de copier l'URL automatiquement.");
    }
  };

  const handleResetInvitation = async (inviteId) => {
    if (!db) return;
    setActiveInviteId(inviteId);
    setActionStatus("Réinitialisation du RSVP...");
    try {
      await deleteDoc(doc(db, "rsvps", inviteId));
      await loadRsvps();
      setActionStatus("RSVP réinitialisé. Cet invité peut répondre à nouveau.");
    } catch (error) {
      setActionStatus("Impossible de réinitialiser le RSVP.");
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
      setActionStatus("Invitation supprimée.");
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
      setStatus("Veuillez saisir un nom d'invité.");
      return;
    }
    if (!db) {
      setStatus("Firebase n'est pas configuré. Vérifiez vos variables d'environnement.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Création de l'invitation...");

    try {
      const ref = await addDoc(collection(db, "invitations"), {
        guestName,
        createdAt: serverTimestamp()
      });

      const inviteUrl = getInviteUrl(ref.id);
      setResultUrl(inviteUrl);
      setStatus("Invitation créée.");
      setName("");
      await loadAll();
    } catch (error) {
      setStatus("Impossible de créer l'invitation. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-wrap">
      <section className="admin-card">
        <h1>Administration des invitations</h1>
        <p className="muted">
          Créez un lien unique par invité. L'identifiant dans le lien permet de
          retrouver le nom et d'autoriser un seul RSVP.
        </p>

        <form className="form" onSubmit={createInvite}>
          <label>
            Nom de l'invité
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
            {isSubmitting ? "Création..." : "Créer le lien d'invitation"}
          </button>
        </form>

        <p className="muted">{status}</p>
        {resultUrl ? (
          <div className="admin-result">
            <label>
              URL générée
              <input type="text" readOnly value={resultUrl} />
            </label>
          </div>
        ) : null}

        <section className="admin-rsvp">
          <h2>Tableau de bord RSVP</h2>
          <div className="admin-grid">
            <aside className="admin-stats">
              <div className="admin-stat">
                <div className="admin-stat-label">Personnes présentes</div>
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
                    <th>Réponse</th>
                    <th>Nombre</th>
                    <th>Téléphone</th>
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
                      <td>{hasRsvp ? "Envoyé" : "En attente"}</td>
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
                            Réinitialiser RSVP
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
