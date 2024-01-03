export default function interleaveResults(movies: any[], shows: any[]): any[] {
  const interleaved = [];
  const maxLength = Math.max(movies.length, shows.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < movies.length) {
      interleaved.push({
        id: movies[i].id,
        title: movies[i].title,
        image: `https://image.tmdb.org/t/p/original${
          movies[i]?.backdrop_path || movies[i]?.poster_path
        }`,
        isAShow: false,
      });
    }

    if (i < shows.length) {
      interleaved.push({
        id: shows[i].id,
        title: shows[i].name,
        image: `https://image.tmdb.org/t/p/original${
          shows[i]?.backdrop_path || shows[i]?.poster_path
        }`,
        isAShow: true,
      });
    }
  }
  return interleaved;
}
