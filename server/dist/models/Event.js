import mongoose, { Schema } from 'mongoose';
const eventSchema = new Schema({
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    quota: { type: Number, required: true, min: 1 },
    description: { type: String, default: '' },
    createdBy: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model('Event', eventSchema);
