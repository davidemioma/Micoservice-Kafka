import { Kafka } from "kafkajs";

// Single kafka cluster
// const kafka = new Kafka({
//   clientId: "kafka-service",
//   brokers: ["localhost:9092"], // kafka:9092 if you're using docker else use localhost:9094
// });

const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
}); // Use localhost with external ports when running locally outside Docker. if you are using docker use ["kafka-broker-1:9092", "kafka-broker-2:9092", "kafka-broker-3:9092"]

const admin = kafka.admin();

const run = async () => {
  await admin.connect();

  // Single kafka cluster
  // await admin.createTopics({
  //   topics: [
  //     {
  //       topic: "payment-successful",
  //       numPartitions: 1,
  //       replicationFactor: 1,
  //     },
  //     {
  //       topic: "order-successful",
  //       numPartitions: 1,
  //       replicationFactor: 1,
  //     },
  //     {
  //       topic: "email-successful",
  //       numPartitions: 1,
  //       replicationFactor: 1,
  //     },
  //   ],
  // });

  // Multiple kafka cluster (Number of partitions and replication factor depends on number of kafka services)
  await admin.createTopics({
    topics: [
      {
        topic: "payment-successful",
        numPartitions: 3,
        replicationFactor: 3,
      },
      {
        topic: "order-successful",
        numPartitions: 3,
        replicationFactor: 3,
      },
      {
        topic: "email-successful",
        numPartitions: 3,
        replicationFactor: 3,
      },
    ],
  });

  console.log("Topic created!");

  await admin.disconnect();
};

run().catch(console.error);

// Run "bun run index.ts" to run script.
