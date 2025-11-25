import mongoose, { Schema, Document } from 'mongoose';

export interface ILandingPageAnalytics extends Document {
  landingPageId: mongoose.Types.ObjectId;
  sessionId?: string;
  eventType: 'page_view' | 'scroll' | 'button_click' | 'form_focus' | 'form_submit' | 'exit_intent';
  metadata: {
    timeOnPage?: number;
    scrollDepth?: number;
    buttonText?: string;
    fieldName?: string;
    referrer?: string;
    url?: string;
    device?: {
      userAgent: string;
      screenWidth: number;
      screenHeight: number;
      deviceType: 'mobile' | 'tablet' | 'desktop';
      browser: string;
      os: string;
    };
    timestamp?: string;
    [key: string]: any;
  };
  ipAddress?: string;
  createdAt: Date;
}

const LandingPageAnalyticsSchema: Schema = new Schema(
  {
    landingPageId: {
      type: Schema.Types.ObjectId,
      ref: 'LandingPage',
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    eventType: {
      type: String,
      enum: ['page_view', 'scroll', 'button_click', 'form_focus', 'form_submit', 'exit_intent'],
      required: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound indexes for efficient queries
LandingPageAnalyticsSchema.index({ landingPageId: 1, eventType: 1, createdAt: -1 });
LandingPageAnalyticsSchema.index({ sessionId: 1, createdAt: -1 });

// TTL: Eventos expiran después de 90 días (más corto que eventos de contacto)
LandingPageAnalyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model<ILandingPageAnalytics>('LandingPageAnalytics', LandingPageAnalyticsSchema);
