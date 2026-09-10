import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/env.js";

// Start the API only after PostgreSQL is connected successfully via Prisma.
const startServer = async () => {
  try {
    // 1. Verify database connection
    await connectDB();

    // 2. Start listening for incoming HTTP requests
    app.listen(config.port, () => {
      console.log(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`
      );
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
}

startServer();
