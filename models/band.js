const { v4:uuidV4 } = require('uuid');

class Band{

    constructor(name = 'no hay nombre'){

        this.id = uuidV4();//Identificador único
        this.votes = 0;
        this.name = name;

    }

}

module.exports = Band;