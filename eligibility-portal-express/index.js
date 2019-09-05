const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const signInCtrl = require('./controllers/signInCtrl');
const employerCtrl = require('./controllers/employerCtrl');
const memberCtrl = require('./controllers/memberCtrl');
const messageCtrl = require('./controllers/messageCtrl');
const path = require('path');


app.use(bodyParser.json());
app.use(express.json())

app.use(express.static(path.join(__dirname, 'client','build')));

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))

massive('postgres://vprcrewv:nZGJ4ouq6fOokJp2JfnVNC09iObMndiT@raja.db.elephantsql.com:5432/vprcrewv?ssl=true')
.then(db => {
    console.log('connected to db');
    app.set('db', db);
});

app.use(session({
    secret: 'th1$IsTh3$ec7et',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.post('/signIn', signInCtrl.signIn);

app.put('/signOut', signInCtrl.signOut);

app.post('/signUp', signInCtrl.signUp);

app.get('/getUserRole', signInCtrl.getUserRole);

app.post('/createAccount', signInCtrl.createAccount);

app.get('/member', memberCtrl.viewMemberInfo);

app.get('/employer', employerCtrl.getEmployerInfo);

app.get('/employer/viewEmployees', employerCtrl.viewEmployees);

app.post('/employer/addNewEmployee', employerCtrl.addNewEmployee);

app.delete('/employer/deleteMember/:memberId', employerCtrl.deleteEmployee);

app.put('/employer/updateEmployee', employerCtrl.updateEmployee);

app.get('/employer/employee/:memberId', employerCtrl.getEmployee);

app.get('/getconversations', messageCtrl.getConversations);

app.post('/getconvomessages', messageCtrl.getConvoMessages);

app.post('/markasread', messageCtrl.markAsRead);

app.get('/unreadmessages', messageCtrl.getUnreadMessageCount);

app.post('/sendmessage', messageCtrl.sendMessage);

const port = process.env.PORT ? process.env.PORT : 8080;
app.listen(port, () => console.log(`listening on port ${port}`));