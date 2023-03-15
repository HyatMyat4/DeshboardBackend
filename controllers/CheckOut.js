const { db } = require("../Firebaseconfig");
const stripe = require('stripe')(process.env.Stripe_Secret);

const CheckOut = async (req , res) => {
    try{
       const { items, Email , userImage } = req.body
       if(!items || !Email) return res.status(404).json({message : "Please Faill Items"})
       
       const tramFrom_data = await items.map((item) => ({        
           quantity: 1 ,
           price_data: {
             currency: 'usd',
             unit_amount: Number(item.Price) * 100 ,
             product_data: {
                name: item.name ,
                description: `${item.Foodinfo.slice(0 , 30)}...` ,
                images: [item.FoodImage] ,
             },
           } ,
       } )) ;
       const Order_data = await items.map((item) => ({        
           quantity: 1 ,         
           Price: Number(item.Price) ,            
           name: item.name ,
           description: item.Foodinfo ,
           images: item.FoodImage ,       
       } )) ;

       const Users_Order = await db.collection("Users_Order").add({
          Order_data: Order_data,
       })       
      
       const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          shipping_address_collection: {allowed_countries: ['US', 'CA','GB']},         
          shipping_options: [{shipping_rate: 'shr_1Masu1LEcPSAQWYOq9KOfWYn'}],            
          line_items: tramFrom_data,         
          mode: 'payment',
          success_url: `https://admin-dashboard-hyatmyat4.vercel.app/SuccessPayment`,
          cancel_url: `https://admin-dashboard-hyatmyat4.vercel.app/`,
          metadata: { 
             email : Email ,  
             userImage: userImage ,    
             id : Users_Order.id
                           
          }
       })
       
       
       res.status(200).json({ id: session.id , order_id : Users_Order.id })

    } catch (err) {
        return res.status(403).json({ message: err.message})
    }
} 

module.exports = {
    CheckOut,
  };