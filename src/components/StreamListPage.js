import { useState, useEffect } from "react"
import "./StreamListPage.css"

const STORAGE_KEY = "streamlist-items"

function StreamListPage() {
  const [newItem, setNewItem] = useState("")
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState("")

  // Load items from localStorage once when the component mounts
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY)
      if (savedItems) {
        const parsed = JSON.parse(savedItems)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch (error) {
      console.error("Error reading StreamList items from localStorage:", error)
    }
  }, [])

  // helper to update state + localStorage together
  const updateItems = (updater) => {
    setItems((previousItems) => {
      const updated =
        typeof updater === "function" ? updater(previousItems) : updater
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error("Error saving StreamList items to localStorage:", error)
      }
      return updated
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = newItem.trim()
    if (!trimmed) return

    console.log("New StreamList item:", trimmed)

    updateItems((previousItems) => [
      ...previousItems,
      {
        id: Date.now(),
        title: trimmed,
        completed: false,
      },
    ])

    setNewItem("")
  }

  const handleRemove = (id) => {
    const removedItem = items.find((item) => item.id === id)
    console.log("Removed item:", removedItem?.title)

    updateItems((previousItems) => previousItems.filter((item) => item.id !== id))

    if (editingId === id) {
      setEditingId(null)
      setEditingText("")
    }
  }

  const handleToggleComplete = (id) => {
    updateItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )

    const updatedItem = items.find((item) => item.id === id)
    if (updatedItem) {
      console.log(
        updatedItem.completed ? "Marked incomplete:" : "Marked complete:",
        updatedItem.title
      )
    }
  }

  const handleStartEdit = (id) => {
    const itemToEdit = items.find((item) => item.id === id)
    if (!itemToEdit) return
    setEditingId(id)
    setEditingText(itemToEdit.title)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingText("")
  }

  const handleSaveEdit = (event) => {
    event.preventDefault()
    const trimmed = editingText.trim()
    if (!trimmed) return

    updateItems((previousItems) =>
      previousItems.map((item) =>
        item.id === editingId ? { ...item, title: trimmed } : item
      )
    )

    console.log("Edited item:", trimmed)

    setEditingId(null)
    setEditingText("")
  }

  const handleClearAll = () => {
    if (items.length === 0) return
    console.log("Cleared all items")

    updateItems([])

    setEditingId(null)
    setEditingText("")
  }

  const totalItems = items.length
  const completedItems = items.filter((item) => item.completed).length
  const remainingItems = totalItems - completedItems

  return (
    <section className="page-card">
      <header className="streamlist-header">
        <div className="header-title-group">
          <span className="material-symbols-outlined header-icon">
            playlist_add_check
          </span>
          <div>
            <h2 className="page-title">My StreamList</h2>
            <p className="page-description">
              Add, complete, and edit the movies or shows you want to watch.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="clear-all-button"
          onClick={handleClearAll}
          disabled={items.length === 0}
        >
          <span className="material-symbols-outlined">delete_sweep</span>
          <span className="clear-all-label">Clear all</span>
        </button>
      </header>

      <form className="streamlist-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="streamlist-input"
          placeholder="Type a movie or show title, then press Enter..."
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
        />
        <button type="submit" className="streamlist-button">
          <span className="material-symbols-outlined">add</span>
        </button>
      </form>

      <div className="stats-row">
        <span>Total items: {totalItems}</span>
        <span>Completed: {completedItems}</span>
        <span>Remaining: {remainingItems}</span>
      </div>

      <ul className="streamlist-items">
        {items.map((item) => (
          <li key={item.id} className="streamlist-item-row">
            {editingId === item.id ? (
              <form className="edit-form" onSubmit={handleSaveEdit}>
                <input
                  type="text"
                  className="edit-input"
                  value={editingText}
                  onChange={(event) => setEditingText(event.target.value)}
                  autoFocus
                />
                <button type="submit" className="icon-button save-button">
                  <span className="material-symbols-outlined">check</span>
                </button>
                <button
                  type="button"
                  className="icon-button cancel-button"
                  onClick={handleCancelEdit}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </form>
            ) : (
              <>
                <button
                  type="button"
                  className="icon-button complete-toggle-button"
                  onClick={() => handleToggleComplete(item.id)}
                >
                  <span className="material-symbols-outlined">
                    {item.completed ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </button>

                <span
                  className={
                    item.completed
                      ? "streamlist-item-title completed"
                      : "streamlist-item-title"
                  }
                >
                  {item.title}
                </span>

                <div className="item-actions">
                  <button
                    type="button"
                    className="icon-button edit-button"
                    onClick={() => handleStartEdit(item.id)}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>

                  <button
                    type="button"
                    className="icon-button remove-button"
                    onClick={() => handleRemove(item.id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </>
            )}
          </li>
        ))}

        {items.length === 0 && (
          <li className="streamlist-empty">
            Your StreamList is empty. Add a title above to get started.
          </li>
        )}
      </ul>

      <p className="page-note">
        Your StreamList items are saved in your browser using localStorage, so
        they stay available even after you refresh the page or navigate between
        routes.
      </p>
    </section>
  )
}

export default StreamListPage


