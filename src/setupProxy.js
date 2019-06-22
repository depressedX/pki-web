const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    const apiProxy = proxy('/hi', {
        target: 'http://192.168.137.1:8082',
        onProxyReq:function onProxyReq(proxyReq, req, res) {
            console.log('aaaaaaaaaaaaaaaa')
        }
    })
    app.use('/hi',apiProxy);

};