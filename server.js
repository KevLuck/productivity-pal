const path = require('path');
const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
const exphbs = require('express-handlebars')
const helpers = require('./utils/helpers')


const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

//shortcut to use hbs instead of handlebars
const hbs = exphbs.create({ defaultLayout: "main", extname: '.hbs', helpers: helpers });


const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        // /TODO after testing - add cookie settings 
        maxAge: 300000 * 60,
        http: true,
        secure: false,
        sameSite: "strict"
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));
// Inform Express.js on which template engine to use
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`));
})