import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"
const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [description, setDescription] = useState("");
  const [editBook, setEditBook] = useState(null);

  // Fetch books from backend
  useEffect(() => {
    axios
      .get("http://localhost:9000/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the books!", error);
      });
  }, []);

  // Add a new book
  const addBook = () => {
    axios
      .post("http://localhost:9000/books", {
        title,
        author,
        genre,
        publication_data: publicationDate,
        description,
      })
      .then((response) => {
        setBooks([...books, response.data]);
        setTitle("");
        setAuthor("");
        setGenre("");
        setPublicationDate("");
        setDescription("");
      })
      .catch((error) => {
        console.error("There was an error adding the book!", error);
      });
  };

  // Edit book details
  const editBookDetails = (book) => {
    setEditBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setPublicationDate(book.publication_data);
    setDescription(book.description);
  };

  // Update book
  const updateBook = () => {
    if (editBook) {
      axios
        .put(`http://localhost:9000/books/${editBook.id}`, {
          title,
          author,
          genre,
          publication_data: publicationDate,
          description,
        })
        .then((response) => {
          const updatedBooks = books.map((book) =>
            book.id === editBook.id ? response.data : book
          );
          setBooks(updatedBooks);
          setEditBook(null);
          setTitle("");
          setAuthor("");
          setGenre("");
          setPublicationDate("");
          setDescription("");
        })
        .catch((error) => {
          console.error("There was an error updating the book!", error);
        });
    }
  };

  // Soft delete book
  const deleteBook = (id) => {
    axios
      .delete(`http://localhost:9000/books/${id}`)
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the book!", error);
      });
  };

  return (
    <div>
      <h1>Book Management</h1>

      {/* Book Form */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <input
        type="date"
        placeholder="Publication Date"
        value={publicationDate}
        onChange={(e) => setPublicationDate(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={editBook ? updateBook : addBook}>
        {editBook ? "Update Book" : "Add Book"}
      </button>

      {/* Book List */}
      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.author} - {book.genre} -{" "}
            {book.publication_data}
            {book.description}{" "}
            <button onClick={() => editBookDetails(book)}>Edit</button>
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookManager;
