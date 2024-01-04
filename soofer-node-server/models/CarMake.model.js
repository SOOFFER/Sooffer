import mongoose from 'mongoose';

var CarMakeSch = mongoose.Schema({  
	_id: String, 
	datas: [{
		makeid:     { type: Number }, 
		make: String, 
		model:   [String],
	}] 
});

var CarMake = mongoose.model('carmodels', CarMakeSch);
module.exports = CarMake;   