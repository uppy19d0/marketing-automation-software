import mongoose, { Schema, Document } from 'mongoose';

interface IContentBlock {
  type: 'title' | 'paragraph' | 'button' | 'image';
  content: string;
  styling?: any;
}

interface IVariant {
  name: string;
  subject: string;
  trafficPercentage: number;
  metrics: {
    sent: number;
    opens: number;
    clicks: number;
  };
}

interface ICampaignStats {
  sent: number;
  delivered: number;
  opens: number;
  uniqueOpens: number;
  clicks: number;
  uniqueClicks: number;
  bounces: number;
  unsubscribes: number;
  conversions: number;
  revenue: number;
}

export interface ICampaign extends Document {
  name: string;
  subject: string;
  preheader: string;
  content: {
    html: string;
    blocks: IContentBlock[];
  };
  isABTest: boolean;
  variants: IVariant[];
  segmentId?: mongoose.Types.ObjectId;
  recipientCount: number;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  scheduledAt?: Date;
  sentAt?: Date;
  stats: ICampaignStats;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContentBlockSchema = new Schema({
  type: {
    type: String,
    enum: ['title', 'paragraph', 'button', 'image'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  styling: {
    type: Schema.Types.Mixed,
  },
}, { _id: false });

const VariantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  trafficPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  metrics: {
    sent: { type: Number, default: 0 },
    opens: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
}, { _id: false });

const CampaignStatsSchema = new Schema({
  sent: { type: Number, default: 0 },
  delivered: { type: Number, default: 0 },
  opens: { type: Number, default: 0 },
  uniqueOpens: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  uniqueClicks: { type: Number, default: 0 },
  bounces: { type: Number, default: 0 },
  unsubscribes: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
}, { _id: false });

const CampaignSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    preheader: {
      type: String,
      trim: true,
    },
    content: {
      html: {
        type: String,
        required: true,
      },
      blocks: {
        type: [ContentBlockSchema],
        default: [],
      },
    },
    isABTest: {
      type: Boolean,
      default: false,
    },
    variants: {
      type: [VariantSchema],
      default: [],
    },
    segmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Segment',
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sent', 'sending'],
      default: 'draft',
      index: true,
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
      index: true,
    },
    stats: {
      type: CampaignStatsSchema,
      default: () => ({}),
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
CampaignSchema.index({ status: 1, sentAt: -1 });
CampaignSchema.index({ segmentId: 1, status: 1 });

// Virtual for open rate
CampaignSchema.virtual('openRate').get(function(this: ICampaign) {
  if (this.stats.sent === 0) return 0;
  return (this.stats.uniqueOpens / this.stats.sent) * 100;
});

// Virtual for click-through rate
CampaignSchema.virtual('ctr').get(function(this: ICampaign) {
  if (this.stats.sent === 0) return 0;
  return (this.stats.uniqueClicks / this.stats.sent) * 100;
});

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
