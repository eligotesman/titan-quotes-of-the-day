import { Collection, Db, MongoClient } from 'mongodb';
import { CONFIG } from '../config';
import { Quote, QuoteDocument } from '../types';

const MONGODB_URI = CONFIG.MONGODB_URI;
const dbName = 'quotesApp';
const quotesCollectionName = 'quotes';

class DatabaseService {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB');
      this.db = this.client.db(dbName);

      // Create indexes
      const collection = this.getQuotesCollection();
      await Promise.all([
        // Create unique index on id field
        collection.createIndex({ id: 1 }, { unique: true }),

        // Create descending index on timestamp with TTL
        collection.createIndex(
          { timestamp: -1 },
          {
            expireAfterSeconds: 60, // 60 seconds TTL
          }
        ),
      ]);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  private getQuotesCollection<T extends QuoteDocument>(): Collection<T> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db.collection<T>(quotesCollectionName);
  }

  async close(): Promise<void> {
    try {
      await this.client.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      throw error;
    }
  }

  //get quotes from db in random order
  async getQuotes(
    count: number,
    tag?: string,
    minTimestamp?: Date
  ): Promise<QuoteDocument[]> {
    try {
      const collection = this.getQuotesCollection<QuoteDocument>();

      const filter: any = {};
      if (minTimestamp) {
        filter.timestamp = { $gte: minTimestamp };
      }

      if (tag) {
        filter.tags = tag;
      }

      const quotes = await collection
        .aggregate([
          { $match: filter },
          { $sample: { size: count } },
          { $project: { _id: 0 } },
        ])
        .toArray();

      return quotes as QuoteDocument[];
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  }

  async insertQuotes(quotes: Quote[]): Promise<void> {
    if (quotes?.length === 0) {
      return;
    }

    const documents = quotes.map((quote) => ({
      ...quote,
      timestamp: new Date(),
    }));

    try {
      const collection = this.getQuotesCollection<Quote>();
      await collection.insertMany(documents, { ordered: false });
    } catch (error: any) {
      if (error.code === 11000) {
        return; // Ignore duplicate key error
      }
      console.error('Error inserting quotes:', error);
      throw error;
    }
  }
}

export const dbService = new DatabaseService();
