import cors from "cors";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "./middleware/logger";
import {
  connectToKafka,
  producer,
  ensureProducerConnection,
} from "./lib/kafka";

const app = express();

const port = process.env.PORT || 8000;

//Middleware
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.disable("x-powered-by");
app.use(logger);

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "Payment service Ok" });
});

app.post("/payment-service", async (req, res) => {
  try {
    // Mock user ID
    const userId = "1234546789";

    const { cart } = req.body;

    // TODO:PAYMENT LOGIC

    // Ensure producer is connected before sending
    await ensureProducerConnection();

    await producer.send({
      topic: "payment-successful",
      messages: [{ value: JSON.stringify({ userId, cart }) }],
    });

    res.status(200).send("Payment successful");
  } catch (err) {
    console.log("/payment-service Error: ", err);
    res.status(500).send("Payment failed");
  }
});

// Run server
app.listen(port, () => {
  connectToKafka();

  console.log(`Payment service running on port:${port}`);
});
