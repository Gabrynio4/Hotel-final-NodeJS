const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Połączenie z bazą danych
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hotel",
});

db.connect((err) => {
  if (err) {
    console.error("Błąd połączenia z bazą danych:", err);
    return;
  }
  console.log("✅ Połączono z bazą danych");
});

// 📌 🔹 Endpoint: Pobieranie listy pokoi
app.get("/pokoje", (req, res) => {
  db.query("SELECT * FROM pokoje", (err, results) => {
    if (err) {
      console.error("Błąd pobierania pokoi:", err);
      res.status(500).json({ error: "Błąd pobierania pokoi" });
      return;
    }
    res.json(results);
  });
});

// 📌 🔹 Endpoint: Wynajmowanie pokoju
app.post("/wynajmij", (req, res) => {
  const { id_pokoju, wynajety_do } = req.body;
  const wynajety_przez = "user"; // Tymczasowy użytkownik

  if (!id_pokoju || !wynajety_do) {
    return res.status(400).json({ error: "Brak wymaganych danych" });
  }

  db.query(
    "UPDATE pokoje SET wynajety_do = ?, wynajety_przez = ? WHERE id = ?",
    [wynajety_do, wynajety_przez, id_pokoju],
    (err, result) => {
      if (err) {
        console.error("Błąd wynajmu:", err);
        return res.status(500).json({ error: "Błąd wynajmowania pokoju" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Pokój nie istnieje" });
      }

      res.json({ message: "Pokój został wynajęty!" });
    }
  );
});

// 📌 🔹 Endpoint: Pobieranie rezerwacji użytkownika
app.get("/user", (req, res) => {
  const wynajety_przez = "user"; // Na razie zawsze ten użytkownik

  db.query(
    "SELECT * FROM pokoje WHERE wynajety_przez = ?",
    [wynajety_przez],
    (err, results) => {
      if (err) {
        console.error("Błąd pobierania rezerwacji:", err);
        res.status(500).json({ error: "Błąd pobierania rezerwacji" });
        return;
      }
      res.json(results);
    }
  );
});

// 📌 🔹 Endpoint: Anulowanie rezerwacji (zwalnianie pokoju)
app.post("/anuluj", (req, res) => {
  const { id_pokoju } = req.body;

  if (!id_pokoju) {
    return res.status(400).json({ error: "Brak ID pokoju" });
  }

  db.query(
    "UPDATE pokoje SET wynajety_do = NULL, wynajety_przez = NULL WHERE id = ?",
    [id_pokoju],
    (err, result) => {
      if (err) {
        console.error("Błąd anulowania wynajmu:", err);
        return res.status(500).json({ error: "Błąd anulowania wynajmu" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Pokój nie istnieje" });
      }

      res.json({ message: "Rezerwacja anulowana!" });
    }
  );
});

// 🚀 Uruchomienie serwera
app.listen(3000, () => {
  console.log("🚀 Serwer działa na porcie 3000");
});
