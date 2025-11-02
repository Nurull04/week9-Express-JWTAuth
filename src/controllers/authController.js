const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username dan password wajib diisi!" });

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (results.length > 0) return res.status(400).json({ message: "Username sudah terdaftar" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
      if (err) throw err;
      res.status(201).json({ message: "Registrasi berhasil!" });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (results.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login berhasil", token });
  });
};
