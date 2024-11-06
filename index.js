const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
const userRoutes = require("./src/routes/userRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://10.40.13.145:${PORT}`);
});
