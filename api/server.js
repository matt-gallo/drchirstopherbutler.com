const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_KEY_HERE');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GHL Configuration
const GHL_CONFIG = {
    apiKey: process.env.GHL_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiaHpIckdEYUkzV1VDbEJRNldIUUUiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3NjkxMTQ2OTI3NjEsInN1YiI6Im5Iekc1eUxHZ3NoWldFNDhPRWx5In0.lQ3mEuqmAGw5e95tWIclXyBX_yW8t0cKWlDU0XC8_rY',
    locationId: process.env.GHL_LOCATION_ID || 'MsoeghK7h7k7098rgLJx'
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Dr. Butler Checkout API is running' });
});

// Test GHL API access
app.get('/api/test-ghl', async (req, res) => {
    const tests = [];

    // Test 1: Get products
    try {
        const productsResponse = await fetch(`https://services.leadconnectorhq.com/products/?locationId=${GHL_CONFIG.locationId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${GHL_CONFIG.apiKey}`,
                'Version': '2021-07-28'
            }
        });
        const productsData = await productsResponse.json();
        tests.push({
            endpoint: 'GET /products',
            status: productsResponse.status,
            success: productsResponse.ok,
            data: productsData
        });
    } catch (err) {
        tests.push({ endpoint: 'GET /products', error: err.message });
    }

    // Test 2: Get payment links/checkout links
    try {
        const linksResponse = await fetch(`https://services.leadconnectorhq.com/payments/links?locationId=${GHL_CONFIG.locationId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${GHL_CONFIG.apiKey}`,
                'Version': '2021-07-28'
            }
        });
        const linksData = await linksResponse.json();
        tests.push({
            endpoint: 'GET /payments/links',
            status: linksResponse.status,
            success: linksResponse.ok,
            data: linksData
        });
    } catch (err) {
        tests.push({ endpoint: 'GET /payments/links', error: err.message });
    }

    // Test 3: Check orders endpoint
    try {
        const ordersResponse = await fetch(`https://services.leadconnectorhq.com/payments/orders?locationId=${GHL_CONFIG.locationId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${GHL_CONFIG.apiKey}`,
                'Version': '2021-07-28'
            }
        });
        const ordersData = await ordersResponse.json();
        tests.push({
            endpoint: 'GET /payments/orders',
            status: ordersResponse.status,
            success: ordersResponse.ok,
            data: ordersData
        });
    } catch (err) {
        tests.push({ endpoint: 'GET /payments/orders', error: err.message });
    }

    res.json({ tests });
});

// Create Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items provided' });
        }

        console.log('Creating Stripe checkout session for items:', items);

        // Convert cart items to Stripe line items
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: item.brand,
                    images: item.image ? [item.image] : []
                },
                unit_amount: Math.round(parseFloat(item.price) * 100) // Convert to cents
            },
            quantity: 1
        }));

        // Determine success and cancel URLs based on environment
        const domain = process.env.DOMAIN || 'http://localhost:3000';

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${domain}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domain}/products.html?canceled=true`,
            shipping_address_collection: {
                allowed_countries: ['US']
            },
            phone_number_collection: {
                enabled: true
            },
            billing_address_collection: 'required'
        });

        console.log('Stripe session created:', session.id);

        res.json({
            success: true,
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({
            error: 'Failed to create checkout session',
            message: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Dr. Butler Checkout API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
