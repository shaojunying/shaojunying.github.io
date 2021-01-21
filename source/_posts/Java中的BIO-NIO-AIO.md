---
title: Java中的BIO NIO AIO
date: 2021-01-21 14:06:22
tags:
- 面试
- Java
- IO
---
- [https://developer.aliyun.com/article/726698](https://developer.aliyun.com/article/726698)

## 定义

- BIO: 同步阻塞IO
- NIO: 同步非阻塞IO
- AIO: 异步非阻塞IO

## 同步和异步

IO操作分为两步: 发起IO和实际的IO操作. 其中同步和异步区别在于第二步,若

- 同步: 实际IO操作阻塞、(发起IO之后需要等待或者轮询,直到IO执行完毕,之后才能执行后续操作),-
- 异步：发起IO之后不阻塞、(后续操作不受影响,只是在操作系统通知IO就绪之后才执行后续IO操作)

## 阻塞和非阻塞

区别在发起IO这一步

- 阻塞：发起IO之后阻塞,一直等待IO完成
- 非阻塞：发起IO之后不会一直等待，为非阻塞IO

## 具体区别

### BIO（同步阻塞IO）

发起IO之后一直等待，直到IO准备就绪，进行后续的IO操作

### NIO（同步非阻塞IO）

发起IO之后会立刻收到一个状态值，标识IO是否准备就绪，如果没有就绪则一直循环

（NIO中使用Selector来同时轮询多个Channel上的事件，避免线程切换的开销）

### AIO（异步阻塞IO）

发起IO之后继续执行后续操作，定义好回调函数，在IO操作执行完毕之后将会主动调用该回调函数

## 代码实现

### NIO

```java
public class Server {
    public static void main(String[] args) throws IOException {
        ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
        serverSocketChannel.bind(new InetSocketAddress("0.0.0.0",9999), 50);
        Selector selector = Selector.open();
        serverSocketChannel.configureBlocking(false);
        serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);

        while (true) {
            // 轮询
            selector.select();
            Set<SelectionKey> selectionKeys = selector.selectedKeys();
            Iterator<SelectionKey> iterator = selectionKeys.iterator();
            while (iterator.hasNext()) {
                // 收到新的channel事件
                SelectionKey selectionKey = iterator.next();
                if (selectionKey.isAcceptable()) {
                    // 连接请求
                    ServerSocketChannel serverSocketChannel1 = (ServerSocketChannel) selectionKey.channel();
                    SocketChannel socketChannel = serverSocketChannel1.accept();
                    System.out.println("收到一条新请求");
                    socketChannel.configureBlocking(false);
                    socketChannel.register(selector, SelectionKey.OP_READ);
                }else if (selectionKey.isReadable()){
                    SocketChannel socketChannel = (SocketChannel) selectionKey.channel();
                    ByteBuffer buffer = ByteBuffer.allocate(200);
                    socketChannel.read(buffer);
                    System.out.println(buffer.toString());
                    socketChannel.close();
                }

                iterator.remove();
            }
        }
    }
}
```

### AIO

```java
public class Server {

    public static void main(String[] args) throws InterruptedException {
        new Thread(new AioServer(9999)).start();
        TimeUnit.SECONDS.sleep(60);
    }

    static class AioServer implements Runnable{

        int port;
        AsynchronousChannelGroup group;
        AsynchronousServerSocketChannel serverSocketChannel;

        AioServer(int port){
            this.port = port;
            init();
        }

        private void init() {
            try{
                ExecutorService executor;
                group = AsynchronousChannelGroup.withCachedThreadPool(
                        Executors.newCachedThreadPool(), 5);
                serverSocketChannel = AsynchronousServerSocketChannel.open(group);
                serverSocketChannel.bind(new InetSocketAddress(port));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void run() {
            serverSocketChannel.accept(this, new AcceptHandler());
        }
    }

    static class AcceptHandler implements CompletionHandler<AsynchronousSocketChannel, AioServer> {

        @Override
        public void completed(AsynchronousSocketChannel result, AioServer attachment) {
            // 继续接收下一个请求，构成循环调用
            attachment.serverSocketChannel.accept(attachment, this);

            try {
                System.out.println("接收到连接请求：" + result.getRemoteAddress().toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        public void failed(Throwable exc, AioServer attachment) {

        }
    }
}
```