import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    symbol: { type: String, required: true, default: 'BTC/USD' },
    side: { type: String, required: true, enum: ['BUY', 'SELL'] },
    orderType: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: 'OPEN' }
}, { timestamps: true });

export default mongoose.model('Trade', tradeSchema);