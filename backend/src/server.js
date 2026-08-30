import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/env.js";

// Start the API only after PostgreSQL is connected successfully via Prisma.
const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`
      );
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
