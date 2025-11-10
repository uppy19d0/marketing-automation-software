import mongoose, { Schema, Document } from 'mongoose';

interface ITriggerConfig {
  landingPageId?: mongoose.Types.ObjectId;
  campaignId?: mongoose.Types.ObjectId;
  tagName?: string;
}

interface IActionDelay {
  value: number;
  unit: 'minutes' | 'hours' | 'days';
}

interface IActionConfig {
  tagName?: string;
  campaignId?: mongoose.Types.ObjectId;
  delay?: IActionDelay;
}

interface IAutomationAction {
  order: number;
  type: 'assign_tag' | 'remove_tag' | 'send_campaign';
  config: IActionConfig;
}

interface IAutomationStats {
  contactsEntered: number;
  contactsCompleted: number;
  contactsActive: number;
  successRate: number;
}

export interface IAutomation extends Document {
  name: string;
  status: 'active' | 'paused' | 'archived';
  trigger: {
    type: 'form_submit' | 'tag_added' | 'campaign_opened' | 'campaign_clicked';
    config: ITriggerConfig;
  };
  actions: IAutomationAction[];
  stats: IAutomationStats;
  lastTriggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TriggerConfigSchema = new Schema({
  landingPageId: {
    type: Schema.Types.ObjectId,
    ref: 'LandingPage',
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
  },
  tagName: {
    type: String,
  },
}, { _id: false });

const ActionDelaySchema = new Schema({
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    enum: ['minutes', 'hours', 'days'],
    required: true,
  },
}, { _id: false });

const ActionConfigSchema = new Schema({
  tagName: {
    type: String,
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
  },
  delay: {
    type: ActionDelaySchema,
  },
}, { _id: false });

const AutomationActionSchema = new Schema({
  order: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ['assign_tag', 'remove_tag', 'send_campaign'],
    required: true,
  },
  config: {
    type: ActionConfigSchema,
    required: true,
  },
}, { _id: false });

const AutomationStatsSchema = new Schema({
  contactsEntered: { type: Number, default: 0 },
  contactsCompleted: { type: Number, default: 0 },
  contactsActive: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
}, { _id: false });

const AutomationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'archived'],
      default: 'active',
      index: true,
    },
    trigger: {
      type: {
        type: String,
        enum: ['form_submit', 'tag_added', 'campaign_opened', 'campaign_clicked'],
        required: true,
      },
      config: {
        type: TriggerConfigSchema,
        required: true,
      },
    },
    actions: {
      type: [AutomationActionSchema],
      default: [],
      validate: {
        validator: function(actions: IAutomationAction[]) {
          return actions.length > 0;
        },
        message: 'At least one action is required',
      },
    },
    stats: {
      type: AutomationStatsSchema,
      default: () => ({}),
    },
    lastTriggeredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering
AutomationSchema.index({ status: 1, lastTriggeredAt: -1 });

export default mongoose.model<IAutomation>('Automation', AutomationSchema);
