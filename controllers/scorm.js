module.exports = {
    hello: [
        function (req, res) {
            res.status(200).jsonp({ok: true, message: 'Hello World'});

        }
    ]
}
