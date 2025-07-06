import { Kafka } from "kafkajs";

// Single kafka clusster
// const kafka = new Kafka({
//   clientId: "email-service",
//   brokers: ["kafka:9092"], // kafka:9092 if you're using docker else use localhost:9094
// });

const kafka = new Kafka({
  clientId: "email-service",
  brokers: [
    "kafka-broker-1:9092",
    "kafka-broker-2:9092",
    "kafka-broker-3:9092",
  ],
}); // If you're not using, use ["localhost:9094", "localhost:9095", "localhost:9096"]

const producer = kafka.producer();

const consumer = kafka.consumer({ groupId: "email-service" });

const run = async () => {
  try {
    await producer.connect();

    await consumer.connect();

    await consumer.subscribe({
      topics: ["order-successful"],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();

        const { userId, orderId } = JSON.parse(value!);

        // TODO: Send email to the user
        const dummyEmailId = "091584203985";

        console.log(`Email consumer: Email sent to user id ${userId}`);

        await producer.send({
          topic: "email-successful",
          messages: [
            { value: JSON.stringify({ userId, emailId: dummyEmailId }) },
          ],
        });
      },
    });
  } catch (err) {
    console.log("Email service Error: ", err);
  }
};

run();
