'use strict';

const Producer = require('super-queue').Producer;

const p = new Producer({
    // 队列名称
    queue: 'my_queue',
    // 设置Redis数据库连接
    redis: {host: 'localhost', port: 6379, db: 0},
    // 默认的消息有效时间(s)，为0表示永久
    maxAge: 0,
    // 心跳时间周期（s），默认2秒
    heartbeat: 2,
});



// 初始化成功，触发start事件
// 注意：一定要在触发此事件后再使用push()，否则可能无法收到消息处理结果
p.on('start', () => {


    // 消息入队
    const data = 'abcdefg'; // 消息内容，必须为字符串类型
    const maxAge = 10;      // 消息有效时间，当省略此参数时使用默认的maxAge值
    p.push({data, maxAge}, (err, ret) => {
        if (err) {
            // 消息处理出错
            // 如果超过指定时间消费者未返回处理结果，则会返回MessageProcessingTimeoutError
            console.error(err);
        } else {
            // 消息的处理结果
            console.log(ret);
        }
    });

    console.log('start working');
});

// 退出
p.exit();
