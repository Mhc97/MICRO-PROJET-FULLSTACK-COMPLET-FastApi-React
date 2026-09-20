import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8000";

function App() {
    const [contacts, setContacts] = useState([]);
    const [nom, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [recherche, setRecherche] = useState("");
    const [editingId, setEditingId] = useState(null);

    // =========================
    // Charger les contacts
    // =========================
    const fetchContacts = async () => {
        try {
            setError(null);

            const res = await fetch(`${API_URL}/contacts`);

            if (!res.ok) {
                throw new Error(`ERREUR ${res.status}`);
            }

            const data = await res.json();
            setContacts(data);
        } catch (err) {
            console.error("Erreur :", err);
            setError("Impossible de charger les contacts.");
        } finally {
            setLoading(false);
        }
    };

    // Charger au démarrage
    useEffect(() => {
        fetchContacts();
    }, []);

    // =========================
    // Ajouter / Modifier
    // =========================
    const ajouterContact = async (e) => {
        e.preventDefault();

        // Validation du nom
        if (nom.trim().length < 2) {
            setMessage("❌ Le nom doit faire au moins 2 caractères");
            return;
        }

        // Validation du téléphone
        if (!/^[0-9+\s-]{8,}$/.test(telephone)) {
            setMessage("❌ Numéro de téléphone invalide");
            return;
        }

        // Validation de l'email
        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            setMessage("❌ Email invalide");
            return;
        }

        try {
            const url = editingId
                ? `${API_URL}/contacts/${editingId}`
                : `${API_URL}/contacts`;

            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom,
                    telephone,
                    email,
                }),
            });

            if (!res.ok) {
                throw new Error(`ERREUR ${res.status}`);
            }

            if (editingId) {
                setMessage("✅ Contact modifié !");
            } else {
                setMessage("✅ Contact ajouté !");
            }

            // Réinitialiser le formulaire
            setNom("");
            setTelephone("");
            setEmail("");
            setEditingId(null);

            // Recharger les contacts
            fetchContacts();

            // Faire disparaître le message
            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (err) {
            console.error("Erreur :", err);
            setMessage("❌ Une erreur est survenue.");
        }
    };

    // =========================
    // Supprimer un contact
    // =========================
    const supprimerContact = async (id, nom) => {
        if (!window.confirm(`Supprimer ${nom} ?`)) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/contacts/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error(`ERREUR ${res.status}`);
            }

            setMessage("✅ Contact supprimé !");
            fetchContacts();

            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (err) {
            console.error("Erreur :", err);
            setError("Impossible de supprimer le contact.");
        }
    };

    // =========================
    // Préparer la modification
    // =========================
    const modifierContact = (contact) => {
        setEditingId(contact.id);
        setNom(contact.nom);
        setTelephone(contact.telephone);
        setEmail(contact.email || "");

        // Remonter vers le formulaire
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // Annuler la modification
    // =========================
    const annulerModification = () => {
        setEditingId(null);
        setNom("");
        setTelephone("");
        setEmail("");
        setMessage("");
    };

    // =========================
    // Recherche
    // =========================
    const contactsFiltres = contacts.filter((c) =>
        c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        c.telephone.includes(recherche) ||
        (c.email || "")
            .toLowerCase()
            .includes(recherche.toLowerCase())
    );

    // =========================
    // Chargement
    // =========================
    if (loading) {
        return (
            <div
                style={{
                    padding: "20px",
                    textAlign: "center",
                }}
            >
                <h2>⏳ Chargement des contacts...</h2>
            </div>
        );
    }

    // =========================
    // Affichage
    // =========================
    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                margin: "0 auto",
            }}
        >
            <h1>📋 Gestionnaire de Contacts</h1>

            {/* Message */}
            {message && (
                <div
                    style={{
                        padding: "10px",
                        background: message.includes("✅")
                            ? "#2ecc71"
                            : "#e74c3c",
                        color: "white",
                        borderRadius: "5px",
                        marginBottom: "10px",
                    }}
                >
                    {message}
                </div>
            )}

            {/* Erreur */}
            {error && (
                <div
                    style={{
                        padding: "10px",
                        background: "#e74c3c",
                        color: "white",
                        borderRadius: "5px",
                        marginBottom: "10px",
                    }}
                >
                    ❌ {error}
                </div>
            )}

            {/* Formulaire */}
            <form
                onSubmit={ajouterContact}
                style={{
                    marginBottom: "20px",
                }}
            >
                <input
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                />

                <input
                    placeholder="Téléphone"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    required
                />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit">
                    {editingId ? "Modifier" : "Ajouter"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={annulerModification}
                        style={{
                            marginLeft: "10px",
                        }}
                    >
                        Annuler
                    </button>
                )}
            </form>

            {/* Recherche */}
            <input
                placeholder="🔍 Rechercher..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                style={{
                    marginBottom: "10px",
                    padding: "8px",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            />

            {/* Liste des contacts */}
            <ul>
                {contactsFiltres.map((c) => (
                    <li
                        key={c.id}
                        style={{
                            marginBottom: "10px",
                        }}
                    >
                        <strong>{c.nom}</strong>
                        {" - "}
                        {c.telephone}
                        {" - "}
                        {c.email || "Pas d'email"}

                        <button
                            onClick={() => modifierContact(c)}
                            style={{
                                marginLeft: "10px",
                            }}
                        >
                            ✏️
                        </button>

                        <button
                            onClick={() =>
                                supprimerContact(c.id, c.nom)
                            }
                            style={{
                                marginLeft: "5px",
                            }}
                        >
                            🗑️
                        </button>
                    </li>
                ))}
            </ul>

            {/* Aucun résultat */}
            {contactsFiltres.length === 0 && (
                <p>Aucun contact trouvé.</p>
            )}
        </div>
    );
}

export default App;
