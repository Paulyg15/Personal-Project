module.exports = {
    getEmployerInfo: async (req, res) => {
        try {
            const db = req.app.get('db');
            const employerInfo = await db.member.find({ memberid: req.session.user.memberid })

            res.send(employerInfo);
        } catch (error) {
            res.send(error);
        }
    },

    viewEmployees: async (req, res) => {
        try {
            const db = req.app.get('db');
            const employees = await db.employersemployees.find({ employerid: req.session.user.memberid })

            res.send(employees);

        } catch (error) {
            res.send(error);
        }
    },

    addNewEmployee: async (req, res) => {
        try {
            const db = req.app.get('db');

            const { ssn, firstName, lastName, address, city, state, zip, planId } = req.body;
            const checkforSsn = await db.member.find({employeessn: ssn}).employeessn;

            if(checkforSsn) return res.status(400).send('SSN already exists in database');

            if(!ssn || !firstName || !lastName || !address || !city || !state || !zip || !planId) return res.status(400).send('Please enter all the fields');

            await db.query(`call addNewEmployee('${ssn}','${firstName}','${lastName}','${address}','${city}','${state}','${zip}',${planId},'${req.session.user.memberid}')`); 
            const addedMember = await db.query(`select * from member where employeessn = '${ssn}'`);
            const addedMemberResponse = `${addedMember.firstName} ${addedMember.lastName} has been added`;

            res.send(addedMemberResponse);
        } catch (error) {
            res.send(error);
        }
    },

    deleteEmployee: async (req, res) => { 
        try {
            const memberId = req.params.memberId;
            const db = req.app.get('db');
            const firstName = db.member.find({memberid: memberId}).firstName;
            const lastName = db.member.find({memberid: memberId}).lastName;
            const memberName = `${firstName}  ${lastName}`;
console.log(memberName)
            await db.query(`delete from employees where memberid = ${memberId}`);
            await db.query(`delete from login where memberid = ${memberId}`);
            await db.query(`delete from user_roles where memberid = ${memberId}`);
            await db.query(`delete from coveragespans where memberid = ${memberId}`);
            await db.query(`delete from member where memberid = ${memberId}`);


            res.send(`${memberName} has been deleted`);
        } catch (error) {
            res.send(error);
        }
    },

    updateEmployee: async (req, res) => {
        try {
            const db = req.app.get('db');

            await db.query(`call updateEmployee(
                ${req.body.memberId},
                '${req.body.ssn}',
                '${req.body.firstName}',
                '${req.body.lastName}',
                '${req.body.address}',
                '${req.body.city}',
                '${req.body.state}',
                '${req.body.zip}',
                ${req.body.planId})`);

                res.send('Member has been updated');
        } catch (error) {
            res.send(error);
        }
    },

    getEmployee: async (req, res) => {
        try {
            const db = req.app.get('db');
            const memberId = req.params.memberId;
            const [employee] = await db.member.find({memberid: memberId})

            res.send(employee);
        } catch (error) {
            res.send(error);
        }
    }
}