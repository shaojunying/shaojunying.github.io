---
title: Maven的学习
date: 2020-08-14 21:53:14
tags:
- Java
---

## 定义

`maven`是一个常用的包管理工具。

<!-- more -->

## 常用命令

- 创建项目

    命令
    ```mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false```

  - `archetype:generate` 表示按照一个模板创建一个项目，其中`-DarchetypeArtifactId=maven-archetype-quickstart`指定了参照的模板，该模板是maven项目的常用模板。
  - `-DartifactID`指定了该项目的根目录的名字，该项目的根目录名字即为`my-app`。
  - `-DgroupID=com.mycompany.app`会在`my-app/src/main/java`目录下创建一个对应的`com/mycompany/app`文件夹，项目的代码将会保存在这个文件夹下。
  - `-DinteractiveMode=false` 表示不会进入交互模式。

- `mvn compile` 编译`my-app/src/main/java`目录下的`java`文件，在`my-app/target`文件夹下生成对应的`class`文件。这里不编译`test`文件。
- `mvn clean` 删除`my-app/target`目录。
- `mvn test` 编译`my-app/src/test/java`目录下的`java`文件，并运行进行测试。
- `mvn clean compile` 可以多个命令连续使用
- `mvn package` 将项目进行打包，在`my-app/target`目录下生成一个`my-app-1.0-SNAPSHOT.jar`文件。之后可以执行`java -cp target\my-app-1.0-SNAPSHOT.jar com.mycompany.app.App`运行App.java文件中的main函数。
  - `java -cp`中的cp表示classpath，其后两个参数分别时jar包的路径和项目主类的路径。

*在输入类似`mvn compile`之类的指令时，mvn会顺序执行在maven执行序列中该指令之前的所有指令。*