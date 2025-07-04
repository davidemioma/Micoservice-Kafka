import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "./middleware/logger";
import { connectToKafka, producer } from "./lib/kafka";

const app = express();

const port = process.env.PORT || 5000;

//Middleware
app.use(helmet());
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
  // Mock user ID
  const userId = "1234546789";

  const { cart } = req.body;

  // TODO:PAYMENT LOGIC

  await producer.send({
    topic: "payment-successful",
    messages: [{ value: JSON.stringify({ userId, cart }) }],
  });

  // Use timeout to mock queue.
  setTimeout(() => {
    return res.status(200).send("Payment successful");
  }, 3000);
});

// Run server
app.listen(port, () => {
  connectToKafka();

  console.log(`App running on port:${port}`);
});
