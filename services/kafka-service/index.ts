import { Kafka } from "kafkajs";

// Single kafka clusster
// const kafka = new Kafka({
//   clientId: "kafka-service",
//   brokers: ["kafka:9092"], // kafka:9092 if you're using docker else use localhost:9094
// });

const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: [
    "kafka-broker-1:9092",
    "kafka-broker-2:9092",
    "kafka-broker-3:9092",
  ],
}); // If you're not using, use ["localhost:9094", "localhost:9095", "localhost:9096"]

const admin = kafka.admin();

const run = async () => {
  await admin.connect();

  await admin.createTopics({
    topics: [
      {
        topic: "payment-successful",
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: "order-successful",
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: "email-successful",
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
  });

  console.log("Topic created!");

  await admin.disconnect();
};

run().catch(console.error);

// Run "bun run index.ts" to run script.
