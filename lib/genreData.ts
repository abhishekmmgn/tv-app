import { requests } from "./requests";

const genreData = [
  { genre: "action", id: 28, url: requests.fetchActionMovies },
  { genre: "comedy", id: 35, url: requests.fetchComedyMovies },
  { genre: "horror", id: 27, url: requests.fetchHorrorMovies },
  { genre: "romance", id: 10749, url: requests.fetchRomanceMovies },
  { genre: "documentaries", id: 99, url: requests.fetchDocumentaries },
  { genre: "drama", id: 18, url: requests.fetchDrama },
  { genre: "kids-and-family", id: 10751, url: requests.fetchFamily },
  { genre: "thriller", id: 53, url: requests.fetchThriller },
  { genre: "adventure", id: 12, url: requests.fetchAdventure },
  { genre: "animation", id: 16, url: requests.fetchAnimation },
  { genre: "non-fiction", id: 16, url: requests.fetchNonFiction },
];

export default genreData;
