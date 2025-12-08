import { Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import StreamListPage from "./components/StreamListPage"
import MoviesPage from "./components/MoviesPage"
import CartPage from "./components/CartPage"
import AboutPage from "./components/AboutPage"
import "./App.css"

function App() {
  return (
    <div className="app-root">
      <NavBar />

      <main className="page-container">
        <Routes>
          <Route path="/" element={<StreamListPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

