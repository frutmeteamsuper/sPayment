const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/stripe_checkout',async (req,res)=>{
	const stripeToken = req.body.stripeToken;
	const cantidad = req.body.cantidad;
	const receipt_email = req.body.receipt_email;
	const description = req.body.description;
	const cantidadInCAD=Math.round(cantidad*100);
	const chargeObject= await stripe.charges.create({
		amount: cantidadInCAD,
		currency: 'cad',
		source: stripeToken,
		capture: false,
		description: description,
		receipt_email: receipt_email
	});
	try{
		await stripe.charges.capture(chargeObject.id);
		res.json(chargeObject);
	}catch(error){
		await stripe.refunds.create({charge: chargeObject.id});
		res.json(chargeObject);
	}
});


app.listen(3030, ()=>{
	console.log('Server is running on port 3000!!!');
})