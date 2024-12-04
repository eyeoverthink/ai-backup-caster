"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type Platform = 'all' | 'spotify' | 'youtube' | 'xvideos' | 'xnxx' | 'linkedin' | 'imdb' | 'deezer' | 'bilibili';

interface VideoData {
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
  quality: string;
}

interface ProcessVideoResult {
  success: boolean;
  data?: VideoData;
  error?: string;
}

export default function VideoPage() {
  const [url, setUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [activePlatform, setActivePlatform] = useState<Platform>('all');
  
  const processVideo = useAction(api.video.processVideo);
  const searchMedia = useAction(api.video.searchMedia);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log(`Processing ${activePlatform} URL:`, url);
      const result = await processVideo({ url, platform: activePlatform }) as ProcessVideoResult;
      console.log('Result:', result);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to process video');
      }

      setVideoData(result.data);
      toast({
        title: "Success",
        description: "Media processed successfully"
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setVideoData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      toast({
        title: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log(`Searching ${activePlatform}:`, searchQuery);
      const result = await searchMedia({ query: searchQuery, platform: activePlatform });
      
      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }

      // Handle search results
      console.log('Search results:', result.data);
      toast({
        title: "Search Complete",
        description: "Found results"
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Search failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActivePlatform(value as Platform)}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 gap-2">
          <TabsTrigger value="all">All Platforms</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="spotify">Spotify</TabsTrigger>
          <TabsTrigger value="xvideos">XVideos</TabsTrigger>
          <TabsTrigger value="xnxx">XNXX</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="imdb">IMDB</TabsTrigger>
          <TabsTrigger value="deezer">Deezer</TabsTrigger>
          <TabsTrigger value="bilibili">Bilibili</TabsTrigger>
        </TabsList>

        {['all', 'youtube', 'spotify', 'xvideos', 'xnxx', 'linkedin', 'imdb', 'deezer', 'bilibili'].map((platform) => (
          <TabsContent key={platform} value={platform}>
            <Card className="w-full max-w-3xl mx-auto bg-black-2 border-black-3">
              <CardHeader>
                <CardTitle className="text-24 font-bold text-white-1">
                  {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)} Downloader
                </CardTitle>
                <CardDescription className="text-16 text-gray-1">
                  {platform === 'spotify' || platform === 'xvideos' ? 
                    'Enter URL to download or search for content' :
                    'Enter URL to download content'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="url" className="text-14 font-medium text-white-2">URL</label>
                    <div className="flex gap-2">
                      <Input
                        id="url"
                        placeholder={`Enter ${platform === 'all' ? 'media' : platform} URL...`}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="input-class flex-1"
                      />
                      <Button 
                        type="submit" 
                        disabled={isProcessing}
                        className="min-w-[100px] bg-orange-1 hover:bg-orange-1/90 text-white-1"
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Processing
                          </>
                        ) : (
                          "Download"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>

                {(platform === 'spotify' || platform === 'xvideos') && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="search" className="text-14 font-medium text-white-2">Search</label>
                      <div className="flex gap-2">
                        <Input
                          id="search"
                          placeholder={`Search ${platform}...`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="input-class flex-1"
                        />
                        <Button 
                          onClick={handleSearch}
                          disabled={isProcessing}
                          className="min-w-[100px] bg-orange-1 hover:bg-orange-1/90 text-white-1"
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {videoData && (
              <Card className="mt-6 w-full max-w-3xl mx-auto bg-black-2 border-black-3">
                <CardHeader>
                  <CardTitle className="text-20 font-semibold text-white-1">Download Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {videoData.thumbnail && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={videoData.thumbnail}
                        alt={videoData.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-14 font-medium text-gray-1">Title</h3>
                    <p className="text-16 text-white-1">{videoData.title}</p>
                  </div>

                  {videoData.duration && (
                    <div className="space-y-2">
                      <h3 className="text-14 font-medium text-gray-1">Duration</h3>
                      <p className="text-16 text-white-1">{videoData.duration}</p>
                    </div>
                  )}

                  {videoData.quality && (
                    <div className="space-y-2">
                      <h3 className="text-14 font-medium text-gray-1">Quality</h3>
                      <p className="text-16 text-white-1">{videoData.quality}</p>
                    </div>
                  )}
                </CardContent>
                {videoData.url && (
                  <CardFooter>
                    <Button 
                      asChild 
                      className="w-full bg-orange-1 hover:bg-orange-1/90 text-white-1 text-16"
                    >
                      <a
                        href={videoData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        Download Media
                      </a>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
