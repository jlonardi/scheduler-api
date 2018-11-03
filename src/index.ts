import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import pgConnect from 'connect-pg-simple';
import passport from 'passport';
import { Strategy } from 'passport-http-bearer';
import { get } from 'request-promise';
import morgan from 'morgan';
import cors from 'cors';
import { isAuthenticated } from './utils/middlewares';
import { queryAsync } from './db/postgres';
import taskRoutes from './services/routes';
import { LoggerStream, logger } from './utils/logger';
import { getFinalErrorHandler } from './errors/expressErrorHandler';

// Heroku passes only the database url in the DATABASE_URL variable so some parsing is needed here
const { DATABASE_URL, SESSION_SECRET } = process.env;

if (DATABASE_URL) {
  process.env.PGHOST = DATABASE_URL.split('postgres://')[1].split('@')[1].split('/')[0].split(':')[0];
  process.env.PGUSER = DATABASE_URL.split('postgres://')[1].split('@')[0].split(':')[0];
  process.env.PGPASSWORD = DATABASE_URL.split('postgres://')[1].split('@')[0].split(':')[1];
  process.env.PGDATABASE = DATABASE_URL.split('postgres://')[1].split('@')[1].split('/')[1];

}

const pgSession = pgConnect(session);
const BearerStrategy = Strategy;

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('combined', { stream: new LoggerStream() }));

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
const maxAge = 7 * 24 * 60 * 60 * 1000;
if (SESSION_SECRET) {
  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge,
    },
    store: new pgSession({
      conString: process.env.DATABASE_URL,
      pruneSessionInterval: 60,
    }),
  }));
}

const addUser = (id: string) =>
  queryAsync('INSERT INTO users (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [id]);

// Validate the token at google, if it is ok for google it is ok for us
passport.use(new BearerStrategy(
  (token, done) =>
  get(`https://www.googleapis.com/plus/v1/people/me?access_token=${token}`)
  .then(({ body }) => JSON.parse(body))
  .then((user) => {
    if (user.id) {
      return addUser(user.id)
      .then(() => done(null, user));
    }
    return (done(null, false));
  })
  .catch(done),
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// app.use('/auth', authRoutes);
app.use('/services', isAuthenticated, taskRoutes);

app.use('/health', (req, res) => res.send('OK'));

app.listen(port, () => {
  logger.info(`server started on: ${port}`);
});

app.use(getFinalErrorHandler(app.get('env') === 'development', logger));
