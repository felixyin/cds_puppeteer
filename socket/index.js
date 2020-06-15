const socketIo = require('socket.io');
const biying = require('../puppeteer/biying');

const _user_sockets = {};
let _user_page_mapping = {};

function onLogin(socket) {
    socket.on('login', async (username) => {
        console.log('---->' + username);
        _user_sockets['a' + username] = socket;
    });
    socket.emit('connect');
}

function onQuery(socket) {
    socket.on('query', (username, keyword) => {
        console.log(username);
        _user_sockets['a' + username] = socket;
        keyword = decodeURI(keyword);
        console.log('good：' + keyword);
        biying.biyingSearch(keyword, function (links) {
            console.log('links：' + links);
            let us = _user_sockets['a' + username];
            if (!us) {
                if (null != socket) us = socket;
                setTimeout(function () {
                    try {
                        us.emit('queryResult', {status: 'data', links: links});
                    } catch (e) {
                        setTimeout(function () {
                            try {
                                us.emit('queryResult', {status: 'data', links: links});
                            } catch (e) {
                                setTimeout(function () {
                                    try {
                                        us.emit('queryResult', {status: 'data', links: links});
                                    } catch (e) {
                                    }
                                }, 4000);// 解决断线重连时的丢包问题
                            }
                        }, 3000);// 解决断线重连时的丢包问题
                    }
                }, 2000);// 解决断线重连时的丢包问题
            } else {
                us.emit('queryResult', {status: 'data', links: links});
            }
        }, function () {
            console.log('finish！！！！！！！');
            const us = _user_sockets['a' + username];
            if (us) {
                us.emit('queryResult', {status: 'finish'});
            }
        }, function (browser) {
            _user_page_mapping[username] = browser;
            // setTimeout(function () {
            //     let b = _user_page_mapping[username];
            //     if (b && !b.isClosed()) {
            //         b.close();
            //         delete _user_page_mapping[username];
            //     }
            // }, 1000 * 60 * 30); //
        });
    });
}

function onStop(socket) {
    socket.on('stop', async (username) => {
        // console.log(username);
        let us = _user_sockets['a' + username];
        let page = _user_page_mapping[username];
        // console.log(page);
        if (page) {
            try {
                await page.close();
                console.log('stop ... ... ');
                delete _user_page_mapping[username];
            } catch (e) {
            }
        }
        if (!us) {
            us = socket;
        }
        us.emit('stopOver', {status: 'ok'});
    });
}

function onDisconnect(socket) {
    socket.on('disconnect', (username) => {
        console.log('断开连接：' + username)
        delete _user_sockets['a' + username];
        socket.emit('reconnect');
    });
}

function run(server) {
    let io = socketIo.listen(server);

    io.on('connection', (socket) => {
        // console.log('connection');
        onLogin(socket);
        onQuery(socket);
        onStop(socket);
        onDisconnect(socket);
    });
}

exports.runAt = run;
