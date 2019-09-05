const bcrypt = require('bcrypt');

module.exports = {
    signIn: async (req, res) => {
        try {
            const db = req.app.get('db');

            const { username, password } = req.body;
            if (!username || !password) return res.status(400).send('Please enter username and password');

            const [user] = await db.login.find({ username });
            
            if (!user) {
                console.log('invalid username')
                res.status(400).send('invalid username or password')
            }

            const memberId = user.memberid;
            const [userInfo] = await db.memberlogininfo.find({ memberid: memberId });
            
            const authenticated = await bcrypt.compare(password, user.password);

            if (authenticated) {
                req.session.user = userInfo;
                console.log('login successfull')
                delete userInfo.employeessn;
                res.send(userInfo);
            } else {
                console.log('invalid password')
                res.status(400).send('invalid username or password')
            }
        } catch (error) {
            console.log(error);
        }
    },

    signUp: async (req, res) => {
        try {
            const db = req.app.get('db');

            const {firstName, lastName, ssn} = req.body;
            if(!firstName || !lastName || !ssn) return res.status(400).send('Please enter your name and ssn');

            const [user] = await db.member.find({employeessn: ssn, firstname: firstName, lastname: lastName});
            const [credentialsExist] = await db.memberlogininfo.find({employeessn: ssn});

            if(credentialsExist) return res.status(400).send('User has already created an account');
            
            if(user) {
                req.session.user = user;
                res.send('create username and password');
            } else {
                res.status(400).send('user not found');
            }
            
        } catch (error) {
            console.log(error);
        }
    },

    createAccount: async (req, res) => {
        try {
            const db = req.app.get('db');
            const {email, username, password} = req.body;
            const hash = await bcrypt.hash(password, 10);
            
            
            if(!email || !username || !password) return res.status(400).send('Please create a username and password, and enter your email');
            if(username.length > 20) return res.status(400).send('Username is too long');

            const [usernameExists] = await db.login.find({username: username});

            if(usernameExists) return res.status(400).send('Username already exists. Please choose a different username');

            if(!req.session.user) return res.status(400).send('User did not enter name and ssn');

            const memberId = req.session.user.memberid;

            const accountCreated = await db.login.insert({
                memberid: memberId,
                email: email,
                username: username,
                password: hash
            })

            delete accountCreated.password;
            res.send(accountCreated);

        } catch (error) {
            console.log(error);
        }
    },

    getUserRole: async (req, res) => {
        try {
            const db = req.app.get('db');
            let memberId = '';

            if(req.session.user) memberId = req.session.user.memberid;

            const [userRole] = await db.userroleview.find({memberid: memberId});
            const role = {
                memberId: userRole.memberid,    
                role: userRole.userrole
            };
                
            if(!role) return res.status(400).send('No Role Found');

            res.send(role);
        } catch (error) {
            res.send('No Role Found');
        }
    },

    signOut: (req, res) => {
        req.session.destroy();

        res.send('User Signed Out');
    }
}