// Schema Template Generator
// This file provides a reusable function to generate MongoDB schema validation
// for any content type with core fields + content-specific details

/**
 * Generate a flexible schema validator for a content type
 * 
 * @param {string} contentTypeCode - 3-digit content type code (e.g., "001" for Movies)
 * @param {object} detailsSchema - Optional schema definition for the details field
 * @returns {object} MongoDB collection validator configuration
 * 
 * Core Fields (all content types):
 * - contentType: 3-digit code identifying the content type
 * - contentSubtype: Array of 3-digit codes for categories/genres
 * - title: Main title/name of the content
 * - year: Release/publication year
 * - creators: Array of primary creators (directors, authors, artists)
 * - contributors: Array of objects with name/role (actors, editors, musicians)
 * - language: Primary language
 * - releaseDate: Official release date
 * - rating: Numeric rating (0-10)
 * - platforms: Array of platform objects (streaming, stores, etc.)
 * - links: Array of link objects (trailers, samples, etc.)
 * - details: Content-specific fields (flexible object)
 * - metadata: Extensible metadata for future additions
 */
function generateContentSchema(contentTypeCode, detailsSchema = null) {
  // Base schema properties that apply to all content types
  const baseProperties = {
    contentType: {
      bsonType: 'string',
      pattern: '^[0-9]{3}$',
      description: 'Content type code - 3-digit identifier (e.g., 001 for Movies)'
    },
    contentSubtype: {
      bsonType: 'array',
      description: 'Array of subtype codes (genres/categories) - 3-digit identifiers',
      items: {
        bsonType: 'string',
        pattern: '^[0-9]{3}$'
      }
    },
    title: {
      bsonType: 'string',
      description: 'Title/name of the content - required field'
    },
    year: {
      bsonType: 'int',
      minimum: 1800,
      maximum: 2100,
      description: 'Release/publication year - must be between 1800 and 2100'
    },
    creators: {
      bsonType: 'array',
      description: 'Array of primary creator names (directors, authors, artists)',
      items: {
        bsonType: 'string'
      }
    },
    contributors: {
      bsonType: 'array',
      description: 'Array of contributor objects with name and role',
      items: {
        bsonType: 'object',
        required: ['name', 'role'],
        properties: {
          name: {
            bsonType: 'string',
            description: 'Contributor name'
          },
          role: {
            bsonType: 'string',
            description: 'Role/contribution type (actor, editor, musician, etc.)'
          }
        }
      }
    },
    language: {
      bsonType: 'string',
      description: 'Primary language of the content'
    },
    releaseDate: {
      bsonType: 'date',
      description: 'Official release/publication date'
    },
    rating: {
      bsonType: 'double',
      minimum: 0,
      maximum: 10,
      description: 'Content rating between 0 and 10'
    },
    platforms: {
      bsonType: 'array',
      description: 'Array of OTT platform objects where content is available for streaming/purchase',
      items: {
        bsonType: 'object',
        required: ['platform'],
        properties: {
          platform: {
            bsonType: 'string',
            description: 'OTT platform name (Netflix, Amazon Prime, Disney+, Hulu, HBO Max, Spotify, etc.)'
          },
          icon: {
            bsonType: 'string',
            description: 'Platform icon or emoji (🎬, 📺, 🎵, etc.)'
          },
          url: {
            bsonType: 'string',
            description: 'Direct URL to watch/stream the content on this platform'
          }
        }
      }
    },
    links: {
      bsonType: 'array',
      description: 'Array of link objects for trailers, teasers, promos, reviews, behind-the-scenes, etc.',
      items: {
        bsonType: 'object',
        required: ['label', 'url'],
        properties: {
          label: {
            bsonType: 'string',
            description: 'Link label/description (e.g., "Official Trailer", "Teaser", "Behind the Scenes")'
          },
          url: {
            bsonType: 'string',
            description: 'URL to the content (YouTube, Vimeo, official website, etc.)'
          },
          type: {
            bsonType: 'string',
            description: 'Type of link: trailer, teaser, promo, review, behind-the-scenes, interview, etc.'
          }
        }
      }
    },
    metadata: {
      bsonType: 'object',
      description: 'Extensible metadata field for future additions - can contain any additional properties'
    }
  };

  // Add details field if schema is provided
  if (detailsSchema) {
    baseProperties.details = detailsSchema;
  } else {
    // Default flexible details field
    baseProperties.details = {
      bsonType: 'object',
      description: 'Content-specific details - flexible object for type-specific fields'
    };
  }

  // Return complete validator configuration
  return {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['contentType', 'title', 'year'],
        properties: baseProperties
      }
    },
    validationLevel: 'moderate',
    validationAction: 'warn'
  };
}

/**
 * Generate movie-specific details schema
 * Includes fields specific to movies: runtime, songs (with links), boxOffice
 * 
 * @returns {object} Details schema for movies
 */
function getMovieDetailsSchema() {
  return {
    bsonType: 'object',
    description: 'Movie-specific details including runtime, songs, and box office',
    properties: {
      runtime: {
        bsonType: 'int',
        minimum: 1,
        description: 'Movie runtime in minutes'
      },
      songs: {
        bsonType: 'array',
        description: 'Array of song objects from the movie with links to YouTube, Spotify, etc.',
        items: {
          bsonType: 'object',
          required: ['title', 'singer'],
          properties: {
            title: {
              bsonType: 'string',
              description: 'Song title'
            },
            singer: {
              bsonType: 'string',
              description: 'Singer/artist name'
            },
            duration: {
              bsonType: 'string',
              description: 'Song duration (e.g., "3:45")'
            },
            links: {
              bsonType: 'array',
              description: 'Array of link objects for the song (YouTube, Spotify, etc.)',
              items: {
                bsonType: 'object',
                required: ['platform', 'url'],
                properties: {
                  platform: {
                    bsonType: 'string',
                    description: 'Platform name (YouTube, Spotify, Apple Music, etc.)'
                  },
                  url: {
                    bsonType: 'string',
                    description: 'URL to the song on the platform'
                  },
                  icon: {
                    bsonType: 'string',
                    description: 'Platform icon or emoji'
                  }
                }
              }
            }
          }
        }
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
            description: 'Worldwide box office collection'
          }
        }
      }
    }
  };
}

/**
 * Generate book-specific details schema
 * Includes fields specific to books: pages, publisher, ISBN
 * 
 * @returns {object} Details schema for books
 */
function getBookDetailsSchema() {
  return {
    bsonType: 'object',
    description: 'Book-specific details including pages, publisher, and ISBN',
    properties: {
      pages: {
        bsonType: 'int',
        minimum: 1,
        description: 'Number of pages'
      },
      publisher: {
        bsonType: 'string',
        description: 'Publisher name'
      },
      isbn: {
        bsonType: 'string',
        description: 'ISBN number'
      },
      edition: {
        bsonType: 'string',
        description: 'Edition information'
      }
    }
  };
}

/**
 * Generate music-specific details schema
 * Includes fields specific to music: duration, album, tracks
 * 
 * @returns {object} Details schema for music
 */
function getMusicDetailsSchema() {
  return {
    bsonType: 'object',
    description: 'Music-specific details including duration, album, and tracks',
    properties: {
      duration: {
        bsonType: 'string',
        description: 'Total duration (e.g., "45:30")'
      },
      album: {
        bsonType: 'string',
        description: 'Album name'
      },
      tracks: {
        bsonType: 'array',
        description: 'Array of track objects',
        items: {
          bsonType: 'object',
          required: ['title'],
          properties: {
            title: {
              bsonType: 'string',
              description: 'Track title'
            },
            duration: {
              bsonType: 'string',
              description: 'Track duration'
            },
            trackNumber: {
              bsonType: 'int',
              description: 'Track number in album'
            }
          }
        }
      },
      label: {
        bsonType: 'string',
        description: 'Record label'
      }
    }
  };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateContentSchema,
    getMovieDetailsSchema,
    getBookDetailsSchema,
    getMusicDetailsSchema
  };
}

// Made with Bob