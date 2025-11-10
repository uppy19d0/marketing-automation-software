import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomField extends Document {
  name: string;
  nameEn: string;
  fieldKey: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  options?: string[];
  isRequired: boolean;
  defaultValue?: string;
  validation?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomFieldSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameEn: {
      type: String,
      required: true,
      trim: true,
    },
    fieldKey: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['text', 'number', 'date', 'select', 'multiselect'],
      required: true,
    },
    options: {
      type: [String],
      default: [],
      validate: {
        validator: function(this: ICustomField, options: string[]) {
          // Options required for select and multiselect
          if ((this.type === 'select' || this.type === 'multiselect') && (!options || options.length === 0)) {
            return false;
          }
          return true;
        },
        message: 'Options are required for select and multiselect fields',
      },
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: String,
    },
    validation: {
      type: Schema.Types.Mixed,
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

// Index for queries
CustomFieldSchema.index({ fieldKey: 1, isActive: 1 });

export default mongoose.model<ICustomField>('CustomField', CustomFieldSchema);
