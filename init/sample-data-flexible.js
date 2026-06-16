// MongoDB Flexible Schema Sample Data Script
// This script inserts sample data for Movies, Books, and Music
// using the new flexible schema structure in contentdb database

print('========================================');
print('Inserting Sample Data for Flexible Schema');
print('========================================');

// Connect to contentdb database
const db = db.getSiblingDB('contentdb');

// ============================================
// 1. Insert Movies (content_001)
// ============================================
print('\n📽️  Inserting Movies into content_001...');

const sampleMovies = [
  {
    contentType: "001",
    contentSubtype: ["001", "002", "008"], // Action + Drama + Crime
    title: "The Dark Knight",
    year: 2008,
    creators: ["Christopher Nolan"],
    contributors: [
      { name: "Christian Bale", role: "actor" },
      { name: "Heath Ledger", role: "actor" },
      { name: "Aaron Eckhart", role: "actor" },
      { name: "Michael Caine", role: "actor" },
      { name: "Maggie Gyllenhaal", role: "actress" }
    ],
    language: "English",
    releaseDate: new Date("2008-07-18"),
    rating: 9.0,
    platforms: [
      { platform: "HBO Max", icon: "🎭", url: "https://www.hbomax.com/feature/urn:hbo:feature:GXdp5IQP5IcPCwwEAAAEm" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0PDLCBKDXQ8R5JLF8JVQZD0LKL" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=EXeTwQWrcwY" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.hbomax.com/feature/urn:hbo:feature:GXdp5IQP5IcPCwwEAAAEm", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=EXeTwQWrcwY", type: "trailer" },
      { label: "Teaser Trailer", url: "https://www.youtube.com/watch?v=yQ5U8suTUw0", type: "teaser" }
    ],
    details: {
      songs: [
        { title: "Why So Serious?", singer: "Hans Zimmer, James Newton Howard (Instrumental)", duration: "9:14" },
        { title: "Like a Dog Chasing Cars", singer: "Hans Zimmer, James Newton Howard (Instrumental)", duration: "4:53" }
      ],
      boxOffice: {
        budget: "$185 million",
        worldwide: "$1.005 billion"
      },
      runtime: "152 minutes"
    },
    metadata: {
      awards: ["Academy Awards: 2 wins including Best Supporting Actor (Heath Ledger)"],
      posthumous: "Heath Ledger's posthumous Oscar win",
      imax: "First major feature film partially shot in IMAX",
      legacy: "Redefined superhero genre"
    }
  },
  {
    contentType: "001",
    contentSubtype: ["001", "007", "005"], // Action + Sci-Fi + Thriller
    title: "Inception",
    year: 2010,
    creators: ["Christopher Nolan"],
    contributors: [
      { name: "Leonardo DiCaprio", role: "actor" },
      { name: "Tom Hardy", role: "actor" },
      { name: "Joseph Gordon-Levitt", role: "actor" },
      { name: "Cillian Murphy", role: "actor" },
      { name: "Marion Cotillard", role: "actress" },
      { name: "Ellen Page", role: "actress" }
    ],
    language: "English",
    releaseDate: new Date("2010-07-16"),
    rating: 8.8,
    platforms: [
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/70131314" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0PDLCBKDXQ8R5JLF8JVQZD0LKL" },
      { platform: "HBO Max", icon: "🎭", url: "https://www.hbomax.com/feature/urn:hbo:feature:GXdp5IQP5IcPCwwEAAAEm" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.netflix.com/title/70131314", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=YoHD9XEInc0", type: "trailer" },
      { label: "Teaser Trailer", url: "https://www.youtube.com/watch?v=66TuSJo4dZM", type: "teaser" }
    ],
    details: {
      songs: [
        { title: "Time", singer: "Hans Zimmer (Instrumental)", duration: "4:35" },
        { title: "Dream Is Collapsing", singer: "Hans Zimmer (Instrumental)", duration: "2:23" }
      ],
      boxOffice: {
        budget: "$160 million",
        worldwide: "$836.8 million"
      },
      runtime: "148 minutes"
    },
    metadata: {
      awards: ["Academy Awards: 4 wins from 8 nominations"],
      visualEffects: "Practical effects emphasized over CGI",
      concept: "Dreams within dreams",
      composer: "Hans Zimmer"
    }
  },
  {
    contentType: "001",
    contentSubtype: ["002", "008"], // Drama + Crime
    title: "The Shawshank Redemption",
    year: 1994,
    creators: ["Frank Darabont"],
    contributors: [
      { name: "Tim Robbins", role: "actor" },
      { name: "Morgan Freeman", role: "actor" },
      { name: "Bob Gunton", role: "actor" },
      { name: "William Sadler", role: "actor" },
      { name: "Clancy Brown", role: "actress" }
    ],
    language: "English",
    releaseDate: new Date("1994-09-23"),
    rating: 9.3,
    platforms: [
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/70047108" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0PDLCBKDXQ8R5JLF8JVQZD0LKL" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=6hB3S9bIaco" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.netflix.com/title/70047108", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=6hB3S9bIaco", type: "trailer" },
      { label: "Behind the Scenes", url: "https://www.youtube.com/watch?v=BuRuwR2JSXI", type: "teaser" }
    ],
    details: {
      songs: [
        { title: "If I Didn't Care", singer: "The Ink Spots", duration: "3:06" },
        { title: "Lovesick Blues", singer: "Hank Williams", duration: "2:43" }
      ],
      boxOffice: {
        budget: "$25 million",
        worldwide: "$73.3 million"
      },
      runtime: "142 minutes"
    },
    metadata: {
      awards: ["Academy Award nominations: 7"],
      basedOn: "Rita Hayworth and Shawshank Redemption by Stephen King",
      filmingLocation: "Ohio State Reformatory",
      trivia: "The movie was a box office disappointment but became hugely popular on home video"
    }
  },
  {
    contentType: "001",
    contentSubtype: ["004", "002"], // Romance + Drama
    title: "Dilwale Dulhania Le Jayenge",
    year: 1995,
    creators: ["Aditya Chopra"],
    contributors: [
      { name: "Shah Rukh Khan", role: "actor" },
      { name: "Amrish Puri", role: "actor" },
      { name: "Anupam Kher", role: "actor" },
      { name: "Farida Jalal", role: "actor" },
      { name: "Kajol", role: "actress" },
      { name: "Mandira Bedi", role: "actress" }
    ],
    language: "Hindi",
    releaseDate: new Date("1995-10-20"),
    rating: 8.1,
    platforms: [
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0GKQY6LQVZ8WJHXQVZ8W" },
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/17457962" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=gKVKPNJRCvQ" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.primevideo.com/detail/0GKQY6LQVZ8WJHXQVZ8W", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=gKVKPNJRCvQ", type: "trailer" },
      { label: "Song: Tujhe Dekha To", url: "https://www.youtube.com/watch?v=Jb3pN0vVZhA", type: "song" }
    ],
    details: {
      songs: [
        { title: "Tujhe Dekha To", singer: "Kumar Sanu, Lata Mangeshkar", duration: "5:32" },
        { title: "Mere Khwabon Mein", singer: "Lata Mangeshkar", duration: "5:18" },
        { title: "Ho Gaya Hai Tujhko", singer: "Lata Mangeshkar, Kumar Sanu", duration: "6:12" },
        { title: "Zara Sa Jhoom Loon Main", singer: "Abhijeet", duration: "4:48" }
      ],
      boxOffice: {
        budget: "₹4 crore",
        worldwide: "₹200+ crore"
      },
      runtime: "189 minutes"
    },
    metadata: {
      awards: ["Filmfare Awards: 10 wins"],
      runningTime: "Still running in Maratha Mandir, Mumbai",
      culturalImpact: "Longest-running film in Indian cinema history",
      musicDirector: "Jatin-Lalit"
    }
  },
  {
    contentType: "001",
    contentSubtype: ["003", "002"], // Comedy + Drama
    title: "3 Idiots",
    year: 2009,
    creators: ["Rajkumar Hirani"],
    contributors: [
      { name: "Aamir Khan", role: "actor" },
      { name: "R. Madhavan", role: "actor" },
      { name: "Sharman Joshi", role: "actor" },
      { name: "Boman Irani", role: "actor" },
      { name: "Kareena Kapoor", role: "actress" },
      { name: "Mona Singh", role: "actress" }
    ],
    language: "Hindi",
    releaseDate: new Date("2009-12-25"),
    rating: 8.4,
    platforms: [
      { platform: "Netflix", icon: "🎬", url: "https://www.netflix.com/title/70121522" },
      { platform: "Prime Video", icon: "📺", url: "https://www.primevideo.com/detail/0GKQY6LQVZ8WJHXQVZ8W" },
      { platform: "YouTube", icon: "▶️", url: "https://www.youtube.com/watch?v=K0eDlFX9GMc" }
    ],
    links: [
      { label: "Full Movie", url: "https://www.netflix.com/title/70121522", type: "movie" },
      { label: "Official Trailer", url: "https://www.youtube.com/watch?v=K0eDlFX9GMc", type: "trailer" },
      { label: "Song: All Izz Well", url: "https://www.youtube.com/watch?v=yJ_DVIRUSyc", type: "song" }
    ],
    details: {
      songs: [
        { title: "All Izz Well", singer: "Sonu Nigam, Shaan, Swanand Kirkire", duration: "5:03" },
        { title: "Zoobi Doobi", singer: "Sonu Nigam, Shreya Ghoshal", duration: "4:32" },
        { title: "Give Me Some Sunshine", singer: "Suraj Jagan", duration: "4:02" }
      ],
      boxOffice: {
        budget: "₹55 crore",
        worldwide: "₹460 crore"
      },
      runtime: "170 minutes"
    },
    metadata: {
      awards: ["Filmfare Awards: 6 wins"],
      basedOn: "Novel 'Five Point Someone' by Chetan Bhagat",
      theme: "Education system critique",
      musicDirector: "Shantanu Moitra",
      highestGrossing: "Highest-grossing Bollywood film at the time"
    }
  }
];

db.content_001.insertMany(sampleMovies);
print('✅ Inserted ' + sampleMovies.length + ' movies into content_001');

// ============================================
// 2. Insert Books (content_002)
// ============================================
print('\n📚 Inserting Books into content_002...');

const sampleBooks = [
  {
    contentType: "002",
    contentSubtype: ["001"], // Fiction
    title: "The Great Gatsby",
    year: 1925,
    creators: ["F. Scott Fitzgerald"],
    contributors: [
      { name: "Matthew J. Bruccoli", role: "editor" }
    ],
    language: "English",
    releaseDate: new Date("1925-04-10"),
    rating: 8.5,
    platforms: [
      { platform: "Amazon Kindle", icon: "📚", url: "https://www.amazon.com/Great-Gatsby-F-Scott-Fitzgerald-ebook/dp/B000FC0PDA" },
      { platform: "Audible", icon: "🎧", url: "https://www.audible.com/pd/The-Great-Gatsby-Audiobook/B002V5BKTS" },
      { platform: "Google Books", icon: "📖", url: "https://books.google.com/books?id=iXn5U2IzVH0C" }
    ],
    links: [
      { label: "Read Online", url: "https://www.gutenberg.org/ebooks/64317", type: "book" },
      { label: "Book Summary", url: "https://www.sparknotes.com/lit/gatsby/", type: "reference" }
    ],
    details: {
      pages: 180,
      publisher: "Charles Scribner's Sons",
      isbn: "978-0-7432-7356-5",
      format: ["Hardcover", "Paperback", "eBook", "Audiobook"],
      narrator: "Jake Gyllenhaal",
      chapters: 9
    },
    metadata: {
      awards: ["Modern Library's Top 100 Novels of the 20th Century"],
      themes: ["American Dream", "Wealth and Class", "Love and Obsession"],
      setting: "Long Island, New York, 1922",
      culturalImpact: "Considered the Great American Novel"
    }
  },
  {
    contentType: "002",
    contentSubtype: ["002"], // Non-Fiction
    title: "Sapiens: A Brief History of Humankind",
    year: 2011,
    creators: ["Yuval Noah Harari"],
    contributors: [
      { name: "John Purcell", role: "translator" },
      { name: "Haim Watzman", role: "translator" }
    ],
    language: "English",
    releaseDate: new Date("2011-09-04"),
    rating: 9.0,
    platforms: [
      { platform: "Amazon Kindle", icon: "📚", url: "https://www.amazon.com/Sapiens-Humankind-Yuval-Noah-Harari-ebook/dp/B00ICN066A" },
      { platform: "Audible", icon: "🎧", url: "https://www.audible.com/pd/Sapiens-Audiobook/B0741F3M7C" },
      { platform: "Apple Books", icon: "🍎", url: "https://books.apple.com/us/book/sapiens/id662316407" }
    ],
    links: [
      { label: "Author Website", url: "https://www.ynharari.com/book/sapiens/", type: "reference" },
      { label: "Book Discussion", url: "https://www.youtube.com/watch?v=nzj7Wg4DAbs", type: "video" }
    ],
    details: {
      pages: 443,
      publisher: "Harper",
      isbn: "978-0-06-231609-7",
      format: ["Hardcover", "Paperback", "eBook", "Audiobook"],
      narrator: "Derek Perkins",
      chapters: 20
    },
    metadata: {
      awards: ["National Bestseller", "New York Times Bestseller"],
      themes: ["Human Evolution", "Cognitive Revolution", "Agricultural Revolution"],
      translations: "Translated into 65+ languages",
      culturalImpact: "International phenomenon with over 23 million copies sold"
    }
  },
  {
    contentType: "002",
    contentSubtype: ["003"], // Biography
    title: "Steve Jobs",
    year: 2011,
    creators: ["Walter Isaacson"],
    contributors: [],
    language: "English",
    releaseDate: new Date("2011-10-24"),
    rating: 8.7,
    platforms: [
      { platform: "Amazon Kindle", icon: "📚", url: "https://www.amazon.com/Steve-Jobs-Walter-Isaacson-ebook/dp/B004W2UBYW" },
      { platform: "Audible", icon: "🎧", url: "https://www.audible.com/pd/Steve-Jobs-Audiobook/B005V0QI82" },
      { platform: "Apple Books", icon: "🍎", url: "https://books.apple.com/us/book/steve-jobs/id424638290" }
    ],
    links: [
      { label: "Book Preview", url: "https://www.simonandschuster.com/books/Steve-Jobs/Walter-Isaacson/9781451648539", type: "reference" },
      { label: "Author Interview", url: "https://www.youtube.com/watch?v=RdxrAKpx2JU", type: "video" }
    ],
    details: {
      pages: 656,
      publisher: "Simon & Schuster",
      isbn: "978-1-4516-4853-9",
      format: ["Hardcover", "Paperback", "eBook", "Audiobook"],
      narrator: "Dylan Baker",
      chapters: 42
    },
    metadata: {
      awards: ["New York Times Bestseller", "Financial Times Business Book of the Year"],
      themes: ["Innovation", "Leadership", "Technology"],
      basedOn: "Over 40 interviews with Steve Jobs",
      culturalImpact: "Definitive biography of Apple co-founder"
    }
  },
  {
    contentType: "002",
    contentSubtype: ["004"], // Mystery
    title: "The Da Vinci Code",
    year: 2003,
    creators: ["Dan Brown"],
    contributors: [],
    language: "English",
    releaseDate: new Date("2003-03-18"),
    rating: 7.8,
    platforms: [
      { platform: "Amazon Kindle", icon: "📚", url: "https://www.amazon.com/Da-Vinci-Code-Dan-Brown-ebook/dp/B000FBJFSM" },
      { platform: "Audible", icon: "🎧", url: "https://www.audible.com/pd/The-Da-Vinci-Code-Audiobook/B002V0QUOC" },
      { platform: "Google Books", icon: "📖", url: "https://books.google.com/books?id=EH4fngEACAAJ" }
    ],
    links: [
      { label: "Official Website", url: "https://danbrown.com/the-da-vinci-code/", type: "reference" },
      { label: "Movie Adaptation", url: "https://www.imdb.com/title/tt0382625/", type: "video" }
    ],
    details: {
      pages: 454,
      publisher: "Doubleday",
      isbn: "978-0-385-50420-1",
      format: ["Hardcover", "Paperback", "eBook", "Audiobook"],
      narrator: "Paul Michael",
      chapters: 105
    },
    metadata: {
      awards: ["British Book Awards Book of the Year"],
      themes: ["Religious Conspiracy", "Art History", "Cryptography"],
      controversy: "Sparked religious and historical debates",
      culturalImpact: "Over 80 million copies sold worldwide"
    }
  },
  {
    contentType: "002",
    contentSubtype: ["005"], // Fantasy
    title: "Harry Potter and the Philosopher's Stone",
    year: 1997,
    creators: ["J.K. Rowling"],
    contributors: [
      { name: "Thomas Taylor", role: "illustrator" }
    ],
    language: "English",
    releaseDate: new Date("1997-06-26"),
    rating: 9.2,
    platforms: [
      { platform: "Amazon Kindle", icon: "📚", url: "https://www.amazon.com/Harry-Potter-Philosophers-Stone-Rowling-ebook/dp/B0192CTMYG" },
      { platform: "Audible", icon: "🎧", url: "https://www.audible.com/pd/Harry-Potter-and-the-Philosophers-Stone-Audiobook/B017V4IMVQ" },
      { platform: "Pottermore", icon: "⚡", url: "https://www.wizardingworld.com/" }
    ],
    links: [
      { label: "Official Website", url: "https://www.wizardingworld.com/", type: "reference" },
      { label: "Movie Series", url: "https://www.warnerbros.com/movies/harry-potter-complete-8-film-collection", type: "video" }
    ],
    details: {
      pages: 223,
      publisher: "Bloomsbury Publishing",
      isbn: "978-0-7475-3269-9",
      format: ["Hardcover", "Paperback", "eBook", "Audiobook"],
      narrator: "Stephen Fry",
      chapters: 17
    },
    metadata: {
      awards: ["British Book Award", "Children's Book of the Year"],
      themes: ["Friendship", "Good vs Evil", "Coming of Age"],
      series: "First book in the Harry Potter series",
      culturalImpact: "Launched one of the most successful book series in history"
    }
  }
];

db.content_002.insertMany(sampleBooks);
print('✅ Inserted ' + sampleBooks.length + ' books into content_002');

// ============================================
// 3. Insert Music (content_003)
// ============================================
print('\n🎵 Inserting Music into content_003...');

const sampleMusic = [
  {
    contentType: "003",
    contentSubtype: ["001"], // Pop
    title: "Thriller",
    year: 1982,
    creators: ["Michael Jackson"],
    contributors: [
      { name: "Quincy Jones", role: "producer" },
      { name: "Bruce Swedien", role: "engineer" }
    ],
    language: "English",
    releaseDate: new Date("1982-11-30"),
    rating: 9.5,
    platforms: [
      { platform: "Spotify", icon: "🎵", url: "https://open.spotify.com/album/2ANVost0y2y52ema1E9xAZ" },
      { platform: "Apple Music", icon: "🍎", url: "https://music.apple.com/us/album/thriller/269572838" },
      { platform: "YouTube Music", icon: "▶️", url: "https://music.youtube.com/playlist?list=OLAK5uy_kHt0TRNLJGvGLqh-elMsKXC9fQbEKvGWg" },
      { platform: "Amazon Music", icon: "🎧", url: "https://music.amazon.com/albums/B00138F3N8" }
    ],
    links: [
      { label: "Official Video - Thriller", url: "https://www.youtube.com/watch?v=sOnqjkJTMaA", type: "video" },
      { label: "Official Video - Billie Jean", url: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y", type: "video" },
      { label: "Official Video - Beat It", url: "https://www.youtube.com/watch?v=oRdxUFDoQe0", type: "video" }
    ],
    details: {
      albumType: "Studio Album",
      tracks: [
        { number: 1, title: "Wanna Be Startin' Somethin'", duration: "6:03" },
        { number: 2, title: "Baby Be Mine", duration: "4:20" },
        { number: 3, title: "The Girl Is Mine", duration: "3:42" },
        { number: 4, title: "Thriller", duration: "5:57" },
        { number: 5, title: "Beat It", duration: "4:18" },
        { number: 6, title: "Billie Jean", duration: "4:54" },
        { number: 7, title: "Human Nature", duration: "4:06" },
        { number: 8, title: "P.Y.T. (Pretty Young Thing)", duration: "3:59" },
        { number: 9, title: "The Lady in My Life", duration: "5:00" }
      ],
      totalDuration: "42:19",
      label: "Epic Records",
      genres: ["Pop", "R&B", "Funk", "Rock"],
      singles: ["The Girl Is Mine", "Billie Jean", "Beat It", "Wanna Be Startin' Somethin'", "Human Nature", "P.Y.T.", "Thriller"]
    },
    metadata: {
      awards: ["Grammy Awards: 8 wins (record at the time)", "American Music Awards: 8 wins"],
      certifications: "33× Platinum (RIAA)",
      culturalImpact: "Best-selling album of all time with estimated 70 million copies sold",
      legacy: "Revolutionized music videos and pop music"
    }
  },
  {
    contentType: "003",
    contentSubtype: ["002"], // Rock
    title: "The Dark Side of the Moon",
    year: 1973,
    creators: ["Pink Floyd"],
    contributors: [
      { name: "Alan Parsons", role: "engineer" },
      { name: "Chris Thomas", role: "producer" }
    ],
    language: "English",
    releaseDate: new Date("1973-03-01"),
    rating: 9.3,
    platforms: [
      { platform: "Spotify", icon: "🎵", url: "https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv" },
      { platform: "Apple Music", icon: "🍎", url: "https://music.apple.com/us/album/the-dark-side-of-the-moon/1065973699" },
      { platform: "YouTube Music", icon: "▶️", url: "https://music.youtube.com/playlist?list=OLAK5uy_l1x-JAx0w53suECoCI0YJtW6VB8DBQWRQ" },
      { platform: "Tidal", icon: "🌊", url: "https://tidal.com/browse/album/1251833" }
    ],
    links: [
      { label: "Full Album", url: "https://www.youtube.com/watch?v=HW-lXjOyUWo", type: "video" },
      { label: "Documentary", url: "https://www.youtube.com/watch?v=aSqqwHp5UXg", type: "video" }
    ],
    details: {
      albumType: "Studio Album",
      tracks: [
        { number: 1, title: "Speak to Me", duration: "1:30" },
        { number: 2, title: "Breathe (In the Air)", duration: "2:43" },
        { number: 3, title: "On the Run", duration: "3:36" },
        { number: 4, title: "Time", duration: "6:53" },
        { number: 5, title: "The Great Gig in the Sky", duration: "4:36" },
        { number: 6, title: "Money", duration: "6:23" },
        { number: 7, title: "Us and Them", duration: "7:49" },
        { number: 8, title: "Any Colour You Like", duration: "3:26" },
        { number: 9, title: "Brain Damage", duration: "3:49" },
        { number: 10, title: "Eclipse", duration: "2:03" }
      ],
      totalDuration: "42:48",
      label: "Harvest Records",
      genres: ["Progressive Rock", "Psychedelic Rock", "Art Rock"],
      singles: ["Money", "Us and Them", "Time"]
    },
    metadata: {
      awards: ["Grammy Hall of Fame", "National Recording Registry"],
      certifications: "15× Platinum (RIAA)",
      culturalImpact: "One of the best-selling albums of all time with over 45 million copies sold",
      legacy: "Spent 937 weeks on the Billboard 200 chart"
    }
  },
  {
    contentType: "003",
    contentSubtype: ["005"], // Hip-Hop
    title: "The Miseducation of Lauryn Hill",
    year: 1998,
    creators: ["Lauryn Hill"],
    contributors: [
      { name: "Lauryn Hill", role: "producer" },
      { name: "Che Pope", role: "producer" },
      { name: "Vada Nobles", role: "producer" }
    ],
    language: "English",
    releaseDate: new Date("1998-08-25"),
    rating: 9.1,
    platforms: [
      { platform: "Spotify", icon: "🎵", url: "https://open.spotify.com/album/1BZoqf8Zje5nGdwZhOjAtD" },
      { platform: "Apple Music", icon: "🍎", url: "https://music.apple.com/us/album/the-miseducation-of-lauryn-hill/1422057022" },
      { platform: "YouTube Music", icon: "▶️", url: "https://music.youtube.com/playlist?list=OLAK5uy_mfF0h7vqKZXqKqKqKqKqKqKqKqKqKqKqK" },
      { platform: "Tidal", icon: "🌊", url: "https://tidal.com/browse/album/1251834" }
    ],
    links: [
      { label: "Official Video - Doo Wop", url: "https://www.youtube.com/watch?v=T6QKqFPRZSA", type: "video" },
      { label: "Official Video - Ex-Factor", url: "https://www.youtube.com/watch?v=cE-bnWqLqxE", type: "video" }
    ],
    details: {
      albumType: "Studio Album",
      tracks: [
        { number: 1, title: "Intro", duration: "0:47" },
        { number: 2, title: "Lost Ones", duration: "5:33" },
        { number: 3, title: "Ex-Factor", duration: "5:26" },
        { number: 4, title: "To Zion", duration: "6:09" },
        { number: 5, title: "Doo Wop (That Thing)", duration: "5:20" },
        { number: 6, title: "Superstar", duration: "4:56" },
        { number: 7, title: "Final Hour", duration: "3:50" },
        { number: 8, title: "When It Hurts So Bad", duration: "5:39" },
        { number: 9, title: "I Used to Love Him", duration: "4:34" },
        { number: 10, title: "Forgive Them Father", duration: "5:16" }
      ],
      totalDuration: "77:32",
      label: "Ruffhouse Records, Columbia Records",
      genres: ["Hip-Hop", "R&B", "Neo Soul"],
      singles: ["Doo Wop (That Thing)", "Ex-Factor", "Everything Is Everything", "To Zion"]
    },
    metadata: {
      awards: ["Grammy Awards: 5 wins including Album of the Year", "First hip-hop album to win Album of the Year"],
      certifications: "8× Platinum (RIAA)",
      culturalImpact: "Groundbreaking album blending hip-hop, R&B, and soul",
      legacy: "Considered one of the greatest albums of all time"
    }
  },
  {
    contentType: "003",
    contentSubtype: ["004"], // Jazz
    title: "Kind of Blue",
    year: 1959,
    creators: ["Miles Davis"],
    contributors: [
      { name: "John Coltrane", role: "saxophonist" },
      { name: "Cannonball Adderley", role: "saxophonist" },
      { name: "Bill Evans", role: "pianist" },
      { name: "Wynton Kelly", role: "pianist" },
      { name: "Paul Chambers", role: "bassist" },
      { name: "Jimmy Cobb", role: "drummer" }
    ],
    language: "Instrumental",
    releaseDate: new Date("1959-08-17"),
    rating: 9.4,
    platforms: [
      { platform: "Spotify", icon: "🎵", url: "https://open.spotify.com/album/1weenld61qoidwYuZ1GESA" },
      { platform: "Apple Music", icon: "🍎", url: "https://music.apple.com/us/album/kind-of-blue/268443092" },
      { platform: "YouTube Music", icon: "▶️", url: "https://music.youtube.com/playlist?list=OLAK5uy_kKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq" },
      { platform: "Tidal", icon: "🌊", url: "https://tidal.com/browse/album/1251835" }
    ],
    links: [
      { label: "Full Album", url: "https://www.youtube.com/watch?v=kbxtYqA6ypM", type: "video" },
      { label: "Documentary", url: "https://www.youtube.com/watch?v=ylXk1LBvIqU", type: "video" }
    ],
    details: {
      albumType: "Studio Album",
      tracks: [
        { number: 1, title: "So What", duration: "9:22" },
        { number: 2, title: "Freddie Freeloader", duration: "9:46" },
        { number: 3, title: "Blue in Green", duration: "5:37" },
        { number: 4, title: "All Blues", duration: "11:33" },
        { number: 5, title: "Flamenco Sketches", duration: "9:26" }
      ],
      totalDuration: "45:44",
      label: "Columbia Records",
      genres: ["Jazz", "Modal Jazz", "Cool Jazz"],
      singles: []
    },
    metadata: {
      awards: ["Grammy Hall of Fame", "National Recording Registry", "Library of Congress"],
      certifications: "5× Platinum (RIAA)",
      culturalImpact: "Best-selling jazz album of all time",
      legacy: "Revolutionized jazz with modal improvisation"
    }
  },
  {
    contentType: "003",
    contentSubtype: ["003"], // Classical
    title: "The Four Seasons",
    year: 1725,
    creators: ["Antonio Vivaldi"],
    contributors: [
      { name: "Various Orchestras", role: "performer" }
    ],
    language: "Instrumental",
    releaseDate: new Date("1725-01-01"),
    rating: 9.6,
    platforms: [
      { platform: "Spotify", icon: "🎵", url: "https://open.spotify.com/album/3Ktg3PxQKJwJXnGHJKbHjO" },
      { platform: "Apple Music", icon: "🍎", url: "https://music.apple.com/us/album/vivaldi-the-four-seasons/1440806677" },
      { platform: "YouTube Music", icon: "▶️", url: "https://music.youtube.com/playlist?list=OLAK5uy_kKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq" },
      { platform: "Classical Archives", icon: "🎻", url: "https://www.classicalarchives.com/work/3878.html" }
    ],
    links: [
      { label: "Full Performance", url: "https://www.youtube.com/watch?v=GRxofEmo3HA", type: "video" },
      { label: "Analysis", url: "https://www.youtube.com/watch?v=6z82w0l6kwE", type: "video" }
    ],
    details: {
      albumType: "Concerto",
      tracks: [
        { number: 1, title: "Spring - Allegro", duration: "3:33" },
        { number: 2, title: "Spring - Largo", duration: "2:34" },
        { number: 3, title: "Spring - Allegro", duration: "4:07" },
        { number: 4, title: "Summer - Allegro non molto", duration: "5:12" },
        { number: 5, title: "Summer - Adagio", duration: "2:18" },
        { number: 6, title: "Summer - Presto", duration: "2:40" },
        { number: 7, title: "Autumn - Allegro", duration: "5:00" },
        { number: 8, title: "Autumn - Adagio molto", duration: "2:36" },
        { number: 9, title: "Autumn - Allegro", duration: "3:20" },
        { number: 10, title: "Winter - Allegro non molto", duration: "3:24" },
        { number: 11, title: "Winter - Largo", duration: "2:07" },
        { number: 12, title: "Winter - Allegro", duration: "3:17" }
      ],
      totalDuration: "40:08",
      label: "Various Labels",
      genres: ["Classical", "Baroque", "Concerto"],
      singles: []
    },
    metadata: {
      awards: ["One of the most popular classical compositions"],
      certifications: "Public Domain",
      culturalImpact: "Most performed and recorded classical work",
      legacy: "Epitome of Baroque program music"
    }
  }
];

db.content_003.insertMany(sampleMusic);
print('✅ Inserted ' + sampleMusic.length + ' music albums into content_003');

// ============================================
// Summary
// ============================================
print('\n========================================');
print('✅ Sample data inserted successfully for all content types!');
print('========================================');
print('');
print('📊 Summary:');
print('  Movies (content_001): ' + db.content_001.countDocuments() + ' documents');
print('  Books (content_002): ' + db.content_002.countDocuments() + ' documents');
print('  Music (content_003): ' + db.content_003.countDocuments() + ' documents');
print('  Total: ' + (db.content_001.countDocuments() + db.content_002.countDocuments() + db.content_003.countDocuments()) + ' documents');
print('');
print('🎯 Content Type Distribution:');
print('  001 (Movies): ' + db.content_001.countDocuments());
print('  002 (Books): ' + db.content_002.countDocuments());
print('  003 (Music): ' + db.content_003.countDocuments());
print('');
print('📈 Sample Queries:');
print('  - High-rated movies: db.content_001.find({rating: {$gte: 9.0}})');
print('  - Fiction books: db.content_002.find({contentSubtype: "001"})');
print('  - Pop music: db.content_003.find({contentSubtype: "001"})');
print('  - Content by year: db.content_001.find({year: {$gte: 2000}})');
print('');
print('========================================');
print('Flexible Schema Sample Data Complete!');
print('========================================');

// Made with Bob