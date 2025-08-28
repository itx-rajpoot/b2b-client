import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const redirectToCheckout = async function(sessionId) {
  const stripe = await stripePromise;
  return await stripe.redirectToCheckout({ sessionId });
}