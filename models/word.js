
const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
 
    value : {
        type : String 
    } , 
   
} );

WordSchema.statics.random = async function() {
    const count = await this.count(); 
    var rand = Math.floor(Math.random() * count);
     return await this.findOne().skip(rand); 
};

module.exports = mongoose.model('word', WordSchema);