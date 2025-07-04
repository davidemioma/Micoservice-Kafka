import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: ["localhost:9094"],
});

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
