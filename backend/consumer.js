const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'consumer-app',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'grupo-pedidos' });

async function run() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'pedidos', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const data = JSON.parse(message.value.toString());

            console.log("Pedido recibido:");
            console.log(`Cliente: ${data.cliente}`);
            console.log(`Total: $${data.total}`);
            console.log(`Productos: ${data.productos.length}`);
            console.log("---------------------------");
        },
    });
}

run();