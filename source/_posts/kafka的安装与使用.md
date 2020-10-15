---
title: kafka的安装与使用
date: 2020-10-15 09:17:15
tags:
- 消息队列
- kafka
- Spring
---

## 下载

从[此链接](https://kafka.apache.org/downloads)中下载最新的binary版本即可

## 安装

将tgz压缩包解压,最好放在根目录,比如`C:\kafka_2.13-2.6.0`这样.否则可能会报错命令行过长

## 修改设置

- 将文件`C:\kafka_2.13-2.6.0\config\server.properties`中的`log.dirs`修改为`log.dirs=C:/Users/shao/kafka_logs/`
- 将文件`C:\kafka_2.13-2.6.0\config\zookeeper.properties`中的`dataDir`修改为`dataDir=C:/Users/shao/zookeeper`

## 运行

### 运行zookeeper

```bash
cd C:\kafka_2.13-2.6.0
bin\windows\zookeeper-server-start.bat config\zookeeper.properties
```
### 运行kafka

```bash
cd C:\kafka_2.13-2.6.0
bin\windows\kafka-server-start.bat config\server.properties
```

## 创建一个topic

```bash
cd C:\kafka_2.13-2.6.0\bin\windows
kafka-topics.bat --create --bootstrap-server localhost:9092 --replication-factor 1 --partition 1 --topic test
```
- `bootstrap-server`指定新topic对应的主机
- `replication-factor`指定备份个数
- `partition`指定分区个数,也即将topic分成几块

## 发送消息

```bash
cd C:\kafka_2.13-2.6.0\bin\windows
kafka-console-producer.bat --broker-list localhost:9092 --topic test
```

## 接受消息

```bash
cd C:\kafka_2.13-2.6.0\bin\windows
kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic test --from-beginning
```

## Spring整合

### maven引入

```xml
<!-- https://mvnrepository.com/artifact/org.springframework.kafka/spring-kafka -->
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
    <version>2.6.1</version>
</dependency>
```

### 配置kafka
```properties
# kafka
# 主机端口
spring.kafka.bootstrap-servers=localhost:9092
# 组id,在consumer.properties,默认为test-consumer-group
spring.kafka.consumer.group-id=community-consumer-group
# 是否允许自动提交
spring.kafka.consumer.enable-auto-commit=true
# 自动提交的时间间隔,这里设置为3s
spring.kafka.consumer.auto-commit-interval=3000
```

### 代码测试

```java
@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = CommunityApplication.class)
public class KafkaTest {
    @Autowired
    private Producer producer;

    @Test
    public void test() throws InterruptedException {
        producer.send("test","shao");
        producer.send("test","jun");
        producer.send("test","ying");

        Thread.sleep(1000 * 10);

    }

}


@Component
class Producer{
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void send(String topic, String content){
        kafkaTemplate.send(topic, content);
    }
}

@Component
class Consumer{
    @KafkaListener(topics = {"test"})
    public void receive(ConsumerRecord<String, Object> consumerRecord){
        System.out.println(consumerRecord.value());
    }
}
```