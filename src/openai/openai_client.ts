
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

function get_api_key(): string {
  const api_key = process.env.OPENAI_API_KEY;
  if (api_key === undefined) {
    throw new Error("OPENAI_API_KEY is not defined");
  }
  return api_key;
}

// Initialize the OpenAI client with the API key.
// This client will be used for all interactions with the OpenAI API.
const client = new OpenAI({ apiKey: get_api_key() });

export default client; // Export the initialized client for use in other parts of the application.