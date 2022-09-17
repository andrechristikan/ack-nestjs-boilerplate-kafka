export interface IKafkaAdminService {
    connect(): Promise<void>;

    getAllTopic(): Promise<string[]>;

    getAllTopicUnique(): Promise<string[]>;

    createTopics(): Promise<boolean>;
}
