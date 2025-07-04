import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9094"],
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
