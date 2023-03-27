# NestJs Boilerplate Ack Kafka

NestJs Hybrid Http and NestJs Kafka Microservice.

Fork from [ack-nestjs-boilerplate](https://github.com/andrechristikan/ack-nestjs-boilerplate.git)

---

## Instructions

Before run, you must to create the topics with `kafka-topics cli`. Or you can run `yarn kafka:create-topics`. (Point 9 at Behaviour)


## Behaviour

1. Producer and consumer will use `nestjs/microservice`
2. Producer will always imported as global module
3. Message not commit offset in error
4. Optional commit offset in first running
5. Default kafka will create topic with 3 partition and 3 replication factor
6. For guarantee sequential 
    - Create topic with `1 partition` and `1 replication factor`
    - Set `maxInFlightRequests` to `1` in consumer config
    - Use `producerSendSequential` or `produceEmitSequential`
7. `emit` means that whether or not you explicitly subscribe to the observable, the proxy will immediately try to deliver the event.
8. `send` means that you have to explicitly subscribe to it before the message will be sent.
9. `acks` will depends on kafka setting. Unfortunately, nestjs can not set acks when produce some message.
10. Topics in `./src/kafka/constants/kafka.topic.constant.ts` must created before running.
11. All kafka request will validate with `class-validation` if you set the dto class.
12. Put KafkaController into `./src/kafka/router/kafka.router.module.ts`, so you can use `env.KAFKA_CONSUMER_ENABLE` for on/off



## Next

- [ ] Kafka Transaction
