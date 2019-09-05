module.exports = {
    viewMemberInfo: async (req, res) => {
        try {
            const memberInfo = req.session.user;
            res.send(memberInfo);

        } catch (error) {
            console.log(error);
        }
    }
}