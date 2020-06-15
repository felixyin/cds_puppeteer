const http = require('http');


function _gp() {
    return new Promise(function (resolve, reject) {
        const proxyUrl = 'http://cdspp.yinbin.ink/get/';
        http.get(proxyUrl, function (res) {
            res.on('data', function (proxy) {
                resolve(proxy);
            });
        });
    });

}


async function getProxy() {
    let p = await _gp();
    // console.log(p.toString());
    return 'http://' + p.toString();
}


// getProxy();

exports.getProxy = getProxy;
