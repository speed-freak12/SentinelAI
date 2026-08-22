const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { handleUpload } = require("@vercel/blob/client");

dotenv.config();

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://sentinelai12.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as curl/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Also allow Vercel preview deployments.
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Body parser
|--------------------------------------------------------------------------
| This is ONLY for normal JSON API requests.
|
| IMPORTANT:
| Large files do NOT pass through this body parser.
| Large files go directly from the browser to Vercel Blob.
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "1mb",
  })
);

/*
|--------------------------------------------------------------------------
| Import Routes
|--------------------------------------------------------------------------
*/

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const threatRoutes = require("./routes/threatRoutes");
const fileRoutes = require("./routes/fileRoutes");
const reportRoutes = require("./routes/reportRoutes");
const logRoutes = require("./routes/logRoutes");
const intelligenceRoutes = require("./routes/intelligenceRoutes");
const assistantRoutes = require("./routes/assistantRoutes");


/*
|--------------------------------------------------------------------------
| MongoDB connection
|--------------------------------------------------------------------------
*/

let isConnecting = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (isConnecting) {
    await isConnecting;
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  isConnecting = mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await isConnecting;

    console.log("✅ MongoDB Connected");
  } finally {
    isConnecting = null;
  }
}

/*
|--------------------------------------------------------------------------
| Vercel Blob Client Upload Authorization
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| The browser first calls this endpoint to obtain a short-lived
| client upload token.
|
| The actual large file is NOT uploaded to this Express function.
|
| Browser
|    ↓
| /api/blob/upload
|    ↓
| client token
|    ↓
| Vercel Blob directly
|
|--------------------------------------------------------------------------
*/

app.post("/api/blob/upload", async (req, res) => {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("❌ BLOB_READ_WRITE_TOKEN is missing");

      return res.status(500).json({
        success: false,
        message: "BLOB_READ_WRITE_TOKEN is not configured",
      });
    }

    /*
     * handleUpload receives the small JSON request from
     * @vercel/blob/client.
     */
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,

      onBeforeGenerateToken: async (
        pathname,
        clientPayload,
        multipart
      ) => {
        console.log("🔐 Generating Blob client token:", {
          pathname,
          multipart,
        });

        return {
          /*
           * File types Sentinel currently accepts.
           */
          allowedContentTypes: [
            "application/pdf",
            "application/zip",
            "application/octet-stream",

            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

            "application/java-archive",

            "image/jpeg",
            "image/png",

            "text/plain",
          ],

          /*
           * Allow files up to 500 MB.
           *
           * This does NOT mean the file goes through
           * the Vercel Function.
           *
           * The browser uploads directly to Blob.
           */
          maximumSizeInBytes: 500 * 1024 * 1024,

          /*
           * Preserve multipart mode requested by the client.
           *
           * For large files, @vercel/blob/client uses multipart
           * uploads so the file is split into parts.
           */
          multipart: Boolean(multipart),

          /*
           * Prevent filename collisions.
           */
          addRandomSuffix: true,

          /*
           * Store metadata inside the client token.
           */
          tokenPayload: JSON.stringify({
            originalPathname: pathname,
            clientPayload: clientPayload || null,
          }),
        };
      },

      /*
       * Called by Vercel Blob after the upload completes.
       */
      onUploadCompleted: async ({
        blob,
        tokenPayload,
      }) => {
        console.log("✅ Blob upload completed");

        console.log({
          pathname: blob.pathname,
          url: blob.url,
          contentType: blob.contentType,
        });

        if (tokenPayload) {
          console.log(
            "📦 Blob token payload:",
            tokenPayload
          );
        }
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (err) {
    console.error("❌ Blob Upload Authorization Error:", err);

    return res.status(400).json({
      success: false,
      message:
        err?.message || "Blob upload authorization failed",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
|
| This route does NOT require MongoDB.
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SentinelAI Backend Running 🚀",
  });
});

/*
|--------------------------------------------------------------------------
| MongoDB Middleware
|--------------------------------------------------------------------------
|
| Everything below this point may require MongoDB.
|
|--------------------------------------------------------------------------
*/

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(
      "❌ MongoDB Connection Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/threats", threatRoutes);

app.use("/api/files", fileRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/logs", logRoutes);

app.use("/api/intelligence", intelligenceRoutes);

app.use("/api/assistant", assistantRoutes);
/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error("❌ Express Error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/*
|--------------------------------------------------------------------------
| Local Development
|--------------------------------------------------------------------------
*/

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );
  });
}

module.exports = app;