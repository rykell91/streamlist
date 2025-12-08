import { NavLink } from "react-router-dom"
import "./NavBar.css"

function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo-circle">EZ</div>
        <div className="navbar-title-group">
          <h1 className="navbar-title neon-title">StreamList</h1>
          <p className="navbar-subtitle neon-subtitle">
            Cloud based streaming lists for EZTechMovie
          </p>
        </div>
      </div>

      <nav className="navbar-menu">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link nav-link-active" : "nav-link"
          }
          end
        >
          StreamList
        </NavLink>

        <NavLink
          to="/movies"
          className={({ isActive }) =>
            isActive ? "nav-link nav-link-active" : "nav-link"
          }
        >
          Movies
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "nav-link nav-link-active" : "nav-link"
          }
        >
          Cart
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link nav-link-active" : "nav-link"
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  )
}

export default NavBar
