# RSS Feed Integration Guide

## Overview
Your blog now has a fully-featured RSS feed that users can subscribe to for automatic updates when you publish new posts.

## RSS Feed URL
**Feed URL:** `https://www.devanshdubey.com/rss.xml`

## What's Included in Your RSS Feed

### Feed Metadata
- **Title:** Devansh Dubey — Engineering Log
- **Description:** Stories and deep dives from Devansh's engineering journey
- **Author Information:** Devansh Dubey
- **Copyright:** Automatically updates with current year
- **TTL:** 60 minutes (RSS readers will check for updates hourly)
- **Revalidation:** 1 hour cache on the server side

### Each Post Includes
- Full title and description
- Publication date
- Reading time
- Category and tags
- Full post content (converted from MDX to HTML)
- Unique GUID for each post
- Direct link to the post on your website

## How Users Can Subscribe

### RSS Readers
Users can subscribe using any RSS reader application:

#### Popular Desktop Readers
- **Feedly** - https://feedly.com
- **Inoreader** - https://www.inoreader.com
- **NewsBlur** - https://www.newsblur.com
- **The Old Reader** - https://theoldreader.com

#### Popular Mobile Apps
- **Reeder** (iOS)
- **NetNewsWire** (iOS/Mac)
- **Feedly** (iOS/Android)
- **Inoreader** (iOS/Android)

#### Browser Extensions
- **Feedbro** (Chrome/Firefox)
- **RSS Feed Reader** (Chrome)

### Subscription Methods

#### Method 1: Manual URL Entry
1. Open your RSS reader of choice
2. Look for "Add Feed" or "Subscribe" button
3. Enter: `https://www.devanshdubey.com/rss.xml`
4. Confirm subscription

#### Method 2: Autodiscovery
1. Simply visit `https://www.devanshdubey.com/blog`
2. Modern RSS readers will automatically detect the feed (thanks to the autodiscovery meta tags)
3. Click the RSS icon in your browser or RSS reader

#### Method 3: Direct Link
1. Click the "Subscribe via RSS" button on your blog page
2. Your browser or RSS reader will prompt to subscribe

## Features Implemented

### 1. Enhanced RSS Feed (`/src/app/rss.xml/route.ts`)
- ✅ Full post content in HTML format
- ✅ Author metadata (dc:creator)
- ✅ Proper GUID for each post
- ✅ Copyright and managing editor info
- ✅ TTL for caching
- ✅ Custom elements for rich content

### 2. Autodiscovery Meta Tags (`/src/app/layout.tsx`)
- ✅ RSS feed automatically detected by browsers and RSS readers
- ✅ Appears in browser RSS detection extensions

### 3. Visual Indicators
- ✅ RSS icon on blog index page (`/blog`)
- ✅ RSS button on individual blog posts
- ✅ Accessible with proper aria-labels

### 4. Performance Optimizations
- ✅ Server-side caching (1 hour revalidation)
- ✅ CDN-friendly cache headers
- ✅ Stale-while-revalidate strategy (24 hours)

## Testing Your RSS Feed

### Validation
You can validate your RSS feed at:
- https://validator.w3.org/feed/
- Just enter: `https://www.devanshdubey.com/rss.xml`

### Preview
Preview how your feed looks at:
- https://www.feedvalidator.org/
- RSS feed readers mentioned above

## Technical Details

### Caching Strategy
```
Cache-Control: public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400
```
- Cached for 1 hour
- Serves stale content while revalidating for 24 hours
- Reduces server load and improves performance

### Revalidation
```typescript
export const revalidate = 3600; // Revalidate every hour
```
Next.js automatically regenerates the RSS feed every hour when the page is accessed.

## Promoting Your RSS Feed

### Website Locations
Your RSS feed is now discoverable at:
1. Blog index page - Large "Subscribe via RSS" button
2. Individual blog posts - RSS button in header
3. Autodiscovery meta tags - Detected automatically

### Social Media
You can share your RSS feed link on:
- Twitter/X bio or pinned tweet
- GitHub README
- LinkedIn profile
- Email signatures

Example message:
```
📰 Subscribe to my engineering blog via RSS: https://www.devanshdubey.com/rss.xml

Get deep dives on distributed systems, hackathon stories, and production incident retrospectives delivered straight to your RSS reader.
```

## Maintenance

### When Publishing New Posts
- No action needed! RSS feed automatically updates when you:
  1. Add new `.mdx` files to `src/content/blog/`
  2. Deploy changes
  3. RSS readers will pick up new posts within their refresh intervals

### Monitoring Subscribers
Consider adding analytics to track RSS feed usage:
- Server logs for `/rss.xml` requests
- Use services like FeedPress or Feedburner for detailed analytics

## Troubleshooting

### Feed Not Updating
1. Check if new post is in `src/content/blog/`
2. Verify frontmatter is properly formatted
3. Clear cache: Add `?v=timestamp` to test fresh feed
4. Check build logs for errors

### Validation Errors
1. Run feed through W3C validator
2. Check for special characters in content
3. Ensure dates are in valid format
4. Verify all required frontmatter fields exist

## Next Steps

Consider adding:
1. **Feed analytics** - Track subscriber count and popular posts
2. **Feed variants** - Category-specific feeds (e.g., `/rss.xml?category=hackathon`)
3. **Email integration** - Offer email subscription alongside RSS
4. **Podcast feed** - If you add audio content
5. **JSON Feed** - Additional format at `/feed.json`

## Questions?

For RSS-related questions or issues:
- Check Next.js RSS documentation
- Test feed at https://validator.w3.org/feed/
- Review RSS 2.0 specification: https://www.rssboard.org/rss-specification
