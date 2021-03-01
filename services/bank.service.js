const User = require('../models/user')
let accountDetails = {

    userone: { acno: 1000, name: "ajay", balance: 1000, username: "userone", password: "testuser", history: [] },
    usertwo: { acno: 1001, name: "sajay", balance: 20000, username: "usertwo", password: "testuser1", history: [] },
    userthree: { acno: 1002, name: "vijay", balance: 25000, username: "userthree", password: "testuser2", history: [] },


};
const authenticateUser = (uname, pwd) => {
    return User.findOne({

        username: uname,
        password: pwd


    })
    
}
const deposit = (_id, amount) => {
   
    return User.findById(_id)
        .then(user => {

            user.balance += amount;
            user.history.push({
                amount,
                typeOfTransaction: "credit"

            });
            user.save();

            return {
                balance: user.balance,
                message: "your account credited with amount" + amount + "avail bal=" + user.balance
            };
        })
}

const withdraw = (_id, amount) => {
    return User.findById(_id)
        .then(user => {
            if (user.balance < amount) {
                return {
                    message: "insufficient balance"
                }
            }
            user.balance -= amount;
            user.history.push({
                amount:amount,
                typeOfTransaction: "debit"

            });
            user.save();

            return {
                balance: user.balance,
                message: "your account debited with amount" + amount + "avail bal=" + user.balance
            };
        })
}
const getUser = (_id) => {
   
    return User.findById(_id)
}
const updateUser = function(_id,data){
    return User.findOneAndUpdate({_id},data);

}
const getUsers = function(){
    return User.find();
}
module.exports = {
    authenticateUser,
    deposit,
    withdraw,
    getUser,
    updateUser,
    getUsers
}