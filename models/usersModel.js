const Model = require('../interfaces/Model');

class User extends Model{
    constructor(){
        super('users');
    }

}

module.exports = User;