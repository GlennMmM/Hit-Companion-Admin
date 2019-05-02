var express = require('express');
var router = express.Router();
const Parse = require('parse/node');

router.get('/', (req, res) => {
    res.render('authLoggin', { title: 'LOGIN' });
})

module.exports = router;