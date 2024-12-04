const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3333; // Using a different port to avoid conflicts

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const API_KEY = 'a702149265msh04679705098dcf5p1c3f4cjsn79f5457e218b';
const API_HOST = 'all-media-downloader1.p.rapidapi.com';

// Platform-specific endpoints configuration
const ENDPOINTS = {
    default: '/all',
    youtube: '/ytdl',
    xvideos: '/xvideosdl',
    xnxx: '/xnxxdl',
    deezer: '/deezerdl',
    imdb: '/imdbdl',
    linkedin: '/linkedindl',
    vimeo: '/vimdl',
    reddit: '/redditdl',
    tiktok: '/tiktokdl',
    dailymotion: '/dailymotiondl',
    spotify: '/spotifydl',
    soundcloud: '/soundclouddl',
    instagram: '/instadl',
    facebook: '/fbdl',
    twitter: '/twitterdl'
};

// Helper function to detect platform from URL
function detectPlatform(url) {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('xvideos.com')) return 'xvideos';
    if (urlLower.includes('xnxx.com')) return 'xnxx';
    if (urlLower.includes('deezer.com')) return 'deezer';
    if (urlLower.includes('imdb.com')) return 'imdb';
    if (urlLower.includes('linkedin.com')) return 'linkedin';
    if (urlLower.includes('vimeo.com')) return 'vimeo';
    if (urlLower.includes('reddit.com')) return 'reddit';
    if (urlLower.includes('tiktok.com')) return 'tiktok';
    if (urlLower.includes('dailymotion.com')) return 'dailymotion';
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
    if (urlLower.includes('spotify.com')) return 'spotify';
    if (urlLower.includes('soundcloud.com')) return 'soundcloud';
    if (urlLower.includes('instagram.com')) return 'instagram';
    if (urlLower.includes('facebook.com')) return 'facebook';
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
    return 'default';
}

// Helper function to extract download URL from response
function extractDownloadUrl(data, platform) {
    if (!data) return null;
    
    // Handle YouTube format
    if (platform === 'youtube' && data.formats) {
        // Get the highest quality format that has both video and audio
        const format = data.formats
            .filter(f => f.vcodec !== 'none' && f.acodec !== 'none')
            .sort((a, b) => (b.height || 0) - (a.height || 0))[0];
        
        return format?.url;
    }
    
    // Handle other platforms
    if (data.url) return data.url;
    if (data.link) return data.link;
    if (data.download) return data.download;
    if (data.downloadUrl) return data.downloadUrl;
    if (data.result?.url) return data.result.url;
    if (data.result?.link) return data.result.link;
    
    // If we have an array of results, get the first one
    if (Array.isArray(data.result)) {
        const result = data.result[0];
        return result.url || result.link || result.download;
    }
    
    return null;
}

// Helper function to make API requests
async function makeApiRequest(endpoint, url) {
    try {
        const options = {
            method: 'POST',
            url: `https://${API_HOST}${endpoint}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': API_KEY
            },
            data: new URLSearchParams({ url }).toString()
        };

        const response = await axios.request(options);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('API Error:', error.message);
        const errorMessage = error.response?.data?.message || error.message;
        return { 
            success: false, 
            error: errorMessage,
            details: error.response?.data?.details || 'No additional details available'
        };
    }
}

// Main download endpoint
app.post('/api/download', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ success: false, error: 'URL is required' });
        }

        const platform = detectPlatform(url);
        const endpoint = ENDPOINTS[platform];
        
        console.log(`Processing ${platform} URL:`, url);
        
        const response = await makeApiRequest(endpoint, url);
        const downloadUrl = extractDownloadUrl(response.data, platform);
        
        if (!downloadUrl) {
            return res.status(400).json({ 
                success: false, 
                error: 'Could not extract download URL',
                data: response.data
            });
        }
        
        return res.json({ 
            success: true, 
            downloadUrl,
            platform,
            info: response.data
        });
    } catch (error) {
        console.error('Download error:', error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to process download',
            details: error.response?.data?.message || error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Get supported platforms
app.get('/api/platforms', (req, res) => {
    res.json({
        platforms: Object.keys(ENDPOINTS)
    });
});

// Serve the test page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        details: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
