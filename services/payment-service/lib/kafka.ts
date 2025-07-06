import { Kafka } from "kafkajs";

// Single kafka clusster
// const kafka = new Kafka({
//   clientId: "payment-service",
//   brokers: ["kafka:9092"], // kafka:9092 if you're using docker else use localhost:9094
// });

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: [
    "kafka-broker-1:9092",
    "kafka-broker-2:9092",
    "kafka-broker-3:9092",
  ],
}); // If you're not using, use ["localhost:9094", "localhost:9095", "localhost:9096"]

export const producer = kafka.producer();

export const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log("Connected to Kafka (payment-service)");
  } catch (err) {
    console.log("Error connecting to Kafka (payment-service)", err);
  }
};

export const ensureProducerConnection = async () => {
  try {
    await producer.connect();
    console.log("Producer connection ensured!");
  } catch (err) {
    console.log("Error ensuring producer connection:", err);
    throw err;
  }
};
