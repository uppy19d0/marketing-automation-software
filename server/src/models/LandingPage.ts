import mongoose, { Schema, Document } from 'mongoose';

interface IFormFields {
  name: boolean;
  email: boolean;
  company: boolean;
  phone: boolean;
  jobTitle: boolean;
  message: boolean;
}

interface IStyling {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonStyle: 'solid' | 'outline' | 'gradient';
  layoutStyle: 'centered' | 'split' | 'hero';
  imageUrl?: string;
}

interface ISEO {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  keywords: string[];
}

interface ILandingPageStats {
  visits: number;
  uniqueVisits: number;
  submissions: number;
  conversionRate: number;
  bounceRate: number;
  avgTimeOnPage: number;
}

export interface ILandingPage extends Document {
  name: string;
  templateId?: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  buttonText: string;
  successMessage: string;
  formFields: IFormFields;
  gdprConsent: boolean;
  styling: IStyling;
  seo: ISEO;
  captureSource?: boolean;
  sourceLabel?: string;
  status: 'published' | 'draft' | 'archived';
  stats: ILandingPageStats;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FormFieldsSchema = new Schema({
  name: { type: Boolean, default: true },
  email: { type: Boolean, default: true },
  company: { type: Boolean, default: false },
  phone: { type: Boolean, default: false },
  jobTitle: { type: Boolean, default: false },
  message: { type: Boolean, default: false },
}, { _id: false });

const StylingSchema = new Schema({
  primaryColor: { type: String, default: '#3b82f6' },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#1f2937' },
  buttonStyle: {
    type: String,
    enum: ['solid', 'outline', 'gradient'],
    default: 'solid',
  },
  layoutStyle: {
    type: String,
    enum: ['centered', 'split', 'hero'],
    default: 'centered',
  },
  imageUrl: { type: String },
}, { _id: false });

const SEOSchema = new Schema({
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  ogImage: { type: String },
  keywords: { type: [String], default: [] },
}, { _id: false });

const LandingPageStatsSchema = new Schema({
  visits: { type: Number, default: 0 },
  uniqueVisits: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 },
  bounceRate: { type: Number, default: 0 },
  avgTimeOnPage: { type: Number, default: 0 },
}, { _id: false });

const LandingPageSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    benefits: {
      type: [String],
      default: [],
    },
    buttonText: {
      type: String,
      default: 'Descargar ahora',
    },
    successMessage: {
      type: String,
      default: '¡Gracias! Revisa tu email.',
    },
    formFields: {
      type: FormFieldsSchema,
      default: () => ({}),
    },
    gdprConsent: {
      type: Boolean,
      default: true,
    },
    styling: {
      type: StylingSchema,
      default: () => ({}),
    },
    seo: {
      type: SEOSchema,
      required: true,
    },
    captureSource: {
      type: Boolean,
      default: false,
    },
    sourceLabel: {
      type: String,
      default: 'Fuente / origen',
      trim: true,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'draft',
      index: true,
    },
    stats: {
      type: LandingPageStatsSchema,
      default: () => ({}),
    },
    publishedAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Slug validation
LandingPageSchema.pre('save', function(this: ILandingPage, next) {
  if (this.slug) {
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  next();
});

export default mongoose.model<ILandingPage>('LandingPage', LandingPageSchema);
