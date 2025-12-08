import { useEffect, useState } from "react"
import "./MoviesPage.css"
import "./StreamListPage.css" // reuse the .page-card styling

const TMDB_API_BASE = "https://api.themoviedb.org/3"
const STORAGE_QUERY_KEY = "streamlist-movies-query"
const STORAGE_RESULTS_KEY = "streamlist-movies-results"

function MoviesPage() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState([])
  const [status, setStatus] = useState("idle") // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("")

  // Load last search and results from localStorage when the page first mounts
  useEffect(() => {
    try {
      const savedQuery = localStorage.getItem(STORAGE_QUERY_KEY)
      const savedResults = localStorage.getItem(STORAGE_RESULTS_KEY)

      if (savedQuery) {
        setQuery(savedQuery)
      }

      if (savedResults) {
        const parsed = JSON.parse(savedResults)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMovies(parsed)
          setStatus("success")
        }
      }
    } catch (error) {
      console.error("Error reading movies from localStorage:", error)
    }
  }, [])

  const handleSearchSubmit = async (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      return
    }

    setStatus("loading")
    setErrorMessage("")

    const apiKey = process.env.REACT_APP_TMDB_API_KEY

    if (!apiKey) {
      setStatus("error")
      setErrorMessage(
        "TMDB API key is missing. Please set REACT_APP_TMDB_API_KEY in your .env file."
      )
      return
    }

    try {
      const url = `${TMDB_API_BASE}/search/movie?api_key=${apiKey}&language=en-US&include_adult=false&query=${encodeURIComponent(
        trimmed
      )}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`TMDB request failed with status ${response.status}`)
      }

      const data = await response.json()
      const results = Array.isArray(data.results) ? data.results : []

      setMovies(results)
      setStatus("success")

      // Save the search query and results for persistence
      localStorage.setItem(STORAGE_QUERY_KEY, trimmed)
      localStorage.setItem(STORAGE_RESULTS_KEY, JSON.stringify(results))
    } catch (error) {
      console.error("Error fetching from TMDB:", error)
      setStatus("error")
      setErrorMessage("Unable to load movies right now. Please try again later.")
    }
  }

  const handleClearHistory = () => {
    // Reset state
    setQuery("")
    setMovies([])
    setStatus("idle")
    setErrorMessage("")

    // Clear from localStorage
    try {
      localStorage.removeItem(STORAGE_QUERY_KEY)
      localStorage.removeItem(STORAGE_RESULTS_KEY)
    } catch (error) {
      console.error("Error clearing movies from localStorage:", error)
    }
  }

  return (
    <section className="page-card movies-page">
      <header className="movies-header">
        <div className="movies-title-group">
          <span className="material-symbols-outlined movies-header-icon">
            local_movies
          </span>
          <div>
            <h2 className="movies-title">Movie Search</h2>
            <p className="movies-subtitle">
              Search TMDB for movies and quickly review basic information.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="movies-clear-button"
          onClick={handleClearHistory}
          disabled={status === "idle" && movies.length === 0 && !query}
        >
          <span className="material-symbols-outlined">delete_sweep</span>
          <span className="movies-clear-label">Clear search</span>
        </button>
      </header>

      <form className="movies-search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="movies-search-input"
          placeholder="Type a movie title, for example, Spider Man, then press Enter..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit" className="movies-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </form>

      <div className="movies-status-row">
        {status === "idle" && (
          <span>Start by searching for a movie title above.</span>
        )}
        {status === "loading" && <span>Searching TMDB, please wait…</span>}
        {status === "success" && movies.length === 0 && (
          <span>No results found for that title. Try another search.</span>
        )}
        {status === "success" && movies.length > 0 && (
          <span>
            Showing {movies.length} result
            {movies.length === 1 ? "" : "s"} from TMDB.
          </span>
        )}
        {status === "error" && (
          <span className="movies-error-text">{errorMessage}</span>
        )}
      </div>

      <div className="movies-grid">
        {movies.map((movie) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
            : null

          const year = movie.release_date
            ? movie.release_date.slice(0, 4)
            : "N/A"

          return (
            <article key={movie.id} className="movie-card">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="movie-poster"
                />
              ) : (
                <div className="movie-poster placeholder-poster">
                  <span className="material-symbols-outlined">
                    image_not_supported
                  </span>
                </div>
              )}

              <div className="movie-info">
                <h3 className="movie-title">
                  {movie.title} <span className="movie-year">{year}</span>
                </h3>

                <div className="movie-meta-row">
                  <span className="movie-rating">
                    <span className="material-symbols-outlined rating-icon">
                      star
                    </span>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </span>
                  {movie.vote_count ? (
                    <span className="movie-votes">
                      {movie.vote_count} votes
                    </span>
                  ) : null}
                </div>

                {movie.overview && (
                  <p className="movie-overview">
                    {movie.overview.length > 180
                      ? movie.overview.slice(0, 180) + "..."
                      : movie.overview}
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default MoviesPage
