const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    const apiProxy = proxy('/api', {
        target: 'http://47.95.214.69:1002',
        onProxyReq:function onProxyReq(proxyReq, req, res) {
            console.log(`proxy ${proxyReq.url} ${req.url}`)
        }
    })
    app.use('/api',apiProxy);
    app.use('/hi',proxy('/hi', {
        target: 'http://47.95.214.69:1002',
        onProxyReq:function onProxyReq(proxyReq, req, res) {
            console.log(`proxy ${proxyReq.url} ${req.url}`)
        }
    }));

};