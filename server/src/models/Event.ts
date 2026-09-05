import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: Date;
  price: number;
  location: string;
  quota: number;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    quota: { type: Number, required: true, min: 1 },
    description: { type: String, default: '' },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', eventSchema);
