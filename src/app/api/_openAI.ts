import OpenAI from 'openai';

// Initialize the OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

// Handle errors if API key is not set
if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set in environment variables');
}

export default openai;
