const helpers = {
    errors: {
        login_or_password_is_incorrect: 'Login və ya şifrə yanlışdır'
    },
    getErrorMessage: function(req){
        let error = req.query.error;
        return error ? this.errors[error] : null;
    },
    generateUserName: function(fullName){
        let letters = ['ü','ö','ğ','ı','ə','ç','ş'];
        let lettersReplace = ['u','o','gh','i','e','ch','sh'];
        fullName = fullName.toLowerCase().replace(/\s/i,'.');
        for(letter of fullName){
            let index = letters.indexOf(letter);
            if(index!==-1)
                fullName = fullName.replace(new RegExp(letter,'ig'),lettersReplace[index]);
        }
        return fullName;
    }
};


Array.prototype.removeIndex = function(key,value){
    let newObject = [];
    this.map(obj=>{
        if(obj[key]!==value){
            newObject.push(obj);
        }
    });
    return newObject;
};

module.exports = helpers;