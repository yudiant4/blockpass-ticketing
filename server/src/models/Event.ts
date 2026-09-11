import mongoose, { Schema, Document } from 'mongoose';

export interface ITier extends Document {
  tierId: string;
  tierName: string;
  price: number;
  quota: number;
  sold: number;
  maxPerWallet: number;
  perks: string[];
  customFields: string[];
}

export interface IEvent extends Document {
  title: string;
  slug: string;
  category: string;
  startDate: Date;
  endDate: Date;
  location: string;
  bannerUrl: string;
  description: string;
  createdBy: string;
  status: 'Draft' | 'Published' | 'Ended';
  tiers: ITier[];
  createdAt: Date;
  updatedAt: Date;
}

const tierSchema = new Schema<ITier>({
  tierId: { type: String, required: true },
  tierName: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  quota: { type: Number, required: true, min: 1 },
  sold: { type: Number, default: 0, min: 0 },
  maxPerWallet: { type: Number, default: 2, min: 1 },
  perks: { type: [String], default: [] },
  customFields: { type: [String], default: [] },
}, { _id: false });

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Sports/Race', 'Music', 'Conference', 'Web3'],
    trim: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true, trim: true },
  bannerUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  createdBy: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Ended'], 
    default: 'Draft' 
  },
  tiers: { type: [tierSchema], required: true, validate: {
    validator: (v: ITier[]) => v.length >= 1,
    message: 'Minimal 1 tier diperlukan'
  }},
}, { timestamps: true });

eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ createdBy: 1 });

export default mongoose.model<IEvent>('Event', eventSchema);