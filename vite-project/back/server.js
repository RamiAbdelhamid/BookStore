const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/books", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books WHERE is_deleted = false"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/books", async (req, res) => {
  try {
    const { title, author, genre, publication_data, description } = req.body;
    const result = await pool.query(
      "INSERT INTO books (title, author, genre, publication_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, author, genre, publication_data, description]
    );
    res.json(result.rows[0]);
    console.log(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, publication_data, description } = req.body;
    const result = await pool.query(
      "UPDATE books SET title = $1, author = $2, genre = $3 , publication_date = $4, description = $5  WHERE id = $6 RETURNING *",
      [title, author, genre, publication_data, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE books SET is_deleted = true WHERE id = $1", [id]);
    res.json({ message: "books deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
