# WordPress REST API Integration

This document explains how our custom WordPress REST API endpoints (`wp-json/together/*`) work with the Next.js frontend. These endpoints are designed to provide efficient and secure data transfer between WordPress and the Next.js application.

## Base Configuration

All API requests are made to the WordPress instance using the base URL defined in your `.env.local` file as `NEXT_PUBLIC_WORDPRESS_BASE_URL`. The frontend uses a custom CMS client class to handle all API interactions.

## Available Endpoints

### Content Retrieval

#### `GET /wp-json/together/post`
- **Purpose**: Fetch a specific post/page by slug
- **Parameters**:
  - `slug`: The post slug to retrieve
- **Usage**: Used for retrieving individual page/post content
- **Method**: `cms.page(slug)`
- **Returns**: `WpPage` object

#### `GET /wp-json/together/preview`
- **Purpose**: Fetch preview data for unpublished content
- **Parameters**:
  - `post_id`: ID of the post to preview
  - `cache`: Timestamp to prevent caching
- **Usage**: Used in preview mode for draft content
- **Method**: `cms.preview(postId)`
- **Returns**: `WpPage` object
- **Note**: Includes special cache-busting headers

#### `GET /wp-json/together/paths`
- **Purpose**: Fetch all available paths/routes for the site
- **Usage**: Used for static path generation and site navigation
- **Method**: `cms.paths()`
- **Returns**: `string[]`
- **Caching**: Results are cached automatically

### Content Retrieval

#### `POST /wp-json/together/get`
- **Purpose**: General-purpose endpoint for fetching post data
- **Usage**: Used in listing pages to fetch post data with specific arguments
- **Example**: Used in `getListingPageData.ts`

#### `GET /wp-json/together/post`
- **Purpose**: Fetch a specific post/page by slug
- **Parameters**:
  - `slug`: The post slug to retrieve
- **Usage**: Used for retrieving individual page/post content

### Taxonomy and Terms

#### `POST /wp-json/together/get_terms_by_post_type`
- **Purpose**: Fetch taxonomy terms associated with a specific post type
- **Usage**: Used in listing pages for filtering and categorisation

### Global Configuration

#### `GET /wp-json/together/options`
- **Purpose**: Fetch global site options and settings
- **Usage**: Used for retrieving site-wide configuration
- **Method**: `cms.options()`
- **Returns**: `WpOptions` object
- **Caching**: Results are cached automatically

#### `GET /wp-json/together/robots`
- **Purpose**: Fetch robots.txt configuration
- **Usage**: Used for SEO and crawler control
- **Method**: `cms.robots()`
- **Returns**: `{ blog_public: number }`
- **Caching**: Results are cached automatically

### Search Functionality

#### `GET /wp-json/together/search`
- **Purpose**: Search content across the site
- **Parameters**:
  - `q`: Search query
  - `post_type`: Type of posts to search (default: 'post')
  - `per_page`: Number of results per page (default: 20)
- **Usage**: Used for site-wide search functionality
- **Method**: `cms.search({ query, postType, perPage })`
- **Returns**: Search results
- **Caching**: Results are cached by query parameters

### SEO and Site Management

#### `GET /wp-json/together/redirects`
- **Purpose**: Fetch site redirects configuration
- **Usage**: Used for handling custom redirects
- **Method**: `cms.redirects()`
- **Returns**: `WpRedirect[]`
- **Caching**: Results are cached automatically
- **Error Handling**: Returns empty array on error

### Generic Methods

#### Generic GET Request
- **Method**: `cms.get(path, options?)`
- **Usage**: Make custom GET requests to any endpoint
- **Example**: `cms.get('/wp-json/together/custom-endpoint')`

#### Generic POST Request
- **Method**: `cms.post(path, body)`
- **Usage**: Make custom POST requests to any endpoint
- **Example**: `cms.post('/wp-json/together/custom-endpoint', { key: 'value' })`

## Frontend Implementation

The frontend implements these API calls using a custom CMS client class that handles:
- Automatic caching of responses where appropriate
- Error handling and retries
- Type safety through TypeScript interfaces
- Authentication when required

### Example Usage

```typescript
// Fetching a page by slug
const page = await cms.page('about-us');

// Searching content
const searchResults = await cms.search({
  query: 'search term',
  postType: 'post',
  perPage: 20
});

// Getting site options
const options = await cms.options();

// Getting all available paths
const paths = await cms.paths();

// Getting preview of a draft post
const preview = await cms.preview(123);

// Getting redirects configuration
const redirects = await cms.redirects();

// Making a custom GET request
const customData = await cms.get('/wp-json/together/custom-endpoint');

// Making a custom POST request
const postData = await cms.post('/wp-json/together/custom-endpoint', {
  key: 'value'
});
```

## Best Practices
1. **Caching**: Many endpoints utilise caching to improve performance. Consider cache implications when making updates.
2. **Error Handling**: Always handle potential API errors in your frontend components.
3. **Environment Variables**: Ensure your environment variables are properly configured for the API base URL.