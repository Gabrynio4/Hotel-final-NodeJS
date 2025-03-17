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

app.get("/wynajmij/:data/:pokoj", (req, res) => {
  const { data, pokoj } = req.params;
  const sql = `INSERT INTO zamowienia("id_pokoju", "data", "uzytkownik") VALUES ('${pokoj}','${data}','user') ("", "")`;
  conn.query(sql);
  console.log(`: ${tytul} - ${autor}`);
  res.send("Dodano");
});
