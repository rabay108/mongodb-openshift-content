// Content Types and Subtypes Metadata
// This file defines the content type codes and their associated metadata
// Used by the flexible schema system to support multiple content types

/**
 * Content Type Definitions
 * Each content type has a unique 3-digit code and metadata
 * Format: "code": { name, icon, description }
 */
const contentTypes = {
  "001": { 
    name: "Movies", 
    icon: "🎬", 
    description: "Film and cinema content" 
  },
  "002": { 
    name: "Books", 
    icon: "📚", 
    description: "Written literature" 
  },
  "003": { 
    name: "Music", 
    icon: "🎵", 
    description: "Audio recordings" 
  }
};

/**
 * Content Subtype Definitions
 * Each content type can have multiple subtypes (categories/genres)
 * Format: "contentTypeCode": { "subtypeCode": "subtypeName" }
 */
const contentSubtypes = {
  "001": { // Movies
    "001": "Action",
    "002": "Drama",
    "003": "Comedy",
    "004": "Romance",
    "005": "Thriller",
    "006": "Horror",
    "007": "Sci-Fi",
    "008": "Crime"
  },
  "002": { // Books
    "001": "Fiction",
    "002": "Non-Fiction",
    "003": "Biography",
    "004": "Mystery",
    "005": "Fantasy"
  },
  "003": { // Music
    "001": "Pop",
    "002": "Rock",
    "003": "Classical",
    "004": "Jazz",
    "005": "Hip-Hop"
  }
};

/**
 * Helper function to get content type name from code
 * @param {string} code - 3-digit content type code
 * @returns {string} Content type name or 'Unknown'
 */
function getContentTypeName(code) {
  return contentTypes[code] ? contentTypes[code].name : 'Unknown';
}

/**
 * Helper function to get subtype name from codes
 * @param {string} contentTypeCode - 3-digit content type code
 * @param {string} subtypeCode - 3-digit subtype code
 * @returns {string} Subtype name or 'Unknown'
 */
function getSubtypeName(contentTypeCode, subtypeCode) {
  if (contentSubtypes[contentTypeCode] && contentSubtypes[contentTypeCode][subtypeCode]) {
    return contentSubtypes[contentTypeCode][subtypeCode];
  }
  return 'Unknown';
}

/**
 * Helper function to get all subtypes for a content type
 * @param {string} contentTypeCode - 3-digit content type code
 * @returns {object} Object with subtype codes as keys and names as values
 */
function getSubtypesForContentType(contentTypeCode) {
  return contentSubtypes[contentTypeCode] || {};
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    contentTypes,
    contentSubtypes,
    getContentTypeName,
    getSubtypeName,
    getSubtypesForContentType
  };
}

// Made with Bob