const Model = require('../interfaces/Model');

class Chat extends Model{
    constructor(){
        super('chats');
    }

}

module.exports = Chat;