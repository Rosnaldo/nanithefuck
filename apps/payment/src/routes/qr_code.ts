import Stripe from 'stripe';
import { Express } from 'express';
import Properties from '#properties/index';

const stripe = new Stripe(Properties.stripeSecretKey);

async function criarPix() {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 100, // centavos → R$ 50,00
        currency: "brl",
        payment_method_types: ["pix"],
        description: "Pagamento via PIX Stripe",
    });

    console.log(paymentIntent);
}

export default (app: Express) => {
    app.post('/qr-code', async (req, res) => {

        criarPix();

        return res.status(200).send({ message: 'Hello World' });
    });
};
