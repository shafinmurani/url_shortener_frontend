import axios from 'axios';

export async function shortenUrl(longUrl) {
    try {
        const response = await axios.post('http://localhost:5000/shorten', { originalUrl: longUrl });
        return response.data.shortUrl;
    } catch (error) {
        throw new Error('Failed to shorten URL');
    }
}
