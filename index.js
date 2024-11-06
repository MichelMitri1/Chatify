const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
const userRoutes = require("./src/routes/userRoutes");

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
