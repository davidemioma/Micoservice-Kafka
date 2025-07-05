import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["kafka:9092"], // kafka:9092 if you're using docker else use localhost:9094
});

export const producer = kafka.producer();

export const connectToKafka = async () => {
  try {
    await producer.connect();

    console.log("Producer (payment-service) connected!");
  } catch (err) {
    console.log("Error connecting to Kafka (payment-service)", err);
  }
};
