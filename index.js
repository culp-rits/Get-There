const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) => {
    res.render('home.ejs')
});

app.listen(3000, () => {
    console.log('port 3000')
});

app.get('/Places', (req, res) => {
    const {page} = req.params;
    res.render('Places.ejs',{page});
});

app.get('/:page', (req, res) => {
    const {page} = req.params;
    res.render('page.ejs',{page});
});

