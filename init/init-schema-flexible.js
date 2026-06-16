// MongoDB Flexible Schema Initialization Script
// This script creates the contentdb database with flexible schema structure
// supporting multiple content types (Movies, Books, Music, etc.)
// Run automatically when MongoDB container starts

// Load the schema template functions
load('/docker-entrypoint-initdb.d/schema-template.js');
load('/docker-entrypoint-initdb.d/content-types.js');

print('========================================');
print('Starting MongoDB Flexible Content Database Initialization');
print('========================================');

// Switch to the contentdb database (new flexible database)
db = db.getSiblingDB('contentdb');

print('Database: contentdb (flexible multi-content-type database)');
print('');

// ============================================
// 1. Create Content Types Metadata Collection
// ============================================
print('Creating content_types collection with metadata...');

db.createCollection('content_types');

// Insert content type metadata
db.content_types.insertMany([
  {
    code: "001",
    name: "Movies",
    icon: "🎬",
    description: "Film and cinema content",
    collectionName: "content_001",
    createdAt: new Date(),
    active: true
  },
  {
    code: "002",
    name: "Books",
    icon: "📚",
    description: "Written literature",
    collectionName: "content_002",
    createdAt: new Date(),
    active: false  // Not yet implemented
  },
  {
    code: "003",
    name: "Music",
    icon: "🎵",
    description: "Audio recordings",
    collectionName: "content_003",
    createdAt: new Date(),
    active: false  // Not yet implemented
  }
]);

print('Content types metadata inserted successfully');
print('');

// ============================================
// 2. Create Content Subtypes Collection
// ============================================
print('Creating content_subtypes collection...');

db.createCollection('content_subtypes');

// Insert subtype mappings for Movies
db.content_subtypes.insertMany([
  { contentType: "001", code: "001", name: "Action", description: "Action and adventure films" },
  { contentType: "001", code: "002", name: "Drama", description: "Dramatic storytelling" },
  { contentType: "001", code: "003", name: "Comedy", description: "Humorous and light-hearted films" },
  { contentType: "001", code: "004", name: "Romance", description: "Romantic films" },
  { contentType: "001", code: "005", name: "Thriller", description: "Suspenseful and thrilling content" },
  { contentType: "001", code: "006", name: "Horror", description: "Horror and scary films" },
  { contentType: "001", code: "007", name: "Sci-Fi", description: "Science fiction" },
  { contentType: "001", code: "008", name: "Crime", description: "Crime and detective stories" }
]);

// Insert subtype mappings for Books (for future use)
db.content_subtypes.insertMany([
  { contentType: "002", code: "001", name: "Fiction", description: "Fictional literature" },
  { contentType: "002", code: "002", name: "Non-Fiction", description: "Non-fictional works" },
  { contentType: "002", code: "003", name: "Biography", description: "Life stories" },
  { contentType: "002", code: "004", name: "Mystery", description: "Mystery and detective novels" },
  { contentType: "002", code: "005", name: "Fantasy", description: "Fantasy literature" }
]);

// Insert subtype mappings for Music (for future use)
db.content_subtypes.insertMany([
  { contentType: "003", code: "001", name: "Pop", description: "Popular music" },
  { contentType: "003", code: "002", name: "Rock", description: "Rock music" },
  { contentType: "003", code: "003", name: "Classical", description: "Classical music" },
  { contentType: "003", code: "004", name: "Jazz", description: "Jazz music" },
  { contentType: "003", code: "005", name: "Hip-Hop", description: "Hip-Hop and Rap" }
]);

print('Content subtypes inserted successfully');
print('');

// ============================================
// 3. Create Movies Collection (content_001)
// ============================================
print('Creating content_001 collection for Movies with flexible schema...');

// Generate movie schema using the template with movie-specific details
const movieSchema = generateContentSchema("001", getMovieDetailsSchema());

// Create the collection with validation
db.createCollection('content_001', movieSchema);

print('Movies collection (content_001) created successfully with schema validation');
print('');

// ============================================
// 4. Create Indexes for Movies Collection
// ============================================
print('Creating indexes for content_001 (Movies) collection...');

// Index on title for fast title searches
db.content_001.createIndex(
  { title: 1 },
  { name: 'idx_title' }
);
print('✓ Index created on title');

// Index on year for year-based queries (descending for recent first)
db.content_001.createIndex(
  { year: -1 },
  { name: 'idx_year' }
);
print('✓ Index created on year');

// Index on contentType for filtering by content type
db.content_001.createIndex(
  { contentType: 1 },
  { name: 'idx_contentType' }
);
print('✓ Index created on contentType');

// Index on contentSubtype for genre-based searches
db.content_001.createIndex(
  { contentSubtype: 1 },
  { name: 'idx_contentSubtype' }
);
print('✓ Index created on contentSubtype');

// Index on songs.singer for singer-based searches
db.content_001.createIndex(
  { 'details.songs.singer': 1 },
  { name: 'idx_songs_singer' }
);
print('✓ Index created on details.songs.singer');

// Compound index on year and title
db.content_001.createIndex(
  { year: -1, title: 1 },
  { name: 'idx_year_title' }
);
print('✓ Compound index created on year and title');

// Text index for full-text search
// Includes title, creators, contributors, and song titles/singers
db.content_001.createIndex(
  { 
    title: 'text', 
    creators: 'text', 
    'contributors.name': 'text',
    'details.songs.title': 'text',
    'details.songs.singer': 'text'
  },
  {
    name: 'idx_text_search',
    weights: { 
      title: 10,           // Highest weight for title
      creators: 5,         // High weight for creators (directors)
      'contributors.name': 3,  // Medium weight for contributors (actors)
      'details.songs.title': 2,
      'details.songs.singer': 2
    },
    default_language: 'none'  // Language-agnostic search
  }
);
print('✓ Text index created for full-text search');

print('');
print('All indexes created successfully (7 indexes)');
print('');

// ============================================
// 5. Create Indexes for Metadata Collections
// ============================================
print('Creating indexes for metadata collections...');

// Index on content_types collection
db.content_types.createIndex(
  { code: 1 },
  { name: 'idx_code', unique: true }
);
print('✓ Index created on content_types.code');

// Compound index on content_subtypes collection
db.content_subtypes.createIndex(
  { contentType: 1, code: 1 },
  { name: 'idx_contentType_code', unique: true }
);
print('✓ Compound index created on content_subtypes');

print('');

// ============================================
// Summary
// ============================================
print('========================================');
print('Flexible Schema Initialization Completed Successfully!');
print('========================================');
print('Database: contentdb');
print('');
print('Collections Created:');
print('  1. content_types (metadata)');
print('  2. content_subtypes (metadata)');
print('  3. content_001 (Movies)');
print('');
print('Content Types:');
print('  - 001: Movies (Active) → content_001');
print('  - 002: Books (Inactive) → content_002');
print('  - 003: Music (Inactive) → content_003');
print('');
print('Indexes Created:');
print('  Movies Collection (content_001): 7 indexes');
print('  Metadata Collections: 2 indexes');
print('  Total: 9 indexes');
print('');
print('Field Mapping (Old → New):');
print('  movieName → title');
print('  director → creators (array)');
print('  actors/actresses → contributors (array with roles)');
print('  genre → contentSubtype (array of codes)');
print('  movieLanguage → language');
print('  ottPlatforms → platforms');
print('  songs → details.songs (with links per song)');
print('  boxOffice → details.boxOffice');
print('  runtime → details.runtime');
print('');
print('Schema Features:');
print('  ✓ Flexible content type support');
print('  ✓ Reusable schema template');
print('  ✓ Content-specific details field');
print('  ✓ Extensible metadata field');
print('  ✓ Moderate validation (backward compatible)');
print('  ✓ Warning-only validation action');
print('  ✓ Comprehensive indexing strategy');
print('  ✓ Full-text search support');
print('');
print('Next Steps:');
print('  1. Update application code to use new schema');
print('  2. Add Books collection (content_002) when ready');
print('  3. Add Music collection (content_003) when ready');
print('========================================');

// Made with Bob