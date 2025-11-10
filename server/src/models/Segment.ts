import mongoose, { Schema, Document } from 'mongoose';

interface ISegmentRule {
  field: string;
  operator: string;
  value: string;
  logic?: 'AND' | 'OR';
}

export interface ISegment extends Document {
  name: string;
  type: 'dynamic' | 'static';
  rules: ISegmentRule[];
  contactCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SegmentRuleSchema = new Schema({
  field: {
    type: String,
    required: true,
  },
  operator: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  logic: {
    type: String,
    enum: ['AND', 'OR'],
    default: 'AND',
  },
}, { _id: false });

const SegmentSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['dynamic', 'static'],
      required: true,
      default: 'dynamic',
    },
    rules: {
      type: [SegmentRuleSchema],
      default: [],
    },
    contactCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering
SegmentSchema.index({ type: 1, isActive: 1 });

export default mongoose.model<ISegment>('Segment', SegmentSchema);
