# Dr. Butler Checkout API

Backend API service for processing Stripe checkout from the products page.

## Features

- Stripe Checkout integration
- Shopping cart session management
- Secure payment processing
- Automatic shipping address collection
- Phone number collection
- Billing address collection
- Order confirmation page

## Setup Instructions

### 1. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Create a Stripe account or log in
3. Navigate to **Developers** → **API keys**
4. Copy your **Secret key** (starts with `sk_test_` for test mode)
5. For production, use your **Live mode** secret key (starts with `sk_live_`)

### 2. Configure Environment Variables

1. Copy the example environment file:
```bash
cd api
cp .env.example .env
```

2. Edit `.env` and add your Stripe secret key:
```bash
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key_here
PORT=3000
DOMAIN=http://localhost:3000
```

### 3. Install Dependencies

```bash
cd api
npm install
```

### 4. Start the Development Server

```bash
npm start
```

Server runs on `http://localhost:3000`

### 5. Test the Checkout Flow

1. Open your website in a browser
2. Navigate to the products page
3. Add items to cart
4. Click "Proceed to Checkout"
5. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any billing ZIP code

## Deploy to Production

### Option 1: Railway

1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select this repository and the `/api` directory
5. Add environment variables in Railway:
   - `STRIPE_SECRET_KEY` - Your live Stripe secret key
   - `DOMAIN` - Your production domain (e.g., `https://drchristopherbutler.com`)
6. Deploy

### Option 2: Heroku

1. Install Heroku CLI
2. Run:
```bash
cd api
heroku create dr-butler-checkout
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
heroku config:set DOMAIN=https://drchristopherbutler.com
git push heroku main
```

### Option 3: Vercel/Netlify

Both platforms support Node.js APIs. Follow their deployment guides for Express apps.

## Update Frontend for Production

After deploying, update `products.html` line 1130:

```javascript
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://your-railway-app.railway.app'; // Update with your actual API URL
```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/create-checkout-session` - Create Stripe checkout session from cart items

### Create Checkout Session

**Request:**
```json
POST /api/create-checkout-session
{
  "items": [
    {
      "id": 1234567890,
      "name": "Cold Quell (CQ)",
      "brand": "Blue Poppy Herbs",
      "price": "60.00",
      "image": "https://...",
      "ghlProductId": "..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

## Stripe Configuration

The checkout session includes:
- **Payment methods**: Credit/debit cards
- **Shipping address collection**: US only
- **Phone number collection**: Enabled
- **Billing address collection**: Required
- **Success URL**: `/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`
- **Cancel URL**: `/products.html?canceled=true`

## Production Checklist

- [ ] Get Stripe live API key
- [ ] Set environment variables in production
- [ ] Update `DOMAIN` environment variable
- [ ] Update frontend API URL in `products.html`
- [ ] Test with Stripe test cards
- [ ] Enable Stripe live mode
- [ ] Configure Stripe email notifications
- [ ] Set up Stripe webhooks (optional, for order tracking)
- [ ] Update CORS settings if needed

## Stripe Test Cards

Use these test cards in test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

All test cards use:
- Any future expiry date
- Any 3-digit CVC
- Any billing postal code

## Security Notes

- Never commit `.env` file to git (it's in `.gitignore`)
- Never expose your Stripe secret key in frontend code
- Always use environment variables for sensitive data
- Use HTTPS in production
- Keep Stripe SDK updated

## Support

For issues or questions:
- Check [Stripe Documentation](https://stripe.com/docs/checkout/quickstart)
- Review server logs
- Contact support at (973) 705-7800
