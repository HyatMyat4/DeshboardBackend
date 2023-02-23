const { db } = require("../Firebaseconfig");
const stripe = require('stripe')(process.env.Stripe_Secret);
const endpointSecret  = process.env.webhook_Secret

const { buffer } = require("micro")

const fullFaill_Order = async (session) => { 
     const Order_Ref = db.collection("Users_Order").doc(session.metadata.id)
     const Order_data = await Order_Ref.get()
     const Users_Order = await db.collection("Users_Order").doc(session.metadata.id).set({  
         Order_data : Order_data.data().Order_data ,
         email : session.metadata.email,    
         userImage: session.metadata.userImage ,               
         name : session.customer_details.name ,          
         amount : session.amount_total / 100 ,
         phone: session.customer_details.phone,         
         city : session.customer_details.address.city ,
         country: session.customer_details.address.country,
         town: session.customer_details.address.line1,
         postal_code : session.customer_details.address.postal_code ,
         state : session.customer_details.address.state ,          
        
      });    
}

const WEb_Hook = async (req , res ) => {
    try{      
        let event = req.body;        
        // Only verify the event if you have an endpoint secret defined.
        // Otherwise use the basic event deserialized with JSON.parse
        if (endpointSecret) {
          // Get the signature sent by Stripe
          try{
          const signature = req.headers['stripe-signature'];          
            event = stripe.webhooks.constructEvent(
              req.body,
              signature,
              endpointSecret
            );      
          }catch(err){
            console.log(err)
          }  
        }
      
        // Handle the event
         if(event.type === 'checkout.session.completed'){         
            const session = event.data.object
             return  fullFaill_Order(session)
            
         }
      
}catch(err){
    return res.status(403).json({ message: err.message})
} 
}


module.exports = {
    WEb_Hook,
  };

  //4242 4242 4242 4242