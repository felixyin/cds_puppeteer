'use strict';

const Consumer = require('super-queue').Consumer;

const c = new Consumer({
    // 队列名称
    queue: 'my_queue',
    // 设置Redis数据库连接
    redis: {host: 'localhost', port: 6379, db: 0},
    // 处理能力，如果当前消费者正在处理的消息数量超过该值则不再接收新消息，为0表示不限制
    capacity: 0,
    // 心跳时间周期（s），默认2秒
    heartbeat: 2,
});

// 监听队列
c.listen(msg => {
    // msg.data = 消息内容
    pring(msg.data);
    msg.resolve("ok");
    // msg.expire = 消息过期秒时间戳
    // msg.reject(err) 消息处理出错
    // msg.resolve(result) 消息处理成功
    // msg.checkTimeout(callback) 检查执行是否超时，如果在expire之后的时间还没有响应，则自动响应一个MessageProcessingTimeoutError，并执行回调函数
});

// 退出
c.exit();
