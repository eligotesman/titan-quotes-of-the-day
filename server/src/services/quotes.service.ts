import axios from 'axios';
import { CONFIG } from '../config';
import { ApiResponse, Quote } from '../types';
import { dbService } from './db.service';

const FAVQS_API_URL = 'https://favqs.com/api';
const FAVQS_API_KEY = CONFIG.FAVQS_API_KEY;

const api = axios.create({
  baseURL: FAVQS_API_URL,
  headers: {
    Authorization: `Token token=${FAVQS_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export class QuotesService {
  private lastRequestTime = 0;
  private remainingRequests = CONFIG.RATE_LIMIT_MAX_REQUESTS;

  private canMakeBatchRequest(numberOfRequests: number): boolean {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;

    if (elapsed < CONFIG.RATE_LIMIT_INTERVAL_MS) {
      return this.remainingRequests >= numberOfRequests;
    }

    return true;
  }

  private async makeApiRequest(
    page: number,
    tag?: string
  ): Promise<ApiResponse> {
    try {
      const response = await api.get('/quotes', {
        params: tag && {
          page,
          filter: tag || '',
          type: tag ? 'tag' : '',
        },
      });

      const remainingRequests = response.headers['Rate-Limit-Remaining'];
      if (remainingRequests) {
        this.remainingRequests = parseInt(remainingRequests, 10);
      }

      this.lastRequestTime = Date.now();

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async makeBatchRequest(
    count: number,
    tag?: string
  ): Promise<Quote[]> {
    const requestsNeeded = Math.ceil(count / CONFIG.QUOTES_PER_PAGE);
    const allQuotes: any[] = [];

    try {
      if (!this.canMakeBatchRequest(requestsNeeded)) {
        return [];
      }

      for (let i = 0; i < requestsNeeded; i++) {
        const data = await this.makeApiRequest(i + 1, tag);

        const { quotes, last_page } = data;

        const newQuotes = quotes.map((quote: Quote) => ({
          id: quote.id,
          author: quote.author,
          body: quote.body,
          tags: quote.tags,
        }));

        allQuotes.push(...newQuotes);

        // if last page or no quotes available then break
        if (last_page || quotes[0].id === 0) {
          break;
        }
      }

      return allQuotes;
    } catch (error) {
      console.error(
        'makeBatchRequest - Error fetching quotes from API:',
        error
      );
      throw error;
    }
  }

  async getRandomQuotes(count: number, tag?: string): Promise<Quote[]> {
    try {
      let results: Quote[] = [];

      //get from cache - only get quotes from cache that are not older than defined interval
      const minTimestamp = new Date(Date.now() - CONFIG.RATE_LIMIT_INTERVAL_MS);
      results = await dbService.getQuotes(count, tag, minTimestamp);
      console.log(`getRandomQuotes - got ${results.length} quotes from cache`);

      //if not enough quotes in cache then fetch from api
      if (results.length < count) {
        const remainingCount = count - results.length;

        console.log(`getRandomQuotes - get ${remainingCount} more quotes`);
        const quotes = await this.makeBatchRequest(remainingCount, tag);
        await dbService.insertQuotes(quotes);

        results = [...results, ...quotes];
      }

      // fill more quotes into cache in the background
      this.makeBatchRequest(CONFIG.MAX_QUOTES_COUNT).then((quotes) => {
        if (quotes.length === 0) {
          return;
        }

        console.log(
          'getRandomQuotes - inserting quotes in background:',
          quotes.length
        );
        dbService.insertQuotes(quotes);
      });

      results = results.slice(0, count);
      console.log(`getRandomQuotes - returning ${results.length} results`);
      return results;
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      throw error;
    }
  }
}

export const quotesService = new QuotesService();
