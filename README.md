# Titan Quotes of the Day

## Tech Stack

- Frontend:

  - React
  - TypeScript
  - Tailwind CSS
  - Lucide React (icons)
  - Vite (build tool)

- Backend:
  - Node.js
  - Express
  - TypeScript
  - MongoDB (for caching)

## Prerequisites

- Node.js (v19 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- FavQs API key

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   npm install -w client
   npm install -w server
   ```

3. Get your FavQs API key:

   - Sign up at https://favqs.com/api_keys
   - Create a new API key

4. Create a `.env` file in the root directory with:

   ```
   FAVQS_API_KEY=your_favqs_api_key
   MONGODB_URI=your_mongodb_uri
   VITE_REACT_API_BASE_URL=your_server_api_url
   ```

   Replace:

   - `your_favqs_api_key` with your FavQs API key
   - `your_mongodb_uri` with your MongoDB connection string, if not provided, the default connection URL will be used `mongodb://localhost:27017`
   - `your_server_api_url` with the URL of the server API (default: `http://localhost:3000/api`)

5. Start the application:

   ```bash
   npm run server
   ```

   the client will run on `http://localhost:5173` and the server on `http://localhost:3000/api`

## Architecture

- When quotes are requested, the server first checks the cache in MongoDB
- If not enough cached quotes are available, it fetches from FavQs API, caches them in MongoDB, and sends them to the client
- After the server sends the quotes to the client, the server requests new quotes from the API to cache them in the background
- In order to maintain data freshness, when getting quotes from MongoDB, it gets only new quotes that are no older then 20 seconds - using the `timestamp` field. Furthermore, the quotes are saved in MongoDB with a TTL of 60 seconds
- Rate limits are handled gracefully by checking the elapsed time since the last request and the remaining quota from the API response header. if the rate limit is reached and not enough time has passed since last request, the API won't be called, and the client will receive the cached quotes
