# MongoDB Terminal Commands Guide

Quick reference for checking and managing MongoDB data from the terminal.

---

## 🚀 Quick Start

### Connect to MongoDB Pod

**Method 1: Using Environment Variables (Recommended)**
```bash
# Connect using credentials from environment variables
oc exec -it mongodb-0 -n movies-db -- mongosh moviesdb -u $MONGODB_ROOT_USERNAME -p $MONGODB_ROOT_PASSWORD --authenticationDatabase admin
```

**Method 2: Direct Connection (Simpler)**
```bash
# Connect directly (credentials are in the pod's environment)
oc exec -it mongodb-0 -n movies-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/moviesdb?authSource=admin"
```

**Method 3: Interactive (You'll be prompted for password)**
```bash
# You'll need to enter password: M0ng0DB$ecur3P@ssw0rd2024!
oc exec -it mongodb-0 -n movies-db -- mongosh moviesdb -u admin --authenticationDatabase admin
```

**Credentials:**
- Username: `admin`
- Password: `M0ng0DB$ecur3P@ssw0rd2024!`
- Auth Database: `admin`

---

## 📊 Basic Data Queries

### 1. Count Documents
```javascript
// Count all movies
db.movies.countDocuments()

// Count movies by year
db.movies.countDocuments({ year: 2010 })
```

### 2. View All Movies
```javascript
// Show all movies (pretty formatted)
db.movies.find().pretty()

// Show first 5 movies
db.movies.find().limit(5).pretty()
```

### 3. View Specific Movie
```javascript
// Find by movie name
db.movies.findOne({ movieName: "Inception" })

// Find by year
db.movies.find({ year: 1994 }).pretty()
```

### 4. Check for New Fields
```javascript
// Check if new fields exist
db.movies.findOne({}, { 
  movieName: 1, 
  movieLanguage: 1, 
  releaseDate: 1, 
  ottPlatforms: 1, 
  links: 1 
})

// Count documents with new fields
db.movies.countDocuments({ movieLanguage: { $exists: true } })
db.movies.countDocuments({ releaseDate: { $exists: true } })
db.movies.countDocuments({ ottPlatforms: { $exists: true } })
db.movies.countDocuments({ links: { $exists: true } })
```

### 5. View Sample Document
```javascript
// View one complete document
db.movies.findOne()

// View specific fields only
db.movies.findOne({}, { movieName: 1, year: 1, movieLanguage: 1, _id: 0 })
```

---

## 🔍 Advanced Queries

### Search by Language
```javascript
// Find English movies
db.movies.find({ movieLanguage: "English" }).pretty()

// Find Hindi movies
db.movies.find({ movieLanguage: "Hindi" }).pretty()
```

### Search by Rating
```javascript
// Movies with rating > 8.5
db.movies.find({ rating: { $gt: 8.5 } }).pretty()

// Movies with rating between 8 and 9
db.movies.find({ rating: { $gte: 8, $lte: 9 } }).pretty()
```

### Search by Year Range
```javascript
// Movies from 2000 onwards
db.movies.find({ year: { $gte: 2000 } }).pretty()

// Movies from 1990s
db.movies.find({ year: { $gte: 1990, $lt: 2000 } }).pretty()
```

### Search by OTT Platform
```javascript
// Movies on Netflix
db.movies.find({ "ottPlatforms.platform": "Netflix" }).pretty()

// Movies on Prime Video
db.movies.find({ "ottPlatforms.platform": "Prime Video" }).pretty()
```

### Text Search
```javascript
// Search in movie name, director, actors
db.movies.find({ $text: { $search: "Nolan" } }).pretty()

// Search for specific actor
db.movies.find({ actors: "Aamir Khan" }).pretty()
```

---

## 📋 Database Information

### Show Collections
```javascript
// List all collections
show collections

// Get collection stats
db.movies.stats()
```

### Show Indexes
```javascript
// List all indexes
db.movies.getIndexes()
```

### Show Schema Validation
```javascript
// View collection validation rules
db.getCollectionInfos({ name: "movies" })
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
db.movies.aggregate([
  { $group: { _id: "$year", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```

### Group by Language
```javascript
db.movies.aggregate([
  { $group: { _id: "$movieLanguage", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

### Average Rating by Year
```javascript
db.movies.aggregate([
  { $group: { _id: "$year", avgRating: { $avg: "$rating" } } },
  { $sort: { _id: 1 } }
])
```

### Count OTT Platforms
```javascript
db.movies.aggregate([
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
oc exec mongodb-0 -n movies-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/moviesdb?authSource=admin" --quiet --eval "
  const total = db.movies.countDocuments();
  const withMovieLanguage = db.movies.countDocuments({movieLanguage: {\$exists: true}});
  const withReleaseDate = db.movies.countDocuments({releaseDate: {\$exists: true}});
  const withOttPlatforms = db.movies.countDocuments({ottPlatforms: {\$exists: true}});
  const withLinks = db.movies.countDocuments({links: {\$exists: true}});
  
  print('Total documents: ' + total);
  print('With movieLanguage: ' + withMovieLanguage + ' (' + Math.round(withMovieLanguage/total*100) + '%)');
  print('With releaseDate: ' + withReleaseDate + ' (' + Math.round(withReleaseDate/total*100) + '%)');
  print('With ottPlatforms: ' + withOttPlatforms + ' (' + Math.round(withOttPlatforms/total*100) + '%)');
  print('With links: ' + withLinks + ' (' + Math.round(withLinks/total*100) + '%)');
"
```

### Compare Old vs New Schema
```bash
oc exec mongodb-0 -n movies-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/moviesdb?authSource=admin" --quiet --eval "
  const oldSchema = db.movies.countDocuments({language: {\$exists: true}});
  const newSchema = db.movies.countDocuments({movieLanguage: {\$exists: true}});
  
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
| Connect to MongoDB | `oc exec -it mongodb-0 -n movies-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/moviesdb?authSource=admin"` |
| Count documents | `db.movies.countDocuments()` |
| View all movies | `db.movies.find().pretty()` |
| View one movie | `db.movies.findOne()` |
| Search by name | `db.movies.find({movieName: "Inception"})` |
| Search by year | `db.movies.find({year: 2010})` |
| Check new fields | `db.movies.findOne({}, {movieLanguage:1, releaseDate:1})` |
| Exit MongoDB | `exit` or `Ctrl+D` |

### Quick Connect Commands

**Easiest (Recommended):**
```bash
oc exec -it mongodb-0 -n movies-db -- mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/moviesdb?authSource=admin"
```

**With separate parameters:**
```bash
oc exec -it mongodb-0 -n movies-db -- mongosh moviesdb -u admin -p "M0ng0DB\$ecur3P@ssw0rd2024!" --authenticationDatabase admin
```

---

## 💡 Pro Tips

### 1. Pretty Print
Always use `.pretty()` for readable output:
```javascript
db.movies.find().pretty()
```

### 2. Limit Results
Limit results to avoid overwhelming output:
```javascript
db.movies.find().limit(5)
```

### 3. Project Specific Fields
Show only fields you need:
```javascript
db.movies.find({}, { movieName: 1, year: 1, rating: 1, _id: 0 })
```

### 4. Sort Results
```javascript
// Sort by rating (descending)
db.movies.find().sort({ rating: -1 }).limit(5)

// Sort by year (ascending)
db.movies.find().sort({ year: 1 })
```

### 5. Count with Conditions
```javascript
// Count high-rated movies
db.movies.countDocuments({ rating: { $gte: 9 } })
```

---

## 🚨 Common Issues

### Issue: "command not found: mongosh"
**Solution:** Use `mongo` instead of `mongosh` for older MongoDB versions:
```bash
kubectl exec -it mongodb-0 -n movies-db -- mongo moviesdb
```

### Issue: "pod not found"
**Solution:** Check pod name:
```bash
kubectl get pods -n movies-db
```

### Issue: "connection refused"
**Solution:** Check if pod is running:
```bash
kubectl get pod mongodb-0 -n movies-db
kubectl logs mongodb-0 -n movies-db
```

---

## 📚 Additional Resources

- [MongoDB Query Documentation](https://docs.mongodb.com/manual/tutorial/query-documents/)
- [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
- [MongoDB Shell Commands](https://docs.mongodb.com/manual/reference/mongo-shell/)

---

**Made with Bob** 🤖