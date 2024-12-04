import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
  apiKey: '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',
})

export const generatePodcastContent = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    // Generate creative content using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative podcast writer. Create engaging, informative content based on the given topic or prompt. Format the response as a well-structured podcast script with sections and natural flow."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    const generatedContent = completion.choices[0].message.content;
    
    if (!generatedContent) {
      throw new Error('Failed to generate podcast content');
    }

    return {
      content: generatedContent,
      sections: generatedContent.split('\n\n'), // Split into sections for easier processing
    };
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })

    const url = response.data[0].url;

    if(!url) {
      throw new Error('Error generating thumbnail');
    }

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  }
})

export const createPodcastFromPrompt = action({
  args: { prompt: v.string(), voice: v.string() },
  handler: async (_, { prompt, voice }) => {
    // Generate content directly here instead of trying to call another action
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative podcast writer. Create engaging, informative content based on the given topic or prompt. Format the response as a well-structured podcast script with sections and natural flow."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    const generatedContent = completion.choices[0].message.content;
    
    if (!generatedContent) {
      throw new Error('Failed to generate podcast content');
    }

    // Split content into sections
    const sections = generatedContent.split('\n\n');

    // Step 2: Convert generated content to speech (if you still want this functionality)
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as SpeechCreateParams['voice'],
      input: generatedContent,
    });

    const buffer = await mp3.arrayBuffer();
    
    return {
      buffer,
      transcript: generatedContent,
      sections: sections
    };
  },
});