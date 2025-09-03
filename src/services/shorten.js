import axios from 'axios';

export async function shortenUrl(longUrl) {
    try {
        const response = await axios.post('https://url-shortener-backend-gray.vercel.app/shorten', { originalUrl: longUrl });
        return response.data.shortUrl;
    } catch (error) {
        throw new Error('Failed to shorten URL');
    }
}
