import { useState } from "react"
import "./StreamListPage.css"

function StreamListPage() {
  const [newItem, setNewItem] = useState("")
  const [items, setItems] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = newItem.trim()
    if (!trimmed) return

    console.log("New StreamList item:", trimmed)

    setItems((previousItems) => [
      ...previousItems,
      { id: Date.now(), title: trimmed },
    ])

    setNewItem("")
  }

  const handleRemove = (id) => {
    setItems((previousItems) => previousItems.filter((item) => item.id !== id))
  }

  return (
    <section className="page-card">
      <h2 className="page-title">My StreamList</h2>
      <p className="page-description">
        Add movies or shows you want to watch later, like a streaming to do list.
      </p>

      <form className="streamlist-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="streamlist-input"
          placeholder="Type a movie or show title, then press Enter..."
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
        />
        <button type="submit" className="streamlist-button">
          Add
        </button>
      </form>

      <ul className="streamlist-items">
        {items.map((item) => (
          <li key={item.id} className="streamlist-item-row">
            <span className="streamlist-item-title">{item.title}</span>
            <button
              type="button"
              className="streamlist-remove-button"
              onClick={() => handleRemove(item.id)}
            >
              Remove
            </button>
          </li>
        ))}

        {items.length === 0 && (
          <li className="streamlist-empty">
            Your StreamList is empty, add a title above to get started.
          </li>
        )}
      </ul>

      <p className="page-note">
        For Week 1, every time you add a title, it is also printed in the browser console.
      </p>
    </section>
  )
}

export default StreamListPage
