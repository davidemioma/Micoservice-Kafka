import { Kafka } from "kafkajs";

// Single kafka clusster
// const kafka = new Kafka({
//   clientId: "analytic-service",
//   brokers: ["kafka:9092"], // kafka:9092 if you're using docker else use localhost:9094
// });

const kafka = new Kafka({
  clientId: "analytics-service",
  brokers: [
    "kafka-broker-1:9092",
    "kafka-broker-2:9092",
    "kafka-broker-3:9092",
  ],
}); // If you're not using, use ["localhost:9094", "localhost:9095", "localhost:9096"]

const consumer = kafka.consumer({ groupId: "analytic-service" });

const run = async () => {
  try {
    await consumer.connect();

    await consumer.subscribe({
      topics: ["payment-successful", "order-successful", "email-successful"],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        switch (topic) {
          case "payment-successful":
            {
              const value = message.value?.toString();

              const { userId, cart } = JSON.parse(value!);

              const total = cart
                // @ts-ignore
                .reduce((acc, item) => acc + item.price, 0)
                .toFixed(2);

              console.log(`Analytic consumer: User ${userId} paid ${total}`);
            }
            break;
          case "order-successful":
            {
              const value = message.value?.toString();

              const { userId, orderId } = JSON.parse(value!);

              console.log(
                `Analytic consumer: Order id ${orderId} created for user id ${userId}`
              );
            }
            break;
          case "email-successful":
            {
              const value = message.value?.toString();

              const { userId, emailId } = JSON.parse(value!);

              console.log(
                `Analytic consumer: Email id ${emailId} sent to user id ${userId}`
              );
            }
            break;
          default:
            break;
        }
      },
    });
  } catch (err) {
    console.log("Analytics service Error: ", err);
  }
};

run();
