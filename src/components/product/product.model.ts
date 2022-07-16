import * as mongoose from 'mongoose';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
}

export const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'title is required'] },
    description: { type: String, required: [true, 'description is required'] },
    price: { type: Number, required: [true, 'price is required'] },
  },
  { timestamps: true },
);
