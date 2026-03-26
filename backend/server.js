require("dotenv").config();

const { connectMongoDB } = require("./mongodb/mongodb");
const { createApp } = require("./app");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectMongoDB();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
