module.exports = {
    getConversations: async (req, res) => {
        try {
            const db = req.app.get('db');

            if(!req.session.user) return res.status(403).send('Not Logged In');

            const memberId = req.session.user.memberid;
            const conversationList = await db.query(`select * from getConversations($1)`, [ memberId ]);

            res.send(conversationList);
        } catch (error) {
            res.send(error);
        }


    },

    getConvoMessages: async (req, res) => {
        try {
            const db = req.app.get('db');
    
            if(!req.session.user) return res.status(403).send('Not Logged In');

            const myMemberId = req.session.user.memberid;
            const theirMemberId = req.body.theirMemberId; 
            const convoMessageList = await db.query(`select * from getConvoMessages($1, $2)`, [myMemberId, theirMemberId]);
            
            res.send(convoMessageList);

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    },
    
    getUnreadMessageCount: async (req, res) => {
        try {
            const db = req.app.get('db');

            if(!req.session.user) return res.status(401).send(null);
    
            const memberId = req.session.user.memberid;
    
            const [unreadMessageCount] = await db.query('select * from getUnreadMessageCount($1)', memberId);
            
            res.send(unreadMessageCount);
        } catch (error) {
            res.send(error);
        }
    },

    markAsRead: async (req, res) => {
        try {
            const db = req.app.get('db');

            if(!req.session.user) return res.status(401).send('Not Logged In');
    
            const myMemberId = req.session.user.memberid;
            const theirMemberId = req.body.theirMemberId;

            await db.query(`call markMessageAsRead(${myMemberId}, ${theirMemberId})`);
            res.send('Marked as read');
        } catch (error) {
            res.send(error);
        }
    },

    sendMessage: async (req, res) => {
        const db = req.app.get('db');

        if(!req.session.user) return res.status(401).send('Not Logged In');

        const senderMemberId = req.session.user.memberid;
        const receiverMemberId = req.body.receiverMemberId;
        const message = req.body.message;
        await db.query('call addMessage($1, $2, $3)', [senderMemberId, receiverMemberId, message])

        res.send(message);
    }
}