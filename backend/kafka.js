const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'tienda-app',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function conectarProducer() {
    await producer.connect();
}

async function enviarEventoPedido(data) {
    await producer.send({
        topic: 'pedidos',
        messages: [
            { value: JSON.stringify(data) }
        ],
    });
}

module.exports = {
    conectarProducer,
    enviarEventoPedido
};