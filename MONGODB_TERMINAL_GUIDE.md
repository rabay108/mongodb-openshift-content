# MongoDB Terminal Commands Guide

Quick reference for checking and managing MongoDB data from the terminal.

---

## 🚀 Quick Start

### Connect to MongoDB Pod

**Method 1: Using Environment Variables (Recommended)**
```bash
# Connect using credentials from environment variables
oc exec -it mongodb-0 -n content-db -- mongosh contentdb -u $MONGODB_ROOT_USERNAME -p $MONGODB_ROOT_PASSWORD --authenticationDatabase admin
```

**Method 2: Direct Connection (Simpler)**
```bash
# Connect directly (credentials are in the pod's environment)
oc exec -it mongodb-0 -n content-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb?authSource=admin"
```

**Method 3: Interactive (You'll be prompted for password)**
```bash
# You'll need to enter password: M0ng0DB$ecur3P@ssw0rd2024!
oc exec -it mongodb-0 -n content-db -- mongosh contentdb -u admin --authenticationDatabase admin
```

**Credentials:**
- Username: `admin`
- Password: `M0ng0DB$ecur3P@ssw0rd2024!`
- Auth Database: `admin`

---

## 📊 Basic Data Queries

### 1. Count Documents
```javascript
// Count all content items
db.content_001.countDocuments()

// Count content by year
db.content_001.countDocuments({ year: 2010 })
```

### 2. View All Content
```javascript
// Show all content (pretty formatted)
db.content_001.find().pretty()

// Show first 5 content items
db.content_001.find().limit(5).pretty()
```

### 3. View Specific Content
```javascript
// Find by movie name
db.content_001.findOne({ movieName: "Inception" })

// Find by year
db.content_001.find({ year: 1994 }).pretty()
```

### 4. Check for New Fields
```javascript
// Check if new fields exist
db.content_001.findOne({}, {
  movieName: 1,
  movieLanguage: 1,
  releaseDate: 1,
  ottPlatforms: 1,
  links: 1
})

// Count documents with new fields
db.content_001.countDocuments({ movieLanguage: { $exists: true } })
db.content_001.countDocuments({ releaseDate: { $exists: true } })
db.content_001.countDocuments({ ottPlatforms: { $exists: true } })
db.content_001.countDocuments({ links: { $exists: true } })
```

### 5. View Sample Document
```javascript
// View one complete document
db.content_001.findOne()

// View specific fields only
db.content_001.findOne({}, { movieName: 1, year: 1, movieLanguage: 1, _id: 0 })
```

---

## 🔍 Advanced Queries

### Search by Language
```javascript
// Find English content
db.content_001.find({ movieLanguage: "English" }).pretty()

// Find Hindi content
db.content_001.find({ movieLanguage: "Hindi" }).pretty()
```

### Search by Rating
```javascript
// Content with rating > 8.5
db.content_001.find({ rating: { $gt: 8.5 } }).pretty()

// Content with rating between 8 and 9
db.content_001.find({ rating: { $gte: 8, $lte: 9 } }).pretty()
```

### Search by Year Range
```javascript
// Content from 2000 onwards
db.content_001.find({ year: { $gte: 2000 } }).pretty()

// Content from 1990s
db.content_001.find({ year: { $gte: 1990, $lt: 2000 } }).pretty()
```

### Search by OTT Platform
```javascript
// Content on Netflix
db.content_001.find({ "ottPlatforms.platform": "Netflix" }).pretty()

// Content on Prime Video
db.content_001.find({ "ottPlatforms.platform": "Prime Video" }).pretty()
```

### Text Search
```javascript
// Search in movie name, director, actors
db.content_001.find({ $text: { $search: "Nolan" } }).pretty()

// Search for specific actor
db.content_001.find({ actors: "Aamir Khan" }).pretty()
```

---

## 📋 Database Information

### Show Collections
```javascript
// List all collections
show collections

// Get collection stats
db.content_001.stats()
```

### Show Indexes
```javascript
// List all indexes
db.content_001.getIndexes()
```

### Show Schema Validation
```javascript
// View collection validation rules
db.getCollectionInfos({ name: "content_001" })
```

---

## 🛠️ One-Line Commands (From Terminal)

### Without Entering MongoDB Shell

**Note:** All commands include authentication. Replace `oc` with `kubectl` if not using OpenShift.

```bash
# Set credentials as variables (optional, for convenience)
export MONGO_USER="admin"
export MONGO_PASS="M0ng0DB\$ecur3P@ssw0rd2024!"
export MONGO_AUTH="mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017/moviesdb?authSource=admin"

# Count all documents
oc exec mongodb-0 -n movies-db -- mongosh "${MONGO_AUTH}" --quiet --eval "db.movies.countDocuments()"

# View one document
oc exec mongodb-0 -n movies-db -- mongosh "${MONGO_AUTH}" --quiet --eval "db.movies.findOne()"

# Check for new fields
oc exec mongodb-0 -n movies-db -- mongosh "${MONGO_AUTH}" --quiet --eval "db.movies.findOne({}, {movieName:1, movieLanguage:1, releaseDate:1, ottPlatforms:1, links:1})"

# Count documents with new fields
oc exec mongodb-0 -n movies-db -- mongosh "${MONGO_AUTH}" --quiet --eval "print('movieLanguage: ' + db.movies.countDocuments({movieLanguage: {\$exists: true}})); print('releaseDate: ' + db.movies.countDocuments({releaseDate: {\$exists: true}})); print('ottPlatforms: ' + db.movies.countDocuments({ottPlatforms: {\$exists: true}})); print('links: ' + db.movies.countDocuments({links: {\$exists: true}}))"

# List all movie names
oc exec mongodb-0 -n movies-db -- mongosh "${MONGO_AUTH}" --quiet --eval "db.movies.find({}, {movieName:1, year:1, _id:0}).forEach(printjson)"

# Find movies by year
oc exec mongodb-0 -n movies-db -- mongosh "${MONGO_AUTH}" --quiet --eval "db.movies.find({year: 2010}, {movieName:1, year:1, _id:0}).forEach(printjson)"

# Check database size
oc exec mongodb-0 -n movies-db -- mongosh "${MONGO_AUTH}" --quiet --eval "db.stats()"
```

**Alternative: Direct commands without variables**
```bash
# Count all documents (direct)
oc exec mongodb-0 -n movies-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/moviesdb?authSource=admin" --quiet --eval "db.movies.countDocuments()"

# View one document (direct)
oc exec mongodb-0 -n movies-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/moviesdb?authSource=admin" --quiet --eval "db.movies.findOne()"
```

---

## 📝 Useful Aggregations

### Group by Year
```javascript
db.content_001.aggregate([
  { $group: { _id: "$year", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```

### Group by Language
```javascript
db.content_001.aggregate([
  { $group: { _id: "$movieLanguage", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

### Average Rating by Year
```javascript
db.content_001.aggregate([
  { $group: { _id: "$year", avgRating: { $avg: "$rating" } } },
  { $sort: { _id: 1 } }
])
```

### Count OTT Platforms
```javascript
db.content_001.aggregate([
  { $unwind: "$ottPlatforms" },
  { $group: { _id: "$ottPlatforms.platform", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

---

## 🔧 Data Verification Commands

### Verify Schema Update
```bash
# Run this from your terminal (not in MongoDB shell)
oc exec mongodb-0 -n content-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb?authSource=admin" --quiet --eval "
  const total = db.content_001.countDocuments();
  const withMovieLanguage = db.content_001.countDocuments({movieLanguage: {\$exists: true}});
  const withReleaseDate = db.content_001.countDocuments({releaseDate: {\$exists: true}});
  const withOttPlatforms = db.content_001.countDocuments({ottPlatforms: {\$exists: true}});
  const withLinks = db.content_001.countDocuments({links: {\$exists: true}});
  
  print('Total documents: ' + total);
  print('With movieLanguage: ' + withMovieLanguage + ' (' + Math.round(withMovieLanguage/total*100) + '%)');
  print('With releaseDate: ' + withReleaseDate + ' (' + Math.round(withReleaseDate/total*100) + '%)');
  print('With ottPlatforms: ' + withOttPlatforms + ' (' + Math.round(withOttPlatforms/total*100) + '%)');
  print('With links: ' + withLinks + ' (' + Math.round(withLinks/total*100) + '%)');
"
```

### Compare Old vs New Schema
```bash
oc exec mongodb-0 -n content-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb?authSource=admin" --quiet --eval "
  const oldSchema = db.content_001.countDocuments({language: {\$exists: true}});
  const newSchema = db.content_001.countDocuments({movieLanguage: {\$exists: true}});
  
  print('Documents with old field (language): ' + oldSchema);
  print('Documents with new field (movieLanguage): ' + newSchema);
  
  if (oldSchema > 0 && newSchema > 0) {
    print('⚠️  Both old and new schema documents exist');
  } else if (newSchema > 0) {
    print('✅ All documents use new schema');
  } else if (oldSchema > 0) {
    print('⚠️  All documents use old schema');
  }
"
```

---

## 🎯 Quick Reference Card

| Task | Command |
|------|---------|
| Connect to MongoDB | `oc exec -it mongodb-0 -n content-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb?authSource=admin"` |
| Count documents | `db.content_001.countDocuments()` |
| View all content | `db.content_001.find().pretty()` |
| View one item | `db.content_001.findOne()` |
| Search by name | `db.content_001.find({movieName: "Inception"})` |
| Search by year | `db.content_001.find({year: 2010})` |
| Check new fields | `db.movies.findOne({}, {movieLanguage:1, releaseDate:1})` |
| Exit MongoDB | `exit` or `Ctrl+D` |

### Quick Connect Commands

**Easiest (Recommended):**
```bash
oc exec -it mongodb-0 -n content-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb?authSource=admin"
```

**With separate parameters:**
```bash
oc exec -it mongodb-0 -n content-db -- mongosh contentdb -u admin -p "M0ng0DB\$ecur3P@ssw0rd2024!" --authenticationDatabase admin
```

---

## 💡 Pro Tips

### 1. Pretty Print
Always use `.pretty()` for readable output:
```javascript
db.content_001.find().pretty()
```

### 2. Limit Results
Limit results to avoid overwhelming output:
```javascript
db.content_001.find().limit(5)
```

### 3. Project Specific Fields
Show only fields you need:
```javascript
db.content_001.find({}, { movieName: 1, year: 1, rating: 1, _id: 0 })
```

### 4. Sort Results
```javascript
// Sort by rating (descending)
db.content_001.find().sort({ rating: -1 }).limit(5)

// Sort by year (ascending)
db.content_001.find().sort({ year: 1 })
```

### 5. Count with Conditions
```javascript
// Count high-rated content
db.content_001.countDocuments({ rating: { $gte: 9 } })
```

---

## 🚨 Common Issues

### Issue: "command not found: mongosh"
**Solution:** Use `mongo` instead of `mongosh` for older MongoDB versions:
```bash
kubectl exec -it mongodb-0 -n content-db -- mongo contentdb
```

### Issue: "pod not found"
**Solution:** Check pod name:
```bash
kubectl get pods -n content-db
```

### Issue: "connection refused"
**Solution:** Check if pod is running:
```bash
kubectl get pod mongodb-0 -n content-db
kubectl logs mongodb-0 -n content-db
```

---

## 📚 Additional Resources

- [MongoDB Query Documentation](https://docs.mongodb.com/manual/tutorial/query-documents/)
- [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
- [MongoDB Shell Commands](https://docs.mongodb.com/manual/reference/mongo-shell/)

---

**Made with Bob** 🤖