# Development Guide

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - OpenAI API key
   - Convex deployment
   - Rapid API key for video processing
   - Rapid API host configuration
4. Start development servers:
   - `npx convex dev`
   - `npm run dev`

## Key Files

### Frontend
- `/app/(root)/create-podcast/page.tsx`: Main podcast creation page
- `/components/GeneratePodcast.tsx`: Podcast generation component
- `/components/ui/*`: UI components
- `/app/(root)/video/page.tsx`: Video processing page
- `/public/icons/video.svg`: Video icon asset

### Backend
- `/convex/openai.ts`: OpenAI integration and actions
- `/convex/podcasts.ts`: Podcast management
- `/convex/files.ts`: File handling
- `/convex/video.ts`: Video processing actions

## Development Workflow

### Adding New Features
1. Document the feature in CHANGELOG.md
2. Create/modify necessary components
3. Update backend actions if needed
4. Test thoroughly
5. Update documentation

### Testing
- Test podcast generation with various prompts
- Verify audio file generation
- Check error handling
- Test file storage and retrieval
- Test URL validation
- Verify video information retrieval
- Test download link generation
- Check error handling for:
   - Invalid URLs
   - API failures
   - Rate limiting
   - Large file handling

### Best Practices
- Keep components modular
- Document all major changes
- Handle errors gracefully
- Follow existing code style
- Update documentation with changes
- Always validate video URLs
- Handle API rate limits gracefully
- Provide clear user feedback
- Monitor API usage
- Test with various video sources

### Common Issues
- API rate limiting
- File size limitations
- Audio processing delays
- Error handling edge cases
- URL validation failures
- API rate limiting
- Download link expiration
- Processing timeouts
- File size constraints

### Future Enhancements
- Video preview integration
- Format selection
- Progress tracking
- Batch processing
- Video metadata handling
