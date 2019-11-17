const db = require('../db');

class Model {
    constructor(table){
        this.table = table;
        this.generatePrimaryQuery();
    }

    create(data,callback=null){
        db.query(`insert into ${this.table} set ?`,data,(err,result)=>{
            if(callback)
                callback(result,err);
        });
    }

    generatePrimaryQuery(){
        this.query = `select * from ${this.table}`;
    }

    select(selects){
        this.query = `select ${selects} from ${this.table}`;
        return this;
    }

    checkParameterExists(parameter){
        return this.query.match(new RegExp(parameter,'i'));
    }

    find(id,callback){
        this.where('id',id).get((result,err) => {
            callback(result);
        });
    }



    where(statement,value,withBraces=false){
        if(this.checkParameterExists('where')){
            this.generatePrimaryQuery();
        }
        if(typeof statement==="object"){
            let whereKeys = Object.keys(statement);
            let whereValues = Object.values(statement);
            for(let where of whereValues){
                let index = whereValues.indexOf(where);
                let stmt = whereKeys[index];
                let vl = whereValues[index];
                if(index===0){
                    this.query += ` where ${stmt}="${vl}"`;
                }else{
                    this.query += ` and ${stmt}="${vl}"`;
                }
            }
        }else{
            this.query += ` where ${withBraces?'(':''}${statement}="${value}"`;
        }
        return this;
    }

    andWhere(where,statement,withBraces=false){
        this.query += ` and ${where}="${statement}"${withBraces?')':''}`;
        return this;
    }

    andNotWhere(where,statement,withBraces=false){
        this.query += ` and ${where}!="${statement}"${withBraces?')':''}`;
        return this;
    }

    orWhere(where,statement,withBraces=false){
        this.query += ` or ${where}="${statement}"${withBraces?')':''}`;
        return this;
    }

    orNotWhere(where,statement,withBraces=false){
        this.query += ` or ${where}!="${statement}"${withBraces?')':''}`;
        return this;
    }

    join(table,on,as=null){
        as = as||table;
        this.query += ` join ${table} as ${as} on ${on}`;
        return this;
    }

    leftJoin(table,on,as=null){
        as = as||table;
        this.query += ` left join ${table} as ${as} on ${on}`;
        return this;
    }

    rightJoin(table,on,as=null){
        as = as||table;
        this.query += ` right join ${table} as ${as} on ${on}`;
        return this;
    }

    joinOn(table,firstTableOnField,secondTableOnField){
        this.query += ` join ${table} on ${this.table}.${firstTableOnField} = ${table}.${secondTableOnField}`;
        return this;
    }

    orderBy(statement, sort='asc'){
        this.query += ` order by ${statement} ${sort}`;
        return this;
    }



    groupBy(statement){
        if(this.checkParameterExists('order by')){
            throw 'groupBy function must be called before orderBy function';
            return;
        }
        this.query += ` group by ${statement}`;
        return this;
    }

    get(callback){
        db.query(this.query,function (err, result) {
            if(result){
                result = result.length===0?null:result[0];
            }
            callback(result,err);
        })
        return this;
    }

    getAll(callback){
        db.query(this.query,function (err, result) {
            result = result.length===0?null:result;
            callback(result,err);
        });
        return this;
    }

    sql(callback){
        callback(this.query);
    }


}

module.exports = Model;