import { useEffect, useState } from 'react';

const API_URL = "http://localhost:8000";

function App() {
    const [contacts, setContacts] = useState([]);
    const [nom, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    // Charger les contacts
    const fetchContacts = async () => {
        try {
            const res = await fetch(`${API_URL}/contacts`);
            const data = await res.json();
            setContacts(data);
            setLoading(false);
        } catch (err) {
            console.error("Erreur:", err);
            setLoading(false);
        }
    };

    // Charger au démarrage
    useEffect(() => {
      fetchContacts();
    }, []);

    // Ajouter un contact
    const [message, setMessage] = useState("");

    const ajouterContact = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom, telephone, email })
            });
            setNom("");
            setTelephone("");
            setEmail("");
            setMessage("✅ Contact ajouté !");
            setTimeout(() => setMessage(""), 3000);
            fetchContacts();
        } catch (err) {
          setMessage("❌ Erreur lors de l'ajout");
            console.error("Erreur:", err);
        }
    };

    {message && <div style={{ padding: "10px", background: "#2ecc71", color: "white", borderRadius: "5px", marginBottom: "10px"}}>{message}</div>}

    // Supprimer un contact
    const supprimerContact = async (id) => {
        try {
            await fetch(`${API_URL}/contacts/${id}`, { method: "DELETE" });
            fetchContacts();
        } catch (err) {
            console.error("Erreur", err);
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h1>📋 Gestionnaire de Contacts</h1>

            <form onSubmit={ajouterContact} style={{ marginBottom: "20px" }}>
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
                <button type="submit">Ajouter</button>
            </form>

            <ul>
                {contacts.map((c) => (
                    <li key={c.id}>
                        <strong>{c.nom}</strong> - {c.telephone} - {c.email}
                        <button onClick={() => supprimerContact(c.id)}>X</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;