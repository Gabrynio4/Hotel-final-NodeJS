// Importowanie wymaganych modułów
const express = require("express"); // Framework do obsługi serwera HTTP
const cors = require("cors"); // Middleware do obsługi CORS (Cross-Origin Resource Sharing)
const mysql = require("mysql2"); // Moduł do komunikacji z bazą MySQL

const app = express(); // Tworzenie aplikacji Express
app.use(cors()); // Włączenie obsługi CORS, aby umożliwić połączenia z innych domen
app.use(express.json()); // Middleware do parsowania JSON w zapytaniach

// Połączenie z bazą danych MySQL
const db = mysql.createConnection({
  host: "localhost", // Adres serwera bazy danych
  user: "root", // Nazwa użytkownika bazy danych
  password: "", // Hasło do bazy danych (puste w domyślnej konfiguracji XAMPP)
  database: "hotel", // Nazwa bazy danych
});

// Nawiązanie połączenia z bazą
db.connect(() => {
  console.log("Połączono z bazą danych");
});

// Uruchomienie serwera na porcie 3000
app.listen(3000, () => {
  console.log("Serwer działa na porcie 3000");
});

// ========================
// Pobieranie dostępnych pokoi
// ========================
app.get("/pokoje", (req, res) => {
    // SQL: Automatyczne zwalnianie pokoi, których rezerwacja już się zakończyła
    const sqlUpdate = `
      UPDATE pokoje 
      SET dostepnosc = TRUE 
      WHERE id IN (
        SELECT p.id 
        FROM pokoje p
        LEFT JOIN zamowienia z ON p.id = z.nazwa_pokoju
        GROUP BY p.id
        HAVING MAX(z.data) < CURDATE() OR MAX(z.data) IS NULL
      )
    `;
  
    db.query(sqlUpdate, (err) => {
      if (err) {
        console.log("Błąd podczas zwalniania pokoi:", err);
      } else {
        console.log("Zaktualizowano dostępność pokoi");
      }
  
      // Pobranie wszystkich dostępnych pokoi
      db.query("SELECT * FROM pokoje WHERE dostepnosc = TRUE", (err, results) => {
        if (err) {
          console.log(err);
          res.send("Wystąpił błąd przy pobieraniu danych");
        } else {
          console.log("Pomyślnie pobrano dostępne pokoje");
          res.json(results); // Wysłanie wyników w formacie JSON
        }
      });
    });
});
  
// ========================
// Wynajem pokoju przez użytkownika
// ========================
app.get("/wynajmij/:pokoj/:data", (req, res) => {
    const { pokoj, data } = req.params; // Pobranie ID pokoju i daty wynajmu z parametru URL
  
    // SQL: Dodanie rezerwacji do tabeli `zamowienia`
    const sqlInsert = `
      INSERT INTO zamowienia (nazwa_pokoju, data, data_rezerwacji, uzytkownik) 
      VALUES ("${pokoj}", "${data}", CURDATE(), "USER")
    `;
  
    // SQL: Aktualizacja dostępności pokoju (ustawienie na `FALSE`)
    const sqlUpdate = `UPDATE pokoje SET dostepnosc = FALSE WHERE id = "${pokoj}"`;
  
    db.query(sqlInsert, (err, result) => {
      if (err) {
        console.log("Błąd podczas zapisu do bazy:", err);
        res.send("Wystąpił błąd!");
      } else {
        // Jeśli rezerwacja się powiodła, aktualizujemy dostępność pokoju
        db.query(sqlUpdate, (err) => {
          if (err) {
            console.log("Błąd przy aktualizacji dostępności:", err);
          }
        });
        console.log(`Dodano rezerwację: Pokój ${pokoj}, Data ${data}, Użytkownik: USER, Data rezerwacji: ${new Date().toISOString().split('T')[0]}`);
        res.send("Pokój został wynajęty!");
      }
    });
});
  
// ========================
// Pobieranie wynajętych pokoi użytkownika
// ========================
app.get("/moje-pokoje", (req, res) => {
  // SQL: Pobranie wszystkich pokoi wynajętych przez użytkownika "USER"
  const sql = `
      SELECT p.*, z.data AS data_wynajmu 
      FROM pokoje p
      JOIN zamowienia z ON p.id = z.nazwa_pokoju
      WHERE z.uzytkownik = "USER" AND z.data >= CURDATE()
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Błąd przy pobieraniu wynajętych pokoi:", err);
      res.send("Wystąpił błąd!");
    } else {
      console.log("Pobrano wynajęte pokoje użytkownika USER");
      res.json(results); // Wysłanie wyników w formacie JSON
    }
  });
});

// ========================
// Pobieranie przeszłych rezerwacji (historia)
// ========================
app.get("/historia-pokoi", (req, res) => {
  const sql = `
      SELECT p.*, z.data AS data_wynajmu 
      FROM pokoje p
      JOIN zamowienia z ON p.id = z.nazwa_pokoju
      WHERE z.uzytkownik = "USER" AND z.data < CURDATE()
  `;

  db.query(sql, (err, results) => {
      if (err) {
          console.log("Błąd przy pobieraniu historii pokoi:", err);
          res.send("Wystąpił błąd!");
      } else {
          console.log("Pobrano historię pokoi użytkownika USER");
          res.json(results);
      }
  });
});

// ========================
// Pobieranie wszystkich pokoi (dla panelu admina)
// ========================
app.get("/admin/pokoje", (req, res) => {
  db.query("SELECT * FROM pokoje", (err, results) => {
      if (err) {
          console.log("Błąd pobierania pokoi:", err);
          res.status(500).send("Błąd serwera");
      } else {
          res.json(results);
      }
  });
});

// ========================
// Edycja pokoju
// ========================
app.post("/admin/pokoje/update", (req, res) => {
  const { id, nazwa, dlugiopis, cena, dostepnosc } = req.body;

  const sql = `
      UPDATE pokoje 
      SET nazwa = ?, dlugiopis = ?, cena = ?, dostepnosc = ? 
      WHERE id = ?
  `;

  db.query(sql, [nazwa, dlugiopis, cena, dostepnosc, id], (err) => {
      if (err) {
          console.log("Błąd aktualizacji:", err);
          res.status(500).send("Błąd podczas aktualizacji pokoju");
      } else {
          res.send("Pomyślnie zaktualizowano pokój");
      }
  });
});

// ========================
// Usuwanie pokoju
// ========================
app.delete("/admin/pokoje/delete/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM pokoje WHERE id = ?";
  db.query(sql, [id], (err) => {
      if (err) {
          console.log("Błąd usuwania pokoju:", err);
          res.status(500).send("Błąd podczas usuwania pokoju");
      } else {
          res.send("Pokój został pomyślnie usunięty");
      }
  });
});
