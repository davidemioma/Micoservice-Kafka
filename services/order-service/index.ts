import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["kafka:9092"], // kafka:9092 if you're using docker else use localhost:9094
});

const producer = kafka.producer();

const consumer = kafka.consumer({ groupId: "order-service" });

const run = async () => {
  try {
    await producer.connect();

    await consumer.connect();

    await consumer.subscribe({
      topics: ["payment-successful"],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();

        const { userId, cart } = JSON.parse(value!);

        // TODO: Create order on DB
        const dummyOrderId = "123456789";

        console.log(`Order consumer: Order created for user id: ${userId}`);

        await producer.send({
          topic: "order-successful",
          messages: [
            { value: JSON.stringify({ userId, orderId: dummyOrderId }) },
          ],
        });
      },
    });
  } catch (err) {
    console.log("Order service Error: ", err);
  }
};

run();
