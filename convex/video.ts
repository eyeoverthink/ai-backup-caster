import { v } from "convex/values";
import { action } from "./_generated/server";

const API_KEY = 'a702149265msh04679705098dcf5p1c3f4cjsn79f5457e218b';
const API_HOST = 'all-media-downloader1.p.rapidapi.com';

// Base function for making API requests
async function makeApiRequest(endpoint: string, url: string) {
  const formData = new URLSearchParams();
  formData.append('url', url);

  const response = await fetch(`https://${API_HOST}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-rapidapi-host': API_HOST,
      'x-rapidapi-key': API_KEY,
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error (${response.status}):`, errorText);
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Platform-specific functions
async function downloadYouTube(url: string) {
  console.log('Processing YouTube URL:', url);
  return makeApiRequest('all', url);
}

async function downloadSpotify(url: string) {
  console.log('Processing Spotify URL:', url);
  return makeApiRequest('spotifydl', url);
}

async function downloadXNXX(url: string) {
  console.log('Processing XNXX URL:', url);
  return makeApiRequest('xnxxdl', url);
}

async function downloadXVideos(url: string) {
  console.log('Processing XVideos URL:', url);
  return makeApiRequest('all', url);
}

async function downloadLinkedIn(url: string) {
  console.log('Processing LinkedIn URL:', url);
  return makeApiRequest('all', url);
}

async function downloadIMDB(url: string) {
  console.log('Processing IMDB URL:', url);
  return makeApiRequest('all', url);
}

async function downloadDeezer(url: string) {
  console.log('Processing Deezer URL:', url);
  return makeApiRequest('all', url);
}

async function downloadBilibili(url: string) {
  console.log('Processing Bilibili URL:', url);
  return makeApiRequest('all', url);
}

async function searchSpotify(query: string) {
  console.log('Searching Spotify:', query);
  const formData = new URLSearchParams();
  formData.append('q', query);

  const response = await fetch(`https://${API_HOST}/spotify-search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-rapidapi-host': API_HOST,
      'x-rapidapi-key': API_KEY,
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error(`Spotify search failed: ${response.statusText}`);
  }

  return response.json();
}

async function searchXVideos(query: string) {
  console.log('Searching XVideos:', query);
  const formData = new URLSearchParams();
  formData.append('q', query);

  const response = await fetch(`https://${API_HOST}/xvideosearch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-rapidapi-host': API_HOST,
      'x-rapidapi-key': API_KEY,
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error(`XVideos search failed: ${response.statusText}`);
  }

  return response.json();
}

// Main action that routes to the appropriate function
export const processVideo = action({
  args: {
    url: v.string(),
    platform: v.string(),
  },
  handler: async (ctx, args) => {
    const { url, platform } = args;
    
    try {
      let data;
      switch (platform) {
        case 'youtube':
          data = await downloadYouTube(url);
          break;
        case 'spotify':
          data = await downloadSpotify(url);
          break;
        case 'xnxx':
          data = await downloadXNXX(url);
          break;
        case 'xvideos':
          data = await downloadXVideos(url);
          break;
        case 'linkedin':
          data = await downloadLinkedIn(url);
          break;
        case 'imdb':
          data = await downloadIMDB(url);
          break;
        case 'deezer':
          data = await downloadDeezer(url);
          break;
        case 'bilibili':
          data = await downloadBilibili(url);
          break;
        case 'all':
          data = await makeApiRequest('all', url);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      if (!data || !data.url) {
        throw new Error('Invalid response from API');
      }

      return {
        success: true,
        data: {
          title: data.title || 'Untitled',
          duration: data.duration || '',
          thumbnail: data.thumb || data.thumbnail || '',
          url: data.url,
          quality: data.quality || 'Unknown',
        },
      };
    } catch (error) {
      console.error('Error processing video:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  },
});

// Search actions
export const searchMedia = action({
  args: {
    query: v.string(),
    platform: v.string(),
  },
  handler: async (ctx, args) => {
    const { query, platform } = args;
    
    try {
      let results;
      switch (platform) {
        case 'spotify':
          results = await searchSpotify(query);
          break;
        case 'xvideos':
          results = await searchXVideos(query);
          break;
        default:
          throw new Error(`Search not supported for platform: ${platform}`);
      }

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  },
});
