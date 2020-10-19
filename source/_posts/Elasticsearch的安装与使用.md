---
title: Elasticsearch的安装与使用
date: 2020-10-18 15:38:29
tags:
- Elasticsearch
---

## 下载与安装

可以通过[此链接](https://www.elastic.co/start)下载到最新版Elasticsearch.


<!-- more -->

下载之后将其解压在一个文件夹中即可,这里解压的目录是`C:\elasticsearch-x.x.x`

## 修改设置

配置`elasticsearch-x.x.x\config`目录下的`elasticsearch.yml`文件
- 修改`cluster.name`,这里设置为`cluster.name: community`
- 修改`path.data`和`path.logs`,这里分别设置为`path.data: C:\Users\shao\elasticSearch\data`和`path.logs: C:\Users\shao\elasticSearch\logs`

## 使用

双击`elasticsearch-x.x.x\bin`下的`elasticsearch.bat`即可启动服务.

### 获取健康信息

```bash
curl -X GET "localhost:9200/_cat/health?v"
```

### 获取节点信息

```bash
curl -X GET "localhost:9200/_cat/nodes?v"
```


### 获取索引信息

```bash
curl -X GET "localhost:9200/_cat/indices?v"
```

### 创建节点

```bash
curl -X PUT "localhost:9200/test"
```

### 删除节点

```bash
curl -X DELETE "localhost:9200/test"
```

### 向索引中添加数据

PUT `http://localhost:9200/test/_doc/1`
body设置为json格式,内容为
```json
{
	"title":"hello",
	"content": "How are you"
}
```

(如果索引不存在将自动创建索引)

(向索引中更新数据也是这条命令)

### 向索引中查询数据

GET `localhost:9200/test/_doc/1`

即可查询test索引中id为1的数据

### 向索引中删除数据


DELETE `localhost:9200/test/_doc/1`

即可删除test索引中id为1的数据

### 搜索

先向索引test中添加如下两条数据

```json
{
	"title":"互联网求职",
	"content": "寻求一份运营的岗位"
}
```
```json
{
	"title":"互联网招聘",
	"content": "招聘一名资深程序员"
}
```

#### 不指定参数查询

GET `localhost:9200/test/_search?q=title:求职`

结果如下
```json
{
    "took": 31,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": 2,
        "max_score": 1,
        "hits": [
            {
                "_index": "test",
                "_type": "_doc",
                "_id": "2",
                "_score": 1,
                "_source": {
                    "title": "互联网招聘",
                    "content": "招聘一名资深程序员"
                }
            },
            {
                "_index": "test",
                "_type": "_doc",
                "_id": "1",
                "_score": 1,
                "_source": {
                    "title": "互联网求职",
                    "content": "寻求一份运营的岗位"
                }
            }
        ]
    }
}
```
如上,将返回所有数据

#### 简单参数查询

GET `localhost:9200/test/_search?q=title:求职`

结果如下
```json
{
    "took": 5,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": 1,
        "max_score": 0.5753642,
        "hits": [
            {
                "_index": "test",
                "_type": "_doc",
                "_id": "1",
                "_score": 0.5753642,
                "_source": {
                    "title": "互联网求职",
                    "content": "寻求一份运营的岗位"
                }
            }
        ]
    }
}
```

如上,将返回title中包含求职的消息

#### 复杂参数查询

POST `localhost:9200/test/_search`

body中json格式的数据如下

```json
{
	"query":{
		"multi_match":{
			"query":"岗位",
			"fields":["title","content"]
		}
	}
}
```

结果如下

```json
{
    "took": 8,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": 1,
        "max_score": 0.5753642,
        "hits": [
            {
                "_index": "test",
                "_type": "_doc",
                "_id": "1",
                "_score": 0.5753642,
                "_source": {
                    "title": "互联网求职",
                    "content": "寻求一份运营的岗位"
                }
            }
        ]
    }
}
```

如上,将返回标题或内容包含岗位的数据

### 中文查询

#### 为索引指定分词器

POST `http://localhost:9200/discusspost/_mapping`

data:
```json
{
        "properties": {
            "content": {
                "type": "text",
                "analyzer": "ik_max_word",
                "search_analyzer": "ik_smart"
            }
        }

}
```

如上命令为content字段指定中文分词器

#### 查询索引的分词器

GET `http://localhost:9200/discusspost/_mapping`

如果返回结果中content字段为

```json
"content": {
    "type": "text",
    "fields": {
        "keyword": {
            "type": "keyword",
            "ignore_above": 256
        }
    }
}
```
则说明没有为该字段中文分词器,成功后的结果应该如下图所示
```json
"content": {
    "type": "text",
    "analyzer": "ik_max_word",
    "search_analyzer": "ik_smart"
},
```
*注意:如果要修改当前分词器,可能会提示冲突,可以删除索引之后重新创建,之后再指定分词器*

#### 中文搜索

POST `http://localhost:9200/discusspost/_search`

data:

```json
{
    "query" : { "match" : { "content" : "就业形势" }},
    "highlight" : {
        "pre_tags" : ["<tag1>", "<tag2>"],
        "post_tags" : ["</tag1>", "</tag2>"],
        "fields" : {
            "content" : {}
        }
    }
}
```
*其中tags可以不指定,默认为<em>*

之后搜索结果包含highlight字段,如下所示

```json
"highlight": {
    "content": [
        "大家的“哀嚎”与“悲惨遭遇”牵动了每日潜伏于讨论区的牛客<tag1>小哥哥</tag1>小姐姐们的心，于是牛客决定：是时候为大家做点什么了！"
    ]
}
```