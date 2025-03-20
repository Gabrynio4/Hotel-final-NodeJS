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

db.connect(() => {
  console.log("Połączono z bazą danych");
});

app.listen(3000, () => {
  console.log("Serwer działa na porcie 3000");
});

// Pobieranie dostępnych pokoi z automatycznym zwalnianiem
app.get("/pokoje", (req, res) => {
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
  
      db.query("SELECT * FROM pokoje WHERE dostepnosc = TRUE", (err, results) => {
        if (err) {
          console.log(err);
          res.send("Wystąpił błąd przy pobieraniu danych");
        } else {
          console.log("Pomyślnie pobrano dostępne pokoje");
          res.json(results);
        }
      });
    });
  });
  
  
// Wynajem pokoju
app.get("/wynajmij/:pokoj/:data", (req, res) => {
    const { pokoj, data } = req.params;
  
    const sqlInsert = `
      INSERT INTO zamowienia (nazwa_pokoju, data, data_rezerwacji, uzytkownik) 
      VALUES ("${pokoj}", "${data}", CURDATE(), "USER")
    `;
  
    const sqlUpdate = `UPDATE pokoje SET dostepnosc = FALSE WHERE id = "${pokoj}"`;
  
    db.query(sqlInsert, (err, result) => {
      if (err) {
        console.log("Błąd podczas zapisu do bazy:", err);
        res.send("Wystąpił błąd!");
      } else {
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
  

// Pobieranie wynajętych pokoi użytkownika
app.get("/moje-pokoje", (req, res) => {
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
      res.json(results);
    }
  });
});