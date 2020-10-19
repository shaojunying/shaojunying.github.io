---
title: Spring整合Elasticsearch
date: 2020-10-19 15:29:30
tags:
- Elasticsearch
- Spring
---

> 看本篇文章之前请先看上一篇[Elasticsearch的安装与使用](https://shaojunying.github.io/2020/10/18/Elasticsearch%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8/)

<!-- more -->

## Spring整合Elasticsearch

### 引入

首先在`pom.xml`中使用如下命令引入Elasticsearch

```xml
<!-- https://mvnrepository.com/artifact/org.springframework.data/spring-data-elasticsearch -->
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-elasticsearch</artifactId>
</dependency>
```

### 配置属性

在`application.properties`中指定如下配置
```properties
# elasticsearch
spring.data.elasticsearch.cluster-name=community
spring.data.elasticsearch.cluster-nodes=127.0.0.1:9300
```

### 配置实体类

```Java
@Document(indexName = "discusspost", type = "_doc", shards = 6, replicas = 3)
public class DiscussPost {

    @Id
    private int id;
    @Field(type = FieldType.Integer)
    private int userId;
    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String title;
    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String content;
    @Field(type = FieldType.Integer)
    private int type;
    @Field(type = FieldType.Integer)
    private int status;
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "uuuu-MM-dd'T'HH:mm:ss.SSSZZ")
    private Date createTime;
    @Field(type = FieldType.Integer)
    private int commentCount;
    @Field(type = FieldType.Double)
    private Double score;
    // getter and setter
}
```

注意:
- 要搜索的中文属性要用`analyzer`和`searchAnalyzer`指定分词器
- `Date`要使用`@Field(type = FieldType.Date, format = DateFormat.custom, pattern = "uuuu-MM-dd'T'HH:mm:ss.SSSZZ")`注解

### 配置repository

```Java
@Repository
public interface DiscussPostRepository extends ElasticsearchRepository<DiscussPost, Integer> {
    // Integer是DiscussPost类id的类型
}
```

## 使用

### 插入数据

```Java
@Test
public void testInsert() {
    discussPostRepository.save(discussPostMapper.selectDiscussPostById(114));
    discussPostRepository.save(discussPostMapper.selectDiscussPostById(234));
    discussPostRepository.save(discussPostMapper.selectDiscussPostById(235));
}
```

### 更新数据

```Java
@Test
public void testUpdate() {
    DiscussPost discussPost = discussPostMapper.selectDiscussPostById(114);
    Assert.assertNotNull(discussPost);
    discussPost.setContent("哈哈啊");
    discussPostRepository.save(discussPost);
}
```

### 删除一条数据

```Java
@Test
public void testDelete() {
    discussPostRepository.delete(discussPostMapper.selectDiscussPostById(114));
}
```

### 删除全部数据

```
@Test
public void testDeleteAll() {
    discussPostRepository.deleteAll();
}
```

### 查询(不带高亮)

```Java
@Test
public void testSearch() {
    NativeSearchQuery build = new NativeSearchQueryBuilder()
            .withQuery(QueryBuilders.multiMatchQuery("互联网", "title", "content"))
            .withSort(SortBuilders.fieldSort("type").order(SortOrder.DESC))
            .withSort(SortBuilders.fieldSort("score").order(SortOrder.DESC))
            .withSort(SortBuilders.fieldSort("createTime").order(SortOrder.DESC))
            .withPageable(PageRequest.of(0, 10))
            .withHighlightFields(
                    new HighlightBuilder.Field("title").preTags("<em>").postTags("</em>"),
                    new HighlightBuilder.Field("content").preTags("<em>").postTags("</em>")
            ).build();
    Page<DiscussPost> page = discussPostRepository.search(build);
    System.out.println(page.getTotalElements());
    System.out.println(page.getTotalPages());
    System.out.println(page.getNumber());
    System.out.println(page.getSize());
    for (DiscussPost discussPost : page) {
        System.out.println(discussPost);
    }
}
```

### 查询(带高亮)

```Java
@Test
public void testSearchWithHighlight() {
    NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(QueryBuilders.multiMatchQuery("小哥哥", "title", "content"))
            .withSort(SortBuilders.fieldSort("type").order(SortOrder.DESC))
            .withSort(SortBuilders.fieldSort("score").order(SortOrder.DESC))
            .withSort(SortBuilders.fieldSort("createTime").order(SortOrder.DESC))
            .withPageable(PageRequest.of(0, 10))
            .withHighlightFields(
                    new HighlightBuilder.Field("title"), new HighlightBuilder.Field("content")
            ).build();
    SearchHits<DiscussPost> searchHits = elasticsearchOperations.search(searchQuery, DiscussPost.class);
    List<SearchHit<DiscussPost>> searchHitList = searchHits.getSearchHits();
    for (SearchHit<DiscussPost> discussPostSearchHit : searchHitList) {
        System.out.println(discussPostSearchHit.getHighlightFields());
    }
}
```

## 遇到的问题

如果中途遇到一个中文词语被拆分成汉字了,比如"互联网"被拆分成"互"、"联"、"网",就是当前索引没有设置中文索引,可以参考[Elasticsearch的安装与使用](https://shaojunying.github.io/2020/10/18/Elasticsearch%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8/)中3.10中文查询,将索引删除,之后重新创建索引并指定分词器.

