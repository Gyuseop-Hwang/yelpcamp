const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const campgroundRouter = require('./routes/campgrounds');
const reviewRotuer = require('./routes/reviews');
const authRouter = require('./routes/auth');

const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
  .then(() => {
    console.log('Mongo connection succeeded')
  })
  .catch(err => {
    console.log('Mongo connection failed')
    console.log(err)
  })

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: false,
  // store : 나중에 mongoDB로 지정. 지금은 현재 개발중이므로 local, production시에 session DB 필요
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 일주일
    maxAge: 1000 * 60 * 60 * 24 * 14,
  }
}
app.use(session(sessionConfig));
app.use(flash()) // session에 flash value를 저장했다가 사용할 때 pop하기 때문에 session이 먼저 필요함.

app.use(passport.initialize())
app.use(passport.session()) // session이 필요하므로 app.use(session)이후에 해야 함.

passport.use(new LocalStrategy(User.authenticate()));
// passport야 우리가 passport-local로 생성한 localStrategy를 사용해줄래?
// 모델에 static 메소드로 authenticate 생성됨 passport localStrategy에서 사용되는 함수를 생성함.

passport.serializeUser(User.serializeUser());
// 세션에 정보를 어떻게 저장하고 가져오는지를 결정하는 메서드
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session)
  console.log(req.user)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  console.log(req.session)
  next();
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));



app.get('/', (req, res) => {
  res.render('home')
})

app.get('/fakeUser', async (req, res) => {
  const user = new User({ email: 'gyuseop@gmail.com', username: 'colttt' })
  const newUser = await User.register(user, 'chicken'); // username 중복 여부 확인 및 password hash화시킴.(salt + hashing)
  res.send(newUser);
})

app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/reviews', reviewRotuer)
app.use('/', authRouter);

app.all('*', (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = 'Server Problem';
  res.status(status).render('error', { err })
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})