import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  email: string;
  firstName: string;
  lastName: string;
  tags: string[];
  country: string;
  city: string;
  score: number;
  customFields: Map<string, any>;
  segments: mongoose.Types.ObjectId[];
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  lastActivityAt?: Date;
  lastEmailOpenedAt?: Date;
  lastEmailClickedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    country: {
      type: String,
      index: true,
    },
    city: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true,
    },
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
      default: new Map(),
    },
    segments: [{
      type: Schema.Types.ObjectId,
      ref: 'Segment',
    }],
    status: {
      type: String,
      enum: ['subscribed', 'unsubscribed', 'bounced'],
      default: 'subscribed',
      index: true,
    },
    lastActivityAt: {
      type: Date,
    },
    lastEmailOpenedAt: {
      type: Date,
    },
    lastEmailClickedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
ContactSchema.index({ email: 1, status: 1 });
ContactSchema.index({ tags: 1, createdAt: -1 });
ContactSchema.index({ country: 1, score: -1 });

// Virtual for full name
ContactSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

export default mongoose.model<IContact>('Contact', ContactSchema);
