// MongoDB Sample Data Script
// This script inserts sample movie documents into the movies collection
// Demonstrates the schema structure and extensibility

print('========================================');
print('Inserting Sample Movie Data');
print('========================================');

// Switch to the moviesdb database
db = db.getSiblingDB('moviesdb');

// Sample movie documents with realistic data
const sampleMovies = [
  {
    movieName: "The Shawshank Redemption",
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
    actresses: ["Clancy Brown"],
    songs: [
      { title: "If I Didn't Care", singer: "The Ink Spots", duration: "3:06" },
      { title: "Lovesick Blues", singer: "Hank Williams", duration: "2:43" }
    ],
    year: 1994,
    director: "Frank Darabont",
    genre: ["Drama", "Crime"],
    movieLanguage: "English",
    releaseDate: new Date("1994-09-23"),
    rating: 9.3,
    boxOffice: {
      budget: "$25 million",
      worldwide: "$73.3 million"
    },
    ottPlatforms: [
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/70047108" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0PDLCBKDXQ8R5JLF8JVQZD0LKL" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=6hB3S9bIaco" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.netflix.com/title/70047108", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=6hB3S9bIaco", type: "trailer" },
      { label: "Behind the Scenes", url: "https://www.youtube.com/watch?v=BuRuwR2JSXI", type: "teaser" }
    ],
    metadata: {
      awards: ["Academy Award nominations: 7"],
      basedOn: "Rita Hayworth and Shawshank Redemption by Stephen King",
      filmingLocation: "Ohio State Reformatory",
      trivia: "The movie was a box office disappointment but became hugely popular on home video"
    }
  },
  {
    movieName: "Dilwale Dulhania Le Jayenge",
    actors: ["Shah Rukh Khan", "Amrish Puri", "Anupam Kher", "Farida Jalal"],
    actresses: ["Kajol", "Mandira Bedi"],
    songs: [
      { title: "Tujhe Dekha To", singer: "Kumar Sanu, Lata Mangeshkar", duration: "5:32" },
      { title: "Mere Khwabon Mein", singer: "Lata Mangeshkar", duration: "5:18" },
      { title: "Ho Gaya Hai Tujhko", singer: "Lata Mangeshkar, Kumar Sanu", duration: "6:12" },
      { title: "Zara Sa Jhoom Loon Main", singer: "Abhijeet", duration: "4:48" }
    ],
    year: 1995,
    director: "Aditya Chopra",
    genre: ["Romance", "Drama", "Musical"],
    movieLanguage: "Hindi",
    releaseDate: new Date("1995-10-20"),
    rating: 8.1,
    boxOffice: {
      budget: "₹4 crore",
      worldwide: "₹200+ crore"
    },
    ottPlatforms: [
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0GKQY6LQVZ8WJHXQVZ8W" },
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/17457962" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=gKVKPNJRCvQ" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.primevideo.com/detail/0GKQY6LQVZ8WJHXQVZ8W", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=gKVKPNJRCvQ", type: "trailer" },
      { label: "Song: Tujhe Dekha To", url: "https://www.youtube.com/watch?v=Jb3pN0vVZhA", type: "song" },
      { label: "Song: Mere Khwabon Mein", url: "https://www.youtube.com/watch?v=Nt4dMCKqaI4", type: "song" },
      { label: "Song: Ho Gaya Hai Tujhko", url: "https://www.youtube.com/watch?v=8KsyOVn5Prc", type: "song" }
    ],
    metadata: {
      awards: ["Filmfare Awards: 10 wins"],
      runningTime: "Still running in Maratha Mandir, Mumbai",
      culturalImpact: "Longest-running film in Indian cinema history",
      musicDirector: "Jatin-Lalit"
    }
  },
  {
    movieName: "The Godfather",
    actors: ["Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall"],
    actresses: ["Diane Keaton", "Talia Shire"],
    songs: [
      { title: "The Godfather Waltz", singer: "Nino Rota (Instrumental)", duration: "3:38" },
      { title: "Speak Softly Love", singer: "Andy Williams", duration: "2:42" }
    ],
    year: 1972,
    director: "Francis Ford Coppola",
    genre: ["Crime", "Drama"],
    movieLanguage: "English",
    releaseDate: new Date("1972-03-24"),
    rating: 9.2,
    boxOffice: {
      budget: "$6-7 million",
      worldwide: "$250-291 million"
    },
    ottPlatforms: [
      { platform: "Paramount+", icon: "⭐", url: "https://www.paramountplus.com/movies/the-godfather" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0PDLCBKDXQ8R5JLF8JVQZD0LKL" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=sY1S34973zA" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.paramountplus.com/movies/the-godfather", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=sY1S34973zA", type: "trailer" },
      { label: "50th Anniversary Trailer", url: "https://www.youtube.com/watch?v=UaVTIH8mujAY", type: "teaser" }
    ],
    metadata: {
      awards: ["Academy Awards: 3 wins including Best Picture"],
      basedOn: "Novel by Mario Puzo",
      preservation: "Selected for preservation in National Film Registry",
      legacy: "Considered one of the greatest films ever made"
    }
  },
  {
    movieName: "Lagaan",
    actors: ["Aamir Khan", "Raghubir Yadav", "Rajesh Vivek", "Kulbhushan Kharbanda"],
    actresses: ["Gracy Singh", "Rachel Shelley"],
    songs: [
      { title: "Mitwa", singer: "Udit Narayan, Alka Yagnik", duration: "5:47" },
      { title: "Chale Chalo", singer: "A.R. Rahman, Srinivas", duration: "4:54" },
      { title: "Radha Kaise Na Jale", singer: "Asha Bhosle, Udit Narayan", duration: "6:32" },
      { title: "O Paalanhaare", singer: "Lata Mangeshkar", duration: "6:03" }
    ],
    year: 2001,
    director: "Ashutosh Gowariker",
    genre: ["Drama", "Musical", "Sports"],
    movieLanguage: "Hindi",
    releaseDate: new Date("2001-06-15"),
    rating: 8.1,
    boxOffice: {
      budget: "₹25 crore",
      worldwide: "₹65.97 crore"
    },
    ottPlatforms: [
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/60021735" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0GKQY6LQVZ8WJHXQVZ8W" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=IzWGFdN1Aw0" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.netflix.com/title/60021735", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=IzWGFdN1Aw0", type: "trailer" },
      { label: "Song: Mitwa", url: "https://www.youtube.com/watch?v=qctvvvTz3Yk", type: "song" },
      { label: "Song: Chale Chalo", url: "https://www.youtube.com/watch?v=aZXZBT3jASw", type: "song" },
      { label: "Song: Radha Kaise Na Jale", url: "https://www.youtube.com/watch?v=Nt4dMCKqaI4", type: "song" }
    ],
    metadata: {
      awards: ["Academy Award nomination for Best Foreign Language Film"],
      musicDirector: "A.R. Rahman",
      setting: "1893 British India",
      theme: "Cricket match between villagers and British officers"
    }
  },
  {
    movieName: "Inception",
    actors: ["Leonardo DiCaprio", "Tom Hardy", "Joseph Gordon-Levitt", "Cillian Murphy"],
    actresses: ["Marion Cotillard", "Ellen Page"],
    songs: [
      { title: "Time", singer: "Hans Zimmer (Instrumental)", duration: "4:35" },
      { title: "Dream Is Collapsing", singer: "Hans Zimmer (Instrumental)", duration: "2:23" }
    ],
    year: 2010,
    director: "Christopher Nolan",
    genre: ["Action", "Sci-Fi", "Thriller"],
    movieLanguage: "English",
    releaseDate: new Date("2010-07-16"),
    rating: 8.8,
    boxOffice: {
      budget: "$160 million",
      worldwide: "$836.8 million"
    },
    ottPlatforms: [
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/70131314" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0PDLCBKDXQ8R5JLF8JVQZD0LKL" },
      { platform: "HBO Max", icon: "🎭", url: "https://www.hbomax.com/feature/urn:hbo:feature:GXdp5IQP5IcPCwwEAAAEm" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.netflix.com/title/70131314", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=YoHD9XEInc0", type: "trailer" },
      { label: "Teaser Trailer", url: "https://www.youtube.com/watch?v=66TuSJo4dZM", type: "teaser" }
    ],
    metadata: {
      awards: ["Academy Awards: 4 wins from 8 nominations"],
      visualEffects: "Practical effects emphasized over CGI",
      concept: "Dreams within dreams",
      composer: "Hans Zimmer"
    }
  },
  {
    movieName: "3 Idiots",
    actors: ["Aamir Khan", "R. Madhavan", "Sharman Joshi", "Boman Irani"],
    actresses: ["Kareena Kapoor", "Mona Singh"],
    songs: [
      { title: "All Izz Well", singer: "Sonu Nigam, Shaan, Swanand Kirkire", duration: "5:03" },
      { title: "Zoobi Doobi", singer: "Sonu Nigam, Shreya Ghoshal", duration: "4:32" },
      { title: "Give Me Some Sunshine", singer: "Suraj Jagan", duration: "4:02" },
      { title: "Aal Izz Well", singer: "Sonu Nigam", duration: "3:37" }
    ],
    year: 2009,
    director: "Rajkumar Hirani",
    genre: ["Comedy", "Drama"],
    movieLanguage: "Hindi",
    releaseDate: new Date("2009-12-25"),
    rating: 8.4,
    boxOffice: {
      budget: "₹55 crore",
      worldwide: "₹460 crore"
    },
    ottPlatforms: [
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/70121522" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0GKQY6LQVZ8WJHXQVZ8W" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=K0eDlFX9GMc" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.netflix.com/title/70121522", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=K0eDlFX9GMc", type: "trailer" },
      { label: "Song: All Izz Well", url: "https://www.youtube.com/watch?v=yJ_DVIRUSyc", type: "song" },
      { label: "Song: Zoobi Doobi", url: "https://www.youtube.com/watch?v=Kas6akz1jWU", type: "song" },
      { label: "Song: Give Me Some Sunshine", url: "https://www.youtube.com/watch?v=Kas6akz1jWU", type: "song" }
    ],
    metadata: {
      awards: ["Filmfare Awards: 6 wins"],
      basedOn: "Novel 'Five Point Someone' by Chetan Bhagat",
      theme: "Education system critique",
      musicDirector: "Shantanu Moitra",
      highestGrossing: "Highest-grossing Bollywood film at the time"
    }
  },
  {
    movieName: "Pulp Fiction",
    actors: ["John Travolta", "Samuel L. Jackson", "Bruce Willis", "Tim Roth"],
    actresses: ["Uma Thurman", "Amanda Plummer"],
    songs: [
      { title: "Misirlou", singer: "Dick Dale & His Del-Tones", duration: "2:13" },
      { title: "Girl, You'll Be a Woman Soon", singer: "Urge Overkill", duration: "2:53" },
      { title: "Son of a Preacher Man", singer: "Dusty Springfield", duration: "2:28" }
    ],
    year: 1994,
    director: "Quentin Tarantino",
    genre: ["Crime", "Drama"],
    movieLanguage: "English",
    releaseDate: new Date("1994-10-14"),
    rating: 8.9,
    boxOffice: {
      budget: "$8 million",
      worldwide: "$213.9 million"
    },
    ottPlatforms: [
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/880640" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0PDLCBKDXQ8R5JLF8JVQZD0LKL" },
      { platform: "Paramount+", icon: "⭐", url: "https://www.paramountplus.com/movies/pulp-fiction" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.netflix.com/title/880640", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=s7EdQ4FqbhY", type: "trailer" },
      { label: "25th Anniversary Trailer", url: "https://www.youtube.com/watch?v=tGpTpVyI_OQ", type: "teaser" }
    ],
    metadata: {
      awards: ["Academy Award for Best Original Screenplay"],
      narrative: "Non-linear narrative structure",
      culturalImpact: "Revitalized John Travolta's career",
      preservation: "Selected for preservation in National Film Registry"
    }
  },
  {
    movieName: "Sholay",
    actors: ["Dharmendra", "Amitabh Bachchan", "Sanjeev Kumar", "Amjad Khan"],
    actresses: ["Hema Malini", "Jaya Bachchan"],
    songs: [
      { title: "Yeh Dosti", singer: "Kishore Kumar, Manna Dey", duration: "5:18" },
      { title: "Mehbooba Mehbooba", singer: "R.D. Burman", duration: "5:42" },
      { title: "Holi Ke Din", singer: "Kishore Kumar", duration: "4:23" },
      { title: "Koi Haseena Jab", singer: "Kishore Kumar", duration: "4:56" }
    ],
    year: 1975,
    director: "Ramesh Sippy",
    genre: ["Action", "Adventure", "Drama"],
    movieLanguage: "Hindi",
    releaseDate: new Date("1975-08-15"),
    rating: 8.2,
    boxOffice: {
      budget: "₹2 crore",
      worldwide: "₹35 crore"
    },
    ottPlatforms: [
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0GKQY6LQVZ8WJHXQVZ8W" },
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/70047108" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=jGSUHq1iIbI" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.primevideo.com/detail/0GKQY6LQVZ8WJHXQVZ8W", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=jGSUHq1iIbI", type: "trailer" },
      { label: "Song: Yeh Dosti", url: "https://www.youtube.com/watch?v=Kas6akz1jWU", type: "song" },
      { label: "Song: Mehbooba Mehbooba", url: "https://www.youtube.com/watch?v=Kas6akz1jWU", type: "song" },
      { label: "Song: Holi Ke Din", url: "https://www.youtube.com/watch?v=Kas6akz1jWU", type: "song" }
    ],
    metadata: {
      awards: ["Filmfare Awards: 7 nominations"],
      legacy: "Considered the greatest Indian film of all time",
      musicDirector: "R.D. Burman",
      villain: "Gabbar Singh became iconic",
      reRelease: "Multiple re-releases over decades"
    }
  },
  {
    movieName: "The Dark Knight",
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    actresses: ["Maggie Gyllenhaal"],
    songs: [
      { title: "Why So Serious?", singer: "Hans Zimmer, James Newton Howard (Instrumental)", duration: "9:14" },
      { title: "Like a Dog Chasing Cars", singer: "Hans Zimmer, James Newton Howard (Instrumental)", duration: "4:53" }
    ],
    year: 2008,
    director: "Christopher Nolan",
    genre: ["Action", "Crime", "Drama"],
    movieLanguage: "English",
    releaseDate: new Date("2008-07-18"),
    rating: 9.0,
    boxOffice: {
      budget: "$185 million",
      worldwide: "$1.005 billion"
    },
    ottPlatforms: [
      { platform: "HBO Max", icon: "🎭", url: "https://www.hbomax.com/feature/urn:hbo:feature:GXdp5IQP5IcPCwwEAAAEm" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0PDLCBKDXQ8R5JLF8JVQZD0LKL" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=EXeTwQWrcwY" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.hbomax.com/feature/urn:hbo:feature:GXdp5IQP5IcPCwwEAAAEm", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=EXeTwQWrcwY", type: "trailer" },
      { label: "Teaser Trailer", url: "https://www.youtube.com/watch?v=yQ5U8suTUw0", type: "teaser" }
    ],
    metadata: {
      awards: ["Academy Awards: 2 wins including Best Supporting Actor (Heath Ledger)"],
      posthumous: "Heath Ledger's posthumous Oscar win",
      imax: "First major feature film partially shot in IMAX",
      legacy: "Redefined superhero genre"
    }
  },
  {
    movieName: "Dangal",
    actors: ["Aamir Khan", "Aparshakti Khurana", "Sakshi Tanwar"],
    actresses: ["Fatima Sana Shaikh", "Sanya Malhotra", "Zaira Wasim"],
    songs: [
      { title: "Haanikaarak Bapu", singer: "Sarwar Khan, Sartaz Khan Barna", duration: "3:43" },
      { title: "Dhaakad", singer: "Raftaar", duration: "3:26" },
      { title: "Gilehriyaan", singer: "Jonita Gandhi", duration: "3:08" },
      { title: "Naina", singer: "Arijit Singh", duration: "4:02" }
    ],
    year: 2016,
    director: "Nitesh Tiwari",
    genre: ["Biography", "Drama", "Sports"],
    movieLanguage: "Hindi",
    releaseDate: new Date("2016-12-23"),
    rating: 8.3,
    boxOffice: {
      budget: "₹70 crore",
      worldwide: "₹2,024 crore"
    },
    ottPlatforms: [
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/80166185" },
      { platform: "Disney+ Hotstar", icon: "🌟", url: "https://www.hotstar.com/in/movies/dangal" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=x_7YlGv9u1g" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.netflix.com/title/80166185", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=x_7YlGv9u1g", type: "trailer" },
      { label: "Song: Haanikaarak Bapu", url: "https://www.youtube.com/watch?v=Kas6akz1jWU", type: "song" },
      { label: "Song: Dhaakad", url: "https://www.youtube.com/watch?v=Kas6akz1jWU", type: "song" },
      { label: "Song: Gilehriyaan", url: "https://www.youtube.com/watch?v=Kas6akz1jWU", type: "song" },
      { label: "Song: Naina", url: "https://www.youtube.com/watch?v=Kas6akz1jWU", type: "song" }
    ],
    metadata: {
      awards: ["Filmfare Awards: 4 wins"],
      basedOn: "True story of Mahavir Singh Phogat and his daughters",
      achievement: "Highest-grossing Indian film worldwide",
      theme: "Women's wrestling in India",
      musicDirector: "Pritam"
    }
  }
];

print('Inserting ' + sampleMovies.length + ' sample movies...');

// Insert the sample movies
const result = db.movies.insertMany(sampleMovies);

print('Successfully inserted ' + result.insertedIds.length + ' movies');
print('========================================');
print('Sample Data Insertion Completed!');
print('========================================');

// Display summary
print('\nDatabase Summary:');
print('Total movies in collection: ' + db.movies.countDocuments());
print('\nMovies by year:');
db.movies.aggregate([
  { $group: { _id: '$year', count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]).forEach(doc => {
  print('  ' + doc._id + ': ' + doc.count + ' movie(s)');
});

print('\nSample query - Movies with rating > 8.5:');
db.movies.find(
  { rating: { $gt: 8.5 } },
  { movieName: 1, year: 1, rating: 1, _id: 0 }
).forEach(doc => {
  print('  ' + doc.movieName + ' (' + doc.year + ') - Rating: ' + doc.rating);
});

print('\n========================================');
print('Initialization Complete!');
print('You can now query the movies collection');
print('========================================');

// Made with Bob
