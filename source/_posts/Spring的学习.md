---
title: Spring的学习
date: 2020-08-16 11:58:58
tags:
- Java
- Spring
---

## 概念

Spring 是一个轻量级的控制反转、面向切面编程的框架(容器)

<!-- more -->

Spring 发展到现在,唯一的一个弊端是配置十分繁琐。为了解决这个问题引入了Spring Boot，Spring Boot遵循“约定大于配置”的原则。开发人员只需要规定应用中不符合约定的部分，提高了开发效率。

## IOC

### 几个易混淆的概念

- `控制反转(IOC)` 是一种设计原则
- `依赖导致原则(DIP)`也是一种设计原则
- `依赖注入(DI)`是一种遵循了IOC和DIP的一种设计模式
- `IOC container`是一个框架，该框架实现了依赖注入这一设计模式。

### 使用 IOC container 管理自己创建的bean

AlphaDao.java
``` java
public interface AlphaDao {
    String select();
}
```

如上，声明了一个AlphaDao接口。

AlphaDaoMyBatisImpl.java
``` java
@Repository
public class AlphaDaoMyBatisImpl implements AlphaDao{
    @Override
    public String select() {
        return "MyBatis";
    }
}
```
如上，创建了一个AlphaDao接口的实现，并在该类上添加了@Repositort注解，之后Spring将会自动装配该bean。

CommunityApplicationTests.java
``` java
@SpringBootTest
@ContextConfiguration(classes = CommunityApplication.class)
class CommunityApplicationTests implements ApplicationContextAware {
    private ApplicationContext applicationContext;
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Test
    void contextLoads() {
        AlphaDao alphaDao = applicationContext.getBean(AlphaDaoMyBatisImpl.class,AlphaDao.class);
        System.out.println(alphaDao.select());
    }
}
```
输出为：
> MyBatis

如上所示，通过调用`applicationContext.getBean(AlphaDaoMyBatisImpl.class,AlphaDao.class)`将会得到对应的bean。

### 使用IOC container管理第三方的bean

AlphaConfiguration.java
```java
@Configuration
public class AlphaConfiguration {
    @Bean
    public SimpleDateFormat simpleDateFormat(){
        return new SimpleDateFormat("yy-MM-dd hh:mm:ss");
    }
}
```
如上通过@Configuration声明了一个配置类，之后就可以在类内声明Bean。

CommunityApplicationTests.java
```java
@SpringBootTest
@ContextConfiguration(classes = CommunityApplication.class)
class CommunityApplicationTests implements ApplicationContextAware {
    private ApplicationContext applicationContext;
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Test
    void contextLoads() {
        SimpleDateFormat simpleDateFormat = applicationContext.getBean(SimpleDateFormat.class);
        System.out.println(simpleDateFormat.format(new Date()));
    }
}
```
输出为：
> 20-08-16 12:39:46

如上，也可以使用applicationContext获取SimpleDateFormat Bean。

### 使用IOC container自动装配bean

可以通过对变量、set函数、构造器添加`@AutoWired`注解使Spring自动装配bean。

*通过如上的实验可知，`Controller`、`Service`、`Repository`等注解是为了标识Spring应该装配的bean，所以应该添加在实现类上，而不是接口上。*