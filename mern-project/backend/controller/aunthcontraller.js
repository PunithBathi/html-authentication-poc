const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // insert user
    db.query(
      "INSERT INTO users (name,email,password) VALUES (?,?,?)",
      [name, email, hashed],
      (err, result) => {
        if (err) return res.status(500).send(err);

        res.json({ message: "User Registered Successfully" });
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
};


// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.length === 0)
        return res.status(400).send("User not found");

      const user = result[0];

      // compare password
      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res.status(400).send("Wrong password");

      // create token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ token });
    }
  );
};