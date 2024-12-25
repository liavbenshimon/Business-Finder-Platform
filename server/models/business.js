import { Schema, model } from 'mongoose';

const businessSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    subscribers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    updates: [
      {
        text: String,
        createdAt: Date,
      },
    ],
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Business = model('Business', businessSchema);
