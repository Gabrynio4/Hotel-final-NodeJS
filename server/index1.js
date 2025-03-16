const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// Połączenie z bazą danych
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hotel",
});

db.connect((err) => {
  if (err) {
    console.log("Błąd połączenia z bazą danych:", err);
    return;
  }
  console.log("Połączono z bazą danych");
});

// Endpoint do pobierania wszystkich pokoi
app.get("/pokoje", (req, res) => {
  db.query("SELECT * FROM pokoje", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Błąd zapytania do bazy" });
      return;
    }
    res.json(results);
  });
});

// Endpoint do rezerwacji pokoju
app.post("/rezerwuj", (req, res) => {
  const { id_pokoju, imie, nazwisko } = req.body;
  if (!id_pokoju || !imie || !nazwisko) {
    res.status(400).json({ error: "Brak wymaganych danych" });
    return;
  }

  db.query(
    "INSERT INTO rezerwacje (id_pokoju, imie, nazwisko) VALUES (?, ?, ?)",
    [id_pokoju, imie, nazwisko],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Błąd rezerwacji" });
        return;
      }
      res.json({ message: "Rezerwacja udana" });
    }
  );
});

// Endpoint do pobierania rezerwacji użytkownika
app.get("/user", (req, res) => {
  const { imie, nazwisko } = req.query;
  if (!imie || !nazwisko) {
    res.status(400).json({ error: "Brak wymaganych danych" });
    return;
  }

  db.query(
    "SELECT * FROM rezerwacje WHERE imie = ? AND nazwisko = ?",
    [imie, nazwisko],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Błąd zapytania do bazy" });
        return;
      }
      res.json(results);
    }
  );
});

// Endpoint do anulowania rezerwacji
app.post("/anuluj", (req, res) => {
  const { id_rezerwacji } = req.body;
  if (!id_rezerwacji) {
    res.status(400).json({ error: "Brak ID rezerwacji" });
    return;
  }

  db.query(
    "DELETE FROM rezerwacje WHERE id = ?",
    [id_rezerwacji],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Błąd anulowania rezerwacji" });
        return;
      }
      res.json({ message: "Rezerwacja anulowana" });
    }
  );
});

app.post("/wynajmij", (req, res) => {
  const { id_pokoju, data_wynajmu } = req.body;
  const user = "user"; // Tymczasowo użytkownik to zawsze "user"

  if (!id_pokoju || !data_wynajmu) {
      res.status(400).json({ error: "Brak wymaganych danych" });
      return;
  }

  db.query(
      "UPDATE pokoje SET wynajety_do = ?, wynajety_przez = ? WHERE id = ?",
      [data_wynajmu, user, id_pokoju],
      (err, result) => {
          if (err) {
              res.status(500).json({ error: "Błąd wynajmowania pokoju" });
              return;
          }
          res.json({ message: "Pokój został wynajęty!" });
      }
  );
});


// Uruchomienie serwera
app.listen(3000, () => {
  console.log("Serwer działa na porcie 3000");
});