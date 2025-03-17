const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

// Połączenie z bazą danych
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "hotel",
};

async function connectDB() {
  const connection = await mysql.createConnection(dbConfig);
  console.log("Połączono z bazą danych");
  return connection;
}

// Pobieranie pokoi
app.get("/pokoje", async (req, res) => {
  try {
    const db = await connectDB();
    const [results] = await db.query("SELECT * FROM pokoje");
    res.json(results);
    await db.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Wystąpił błąd przy pobieraniu danych");
  }
});

// Wynajem pokoju
app.post("/wynajmij", async (req, res) => {
  try {
    const { id_pokoju, data_wynajmu } = req.body;
    if (!id_pokoju || !data_wynajmu) {
      return res.status(400).json({ message: "Brak wymaganych danych" });
    }

    const db = await connectDB();
    const sql = "INSERT INTO zamowienia (id_pokoju, data, uzytkownik) VALUES (?, ?, ?)";
    await db.query(sql, [id_pokoju, data_wynajmu, "user"]);
    await db.end();

    res.json({ message: "Pokój wynajęty pomyślnie" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd przy wynajmowaniu pokoju" });
  }
});

app.listen(3000, () => {
  console.log("Serwer działa na porcie 3000");
});
