# MongoDB Schema Evolution Guide

## 🛡️ Your Data is Safe!

**Good news:** Your current schema configuration is designed to **preserve existing records** when adding new fields. Here's why:

## Current Schema Configuration

```javascript
validationLevel: 'moderate',
validationAction: 'warn'
```

### What This Means:

#### ✅ **`validationLevel: 'moderate'`**
- **Existing documents are NEVER validated** - they remain untouched
- **Only NEW inserts and updates** are validated against the schema
- **Old records without new fields continue to work perfectly**

#### ✅ **`validationAction: 'warn'`**
- **Documents that don't match schema are still accepted**
- **Only logs a warning** - doesn't reject the operation
- **Maximum flexibility** for schema evolution

---

## How Schema Evolution Works

### Scenario 1: Adding New Fields (Like We Just Did)

**Before (Old Schema):**
```javascript
{
  movieName: "Inception",
  year: 2010,
  language: "English",  // old field
  rating: 8.8
}
```

**After (New Schema):**
```javascript
{
  movieName: "Inception",
  year: 2010,
  movieLanguage: "English",  // renamed field
  releaseDate: new Date("2010-07-16"),  // new field
  ottPlatforms: [...],  // new field
  links: [...],  // new field
  rating: 8.8
}
```

**What Happens to Existing Records:**
- ✅ **Old records remain unchanged** - they still have `language` field
- ✅ **Old records are still queryable** - no errors
- ✅ **New records use new schema** - have all new fields
- ✅ **Both coexist peacefully** - MongoDB is schema-flexible

---

## Future-Proof Design

### Adding More Fields in the Future

When you add new fields in the future:

1. **Update the schema** in `init-schema.js`
2. **Add fields to new documents** in `sample-data.js`
3. **Existing documents are NOT affected**

**Example - Adding a `director_bio` field:**

```javascript
// In init-schema.js - add to properties
director_bio: {
  bsonType: 'string',
  description: 'Biography of the director'
}
```

**Result:**
- ✅ Old documents without `director_bio` → Still work
- ✅ New documents with `director_bio` → Work perfectly
- ✅ Queries handle missing fields gracefully → Return `null`

---

## Schema Validation Levels Explained

### Your Current Setup: `moderate` + `warn`

| Validation Level | New Inserts | Updates | Existing Docs |
|-----------------|-------------|---------|---------------|
| **moderate** (yours) | ✅ Validated | ✅ Validated | ❌ Never validated |
| strict | ✅ Validated | ✅ Validated | ✅ Validated on update |
| off | ❌ Not validated | ❌ Not validated | ❌ Never validated |

| Validation Action | Behavior |
|------------------|----------|
| **warn** (yours) | ⚠️ Logs warning, accepts document |
| error | ❌ Rejects document, throws error |

**Your configuration (`moderate` + `warn`) is the SAFEST for schema evolution!**

---

## Real-World Example

### Current Database State

```javascript
// Old document (before schema update)
{
  _id: ObjectId("..."),
  movieName: "The Godfather",
  language: "English",  // old field name
  year: 1972
  // Missing: movieLanguage, releaseDate, ottPlatforms, links
}

// New document (after schema update)
{
  _id: ObjectId("..."),
  movieName: "Inception",
  movieLanguage: "English",  // new field name
  releaseDate: ISODate("2010-07-16"),
  ottPlatforms: [{platform: "Netflix", ...}],
  links: [{label: "Trailer", ...}],
  year: 2010
}
```

### Querying Both Documents

```javascript
// Query works for both old and new documents
db.movies.find({ year: { $gte: 1970 } })

// Query with new field - old docs return null
db.movies.find({}, { movieLanguage: 1, releaseDate: 1 })
// Old doc: { movieLanguage: null, releaseDate: null }
// New doc: { movieLanguage: "English", releaseDate: ISODate(...) }

// Query with old field - still works!
db.movies.find({ language: "English" })
// Returns old documents that have 'language' field
```

---

## Best Practices for Future Schema Changes

### ✅ DO:

1. **Add new optional fields** - existing docs won't have them
2. **Keep `validationLevel: 'moderate'`** - protects existing data
3. **Keep `validationAction: 'warn'`** - maximum flexibility
4. **Use migration scripts** only when you want to update old records
5. **Document schema changes** in this guide

### ❌ DON'T:

1. **Don't change to `validationLevel: 'strict'`** - would validate existing docs
2. **Don't change to `validationAction: 'error'`** - would reject non-conforming docs
3. **Don't make existing fields required** - old docs might not have them
4. **Don't delete the schema** - provides documentation and validation

---

## Migration Strategy (Optional)

If you want to update old records with new fields:

### Option 1: Gradual Migration (Recommended)
```javascript
// Update documents as they're accessed
db.movies.find({ movieLanguage: { $exists: false } }).forEach(doc => {
  db.movies.updateOne(
    { _id: doc._id },
    { 
      $set: { 
        movieLanguage: doc.language,
        releaseDate: new Date(doc.year + "-01-01"),
        ottPlatforms: [],
        links: []
      },
      $unset: { language: "" }
    }
  );
});
```

### Option 2: Use Reload Scripts
- Use the scripts in `scripts/` directory
- Only when you want fresh data
- Backs up old data first

### Option 3: Do Nothing (Also Valid!)
- Let old and new documents coexist
- MongoDB handles this gracefully
- No action needed

---

## Schema Validation Rules

### Required Fields (Always Enforced)
```javascript
required: ['movieName', 'year']
```
- Only `movieName` and `year` are required
- All other fields are optional
- Old documents without new fields are valid

### Optional Fields (Not Enforced)
- `movieLanguage`, `releaseDate`, `ottPlatforms`, `links`
- `actors`, `actresses`, `songs`, `director`, `genre`
- `rating`, `boxOffice`, `metadata`

**This means:** Documents can have any combination of these fields!

---

## Testing Schema Flexibility

### Test 1: Insert Old-Style Document
```javascript
db.movies.insertOne({
  movieName: "Old Movie",
  year: 2000,
  language: "English"  // old field
});
// ✅ Works! Warning logged, document accepted
```

### Test 2: Insert New-Style Document
```javascript
db.movies.insertOne({
  movieName: "New Movie",
  year: 2024,
  movieLanguage: "English",  // new field
  releaseDate: new Date("2024-01-01"),
  ottPlatforms: [],
  links: []
});
// ✅ Works! Matches schema perfectly
```

### Test 3: Query Both
```javascript
db.movies.find({ year: { $gte: 2000 } });
// ✅ Returns both old and new documents
```

---

## Summary

### 🎯 Key Takeaways:

1. ✅ **Existing records are SAFE** - never deleted or modified automatically
2. ✅ **Schema is FLEXIBLE** - old and new documents coexist
3. ✅ **Future changes are EASY** - just add new optional fields
4. ✅ **No data loss** - `moderate` + `warn` protects everything
5. ✅ **Backward compatible** - old queries still work

### 🚀 When Adding New Fields:

1. Update `init-schema.js` with new field definitions
2. Update `sample-data.js` with new field values
3. Existing documents continue working unchanged
4. New documents include the new fields
5. Optional: Run migration script to update old records

### 🛡️ Your Configuration is Perfect For:

- ✅ Schema evolution
- ✅ Adding new features
- ✅ Preserving existing data
- ✅ Backward compatibility
- ✅ Zero downtime updates

**You can confidently add new fields in the future without worrying about breaking existing data!** 🎉

---

**Made with Bob** 🤖