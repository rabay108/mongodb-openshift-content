// MongoDB Initialization Script - Schema Setup
// This script creates the movies database with schema validation and indexes
// Run automatically when MongoDB container starts

print('========================================');
print('Starting MongoDB Movies Database Initialization');
print('========================================');

// Switch to the moviesdb database
db = db.getSiblingDB('moviesdb');

print('Creating movies collection with schema validation...');

// Create the movies collection with JSON Schema validation
db.createCollection('movies', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['movieName', 'year'],
      properties: {
        movieName: {
          bsonType: 'string',
          description: 'Movie name is required and must be a string'
        },
        actors: {
          bsonType: 'array',
          description: 'Array of actor names',
          items: {
            bsonType: 'string'
          }
        },
        actresses: {
          bsonType: 'array',
          description: 'Array of actress names',
          items: {
            bsonType: 'string'
          }
        },
        songs: {
          bsonType: 'array',
          description: 'Array of song objects with title and singer',
          items: {
            bsonType: 'object',
            required: ['title', 'singer'],
            properties: {
              title: {
                bsonType: 'string',
                description: 'Song title must be a string'
              },
              singer: {
                bsonType: 'string',
                description: 'Singer name must be a string'
              },
              duration: {
                bsonType: 'string',
                description: 'Optional song duration'
              }
            }
          }
        },
        year: {
          bsonType: 'int',
          minimum: 1888,
          maximum: 2100,
          description: 'Release year must be an integer between 1888 and 2100'
        },
        director: {
          bsonType: 'string',
          description: 'Director name'
        },
        genre: {
          bsonType: 'array',
          description: 'Array of genre strings',
          items: {
            bsonType: 'string'
          }
        },
        movieLanguage: {
          bsonType: 'string',
          description: 'Primary language of the movie'
        },
        releaseDate: {
          bsonType: 'date',
          description: 'Movie release date'
        },
        ottPlatforms: {
          bsonType: 'array',
          description: 'Array of OTT platform objects where movie is available',
          items: {
            bsonType: 'object',
            required: ['platform'],
            properties: {
              platform: {
                bsonType: 'string',
                description: 'OTT platform name'
              },
              icon: {
                bsonType: 'string',
                description: 'Platform icon or emoji'
              },
              url: {
                bsonType: 'string',
                description: 'Streaming URL on the platform'
              }
            }
          }
        },
        links: {
          bsonType: 'array',
          description: 'Array of link objects for movie, trailer, teaser, songs',
          items: {
            bsonType: 'object',
            required: ['label', 'url'],
            properties: {
              label: {
                bsonType: 'string',
                description: 'Link label/description'
              },
              url: {
                bsonType: 'string',
                description: 'URL to the content'
              },
              type: {
                bsonType: 'string',
                description: 'Type of link: movie, trailer, teaser, song'
              }
            }
          }
        },
        rating: {
          bsonType: 'double',
          minimum: 0,
          maximum: 10,
          description: 'Movie rating between 0 and 10'
        },
        boxOffice: {
          bsonType: 'object',
          description: 'Box office collection details',
          properties: {
            budget: {
              bsonType: 'string',
              description: 'Production budget'
            },
            worldwide: {
              bsonType: 'string',
              description: 'Worldwide collection'
            }
          }
        },
        metadata: {
          bsonType: 'object',
          description: 'Extensible metadata field for future additions - can contain any additional properties'
        }
      }
    }
  },
  validationLevel: 'moderate',
  validationAction: 'warn'
});

print('Movies collection created successfully with schema validation');

print('Creating indexes for optimized queries...');

// Create index on movieName for fast movie name searches
db.movies.createIndex(
  { movieName: 1 },
  { name: 'idx_movieName' }
);
print('Index created on movieName');

// Create index on year for year-based queries
db.movies.createIndex(
  { year: -1 },
  { name: 'idx_year' }
);
print('Index created on year');

// Create index on songs.singer for singer-based searches
db.movies.createIndex(
  { 'songs.singer': 1 },
  { name: 'idx_songs_singer' }
);
print('Index created on songs.singer');

// Create compound index on year and movieName
db.movies.createIndex(
  { year: -1, movieName: 1 },
  { name: 'idx_year_movieName' }
);
print('Compound index created on year and movieName');

// Create text index for full-text search on movieName, director, and movieLanguage
// Using 'none' as default_language for language-agnostic search
db.movies.createIndex(
  { movieName: 'text', director: 'text', actors: 'text', actresses: 'text', movieLanguage: 'text' },
  {
    name: 'idx_text_search',
    weights: { movieName: 10, director: 5, actors: 3, actresses: 3, movieLanguage: 2 },
    default_language: 'none'
  }
);
print('Text index created for full-text search with language-agnostic configuration');

print('========================================');
print('Schema initialization completed successfully!');
print('Database: moviesdb');
print('Collection: movies');
print('Indexes created: 5');
print('========================================');

// Made with Bob
