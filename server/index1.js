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

// Pobieranie pokoi
app.get("/pokoje", (req, res) => {
  db.query("SELECT * FROM pokoje", (err, results) => {
    if(err){
      console.log(err)
      res.send("Wystapił błąd przy pobieraniu danych")
    } else {
        console.log("Pomyślnie pobrano dane")
        res.json(results);
    } 
  });
});

app.get("/wynajmij/:pokoj/:data", (req, res) => {
  const { pokoj, data } = req.params;
  const sql = `INSERT INTO zamowienia (nazwa_pokoju, data, uzytkownik) VALUES ("${pokoj}", "${data}", "user")`;
  
  db.query(sql, (err, result) => {
      if (err) {
          console.log("Błąd podczas zapisu do bazy:", err);
          res.send("Wystąpił błąd!");
      } else {
          console.log(`Dodano rezerwację: Pokój ${pokoj}, Data ${data}, Użytkownik: user`);
          res.send("Pokój został wynajęty!");
      }
  });
});


