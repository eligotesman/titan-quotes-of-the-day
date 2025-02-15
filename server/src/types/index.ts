import { Document } from 'mongodb';

export interface Quote {
  id: number;
  author: string;
  body: string;
  tags: string[];
}

export interface QuoteDocument extends Document {
  id: number;
  author: string;
  body: string;
  tags: string[];
  createdAt?: Date;
}

export interface ApiResponse<> {
  quotes: Quote[];
  last_page: boolean;
}
