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

// Pobieranie dostępnych pokoi
app.get("/pokoje", (req, res) => {
  db.query("SELECT * FROM pokoje WHERE dostepnosc = TRUE", (err, results) => {
      if(err){
          console.log(err)
          res.send("Wystąpił błąd przy pobieraniu danych");
      } else {
          console.log("Pomyślnie pobrano dostępne pokoje");
          res.json(results);
      }
  });
});


app.get("/wynajmij/:pokoj/:data", (req, res) => {
  const { pokoj, data } = req.params;

  const sqlInsert = `INSERT INTO zamowienia (nazwa_pokoju, data, uzytkownik) VALUES ("${pokoj}", "${data}", "USER")`;
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
          console.log(`Dodano rezerwację: Pokój ${pokoj}, Data ${data}, Użytkownik: USER`);
          res.send("Pokój został wynajęty!");
      }
  });
});


setInterval(() => {
  const sql = `UPDATE pokoje 
               SET dostepnosc = TRUE 
               WHERE id IN (
                  SELECT id_pokoju FROM zamowienia WHERE data < CURDATE()
               )`;
  
  db.query(sql, (err, result) => {
      if (err) {
          console.log("Błąd podczas zwalniania pokoi:", err);
      } else {
          console.log("Zaktualizowano dostępność pokoi");
      }
  });
}, 60 * 60 * 1000); // Sprawdza co godzinę


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
