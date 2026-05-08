const express = require('express');
const PATH = require('path');
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PATH.join(__dirname, 'public/')));
app.use('/bootstrap', express.static(PATH.join(__dirname, 'node_modules/bootstrap/dist')));

app.set('view engine', 'ejs');
app.set('views', PATH.join(__dirname, 'views'));

const indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

const videojuegosRouter = require('./routes/api/videogames.js');
app.use('/api/v1/videojuegos', videojuegosRouter);

app.listen(PORT, () => {
    console.log(`La aplicación está corriendo en el puerto: ${PORT}`);
})
