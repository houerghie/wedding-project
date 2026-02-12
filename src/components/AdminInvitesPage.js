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
  const [tableStatus, setTableStatus] = useState("Loading RSVPs...");
  const [invitationStatus, setInvitationStatus] = useState("Loading invitations...");
  const [actionStatus, setActionStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [activeInviteId, setActiveInviteId] = useState("");

  const getInviteUrl = (inviteId) => `${window.location.origin}/?invite=${inviteId}`;

  const loadRsvps = async () => {
    if (!db) {
      setTableStatus("Firebase is not configured.");
      return;
    }

    setTableStatus("Loading RSVPs...");
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
      setTableStatus(rows.length ? "" : "No RSVPs yet.");
    } catch (error) {
      setTableStatus("Could not load RSVPs.");
    }
  };

  const loadInvitations = async () => {
    if (!db) {
      setInvitationStatus("Firebase is not configured.");
      return;
    }

    setInvitationStatus("Loading invitations...");
    try {
      const snapshot = await getDocs(collection(db, "invitations"));
      const rows = snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          guestName:
            typeof data.guestName === "string" && data.guestName.trim()
              ? data.guestName.trim()
              : "Guest"
        };
      });
      rows.sort((a, b) => a.guestName.localeCompare(b.guestName));
      setInvitations(rows);
      setInvitationStatus(rows.length ? "" : "No invitations yet.");
    } catch (error) {
      setInvitationStatus("Could not load invitations.");
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
      setActionStatus("Invitation URL copied.");
    } catch (error) {
      setActionStatus("Could not copy URL automatically.");
    }
  };

  const handleResetInvitation = async (inviteId) => {
    if (!db) return;
    setActiveInviteId(inviteId);
    setActionStatus("Resetting RSVP...");
    try {
      await deleteDoc(doc(db, "rsvps", inviteId));
      await loadRsvps();
      setActionStatus("RSVP reset. This guest can submit again.");
    } catch (error) {
      setActionStatus("Could not reset RSVP.");
    } finally {
      setActiveInviteId("");
    }
  };

  const handleDeleteInvitation = async (inviteId) => {
    if (!db) return;
    setActiveInviteId(inviteId);
    setActionStatus("Deleting invitation...");
    try {
      await Promise.all([
        deleteDoc(doc(db, "invitations", inviteId)),
        deleteDoc(doc(db, "rsvps", inviteId))
      ]);
      await loadAll();
      setActionStatus("Invitation deleted.");
    } catch (error) {
      setActionStatus("Could not delete invitation.");
    } finally {
      setActiveInviteId("");
    }
  };

  const createInvite = async (event) => {
    event.preventDefault();
    const guestName = name.trim();

    if (!guestName) {
      setStatus("Please enter a guest name.");
      return;
    }
    if (!db) {
      setStatus("Firebase is not configured. Check your env variables.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Creating invitation...");

    try {
      const ref = await addDoc(collection(db, "invitations"), {
        guestName,
        createdAt: serverTimestamp()
      });

      const inviteUrl = getInviteUrl(ref.id);
      setResultUrl(inviteUrl);
      setStatus("Invitation created.");
      setName("");
      await loadAll();
    } catch (error) {
      setStatus("Could not create invitation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-wrap">
      <section className="admin-card">
        <h1>Invitation Admin</h1>
        <p className="muted">
          Create one link per invited person. The ID in the link maps to their
          name and allows one RSVP submission.
        </p>

        <form className="form" onSubmit={createInvite}>
          <label>
            Guest name
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
            {isSubmitting ? "Creating..." : "Create invitation link"}
          </button>
        </form>

        <p className="muted">{status}</p>
        {resultUrl ? (
          <div className="admin-result">
            <label>
              Generated URL
              <input type="text" readOnly value={resultUrl} />
            </label>
          </div>
        ) : null}

        <section className="admin-rsvp">
          <h2>RSVP Dashboard</h2>
          <div className="admin-grid">
            <aside className="admin-stats">
              <div className="admin-stat">
                <div className="admin-stat-label">People coming</div>
                <div className="admin-stat-value">{stats.comingPeople}</div>
              </div>
              <div className="admin-stat">
                <div className="admin-stat-label">Average guests / RSVP</div>
                <div className="admin-stat-value">{stats.averageCount.toFixed(2)}</div>
              </div>
            </aside>

            <div className="admin-table-wrap">
              {tableStatus ? <p className="muted">{tableStatus}</p> : null}
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Answer</th>
                    <th>Count</th>
                    <th>Phone</th>
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
                  <th>Name</th>
                  <th>Invite ID</th>
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
                      <td>{hasRsvp ? "Submitted" : "Pending"}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-mini"
                            onClick={() => handleCopyUrl(row.id)}
                          >
                            Copy URL
                          </button>
                          <button
                            type="button"
                            className="admin-mini"
                            disabled={isBusy}
                            onClick={() => handleResetInvitation(row.id)}
                          >
                            Reset RSVP
                          </button>
                          <button
                            type="button"
                            className="admin-mini admin-danger"
                            disabled={isBusy}
                            onClick={() => handleDeleteInvitation(row.id)}
                          >
                            Delete
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
