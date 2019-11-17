const Model = require('../interfaces/Model');

class Messages extends Model{
    constructor(){
        super('messages');
    }

}

module.exports = Messages;