import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  contactId: mongoose.Types.ObjectId;
  type: 'email_open' | 'email_click' | 'form_submit' | 'page_view' | 'unsubscribe';
  campaignId?: mongoose.Types.ObjectId;
  landingPageId?: mongoose.Types.ObjectId;
  linkUrl?: string;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  device?: string;
  createdAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    contactId: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['email_open', 'email_click', 'form_submit', 'page_view', 'unsubscribe'],
      required: true,
      index: true,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      index: true,
    },
    landingPageId: {
      type: Schema.Types.ObjectId,
      ref: 'LandingPage',
      index: true,
    },
    linkUrl: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    country: {
      type: String,
    },
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound indexes for efficient queries
EventSchema.index({ contactId: 1, type: 1, createdAt: -1 });
EventSchema.index({ campaignId: 1, type: 1, createdAt: -1 });
EventSchema.index({ landingPageId: 1, type: 1, createdAt: -1 });
EventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 }); // TTL: 1 year

export default mongoose.model<IEvent>('Event', EventSchema);
