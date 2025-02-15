import { Router } from 'express';
import { CONFIG } from '../config';
import { quotesService } from '../services/quotes.service';

const router = Router();

router.get('/quotes', async (req, res) => {
  try {
    const count = parseInt(req.query.count as string);
    const tag = req.query.tag as string | undefined;

    if (!count) {
      return res.status(400).json({ error: 'Count is required' });
    }

    if (count > CONFIG.MAX_QUOTES_COUNT) {
      return res
        .status(400)
        .json({ error: 'Count must be less than or equal to 50' });
    }

    const quotes = await quotesService.getRandomQuotes(count, tag);

    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

export default router;
