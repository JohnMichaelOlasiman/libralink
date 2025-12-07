"use server"

import { sql, type Book, type BookWithDetails, type Category } from "@/lib/db"
import { requireRole } from "@/lib/auth"

export async function getBooks(search?: string, category?: string): Promise<BookWithDetails[]> {
  const result = await sql`
    SELECT b.*, 
      c.name as category_name
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.status != 'maintenance'
    ORDER BY b.created_at DESC
  `

  let books = result as any[]

  // Map to BookWithDetails format
  books = books.map((book) => ({
    ...book,
    authors: book.author_name ? [{ id: "1", name: book.author_name }] : [],
    categories: book.category_name ? [{ id: book.category_id, name: book.category_name }] : [],
    publisher: book.publisher_name ? { id: "1", name: book.publisher_name } : null,
  }))

  if (search) {
    const searchLower = search.toLowerCase()
    books = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchLower) || (book.author_name || "").toLowerCase().includes(searchLower),
    )
  }

  if (category) {
    const categoryLower = category.toLowerCase()
    books = books.filter((book) => (book.category_name || "").toLowerCase().includes(categoryLower))
  }

  return books as BookWithDetails[]
}

export async function getBookById(id: string): Promise<BookWithDetails | null> {
  const result = await sql`
    SELECT b.*, c.name as category_name
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.id = ${id} AND b.status != 'maintenance'
  `

  if (result.length === 0) return null

  const book = result[0] as any
  return {
    ...book,
    authors: book.author_name ? [{ id: "1", name: book.author_name }] : [],
    categories: book.category_name ? [{ id: book.category_id, name: book.category_name }] : [],
    publisher: book.publisher_name ? { id: "1", name: book.publisher_name } : null,
  } as BookWithDetails
}

export async function getPopularBooks(limit = 6): Promise<BookWithDetails[]> {
  const result = await sql`
    SELECT b.*, c.name as category_name
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.status != 'maintenance'
    ORDER BY b.rating DESC, b.rating_count DESC
    LIMIT ${limit}
  `

  return (result as any[]).map((book) => ({
    ...book,
    authors: book.author_name ? [{ id: "1", name: book.author_name }] : [],
    categories: book.category_name ? [{ id: book.category_id, name: book.category_name }] : [],
    publisher: book.publisher_name ? { id: "1", name: book.publisher_name } : null,
  })) as BookWithDetails[]
}

export async function getFeaturedBook(): Promise<BookWithDetails | null> {
  const result = await sql`
    SELECT b.*, c.name as category_name
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.status != 'maintenance'
    ORDER BY b.rating DESC
    LIMIT 1
  `

  if (result.length === 0) return null

  const book = result[0] as any
  return {
    ...book,
    authors: book.author_name ? [{ id: "1", name: book.author_name }] : [],
    categories: book.category_name ? [{ id: book.category_id, name: book.category_name }] : [],
    publisher: book.publisher_name ? { id: "1", name: book.publisher_name } : null,
  } as BookWithDetails
}

export async function createBook(data: {
  title: string
  isbn?: string
  description?: string
  cover_url?: string
  author_name?: string
  publisher_name?: string
  category_id?: string
  publication_year?: number
  total_copies: number
}): Promise<{ book: Book | null; error: string | null }> {
  try {
    await requireRole(["librarian", "admin"])

    const result = await sql`
      INSERT INTO books (
        title, isbn, description, cover_url, author_name, publisher_name, 
        category_id, publication_year, total_copies, available_copies
      )
      VALUES (
        ${data.title}, 
        ${data.isbn || null}, 
        ${data.description || null}, 
        ${data.cover_url || null}, 
        ${data.author_name || "Unknown Author"},
        ${data.publisher_name || ""},
        ${data.category_id || null}, 
        ${data.publication_year || null}, 
        ${data.total_copies}, 
        ${data.total_copies}
      )
      RETURNING *
    `

    return { book: result[0] as Book, error: null }
  } catch (error) {
    console.error("Create book error:", error)
    return { book: null, error: "Failed to create book" }
  }
}

export async function updateBook(
  id: string,
  data: {
    title?: string
    isbn?: string
    description?: string
    cover_url?: string
    author_name?: string
    publisher_name?: string
    category_id?: string
    publication_year?: number
    total_copies?: number
    available_copies?: number
    status?: string
  },
): Promise<{ book: Book | null; error: string | null }> {
  try {
    await requireRole(["librarian", "admin"])

    // Update each field individually
    if (data.title !== undefined) {
      await sql`UPDATE books SET title = ${data.title} WHERE id = ${id}`
    }
    if (data.isbn !== undefined) {
      await sql`UPDATE books SET isbn = ${data.isbn} WHERE id = ${id}`
    }
    if (data.description !== undefined) {
      await sql`UPDATE books SET description = ${data.description} WHERE id = ${id}`
    }
    if (data.cover_url !== undefined) {
      await sql`UPDATE books SET cover_url = ${data.cover_url} WHERE id = ${id}`
    }
    if (data.author_name !== undefined) {
      await sql`UPDATE books SET author_name = ${data.author_name} WHERE id = ${id}`
    }
    if (data.publisher_name !== undefined) {
      await sql`UPDATE books SET publisher_name = ${data.publisher_name} WHERE id = ${id}`
    }
    if (data.category_id !== undefined) {
      await sql`UPDATE books SET category_id = ${data.category_id} WHERE id = ${id}`
    }
    if (data.publication_year !== undefined) {
      await sql`UPDATE books SET publication_year = ${data.publication_year} WHERE id = ${id}`
    }
    if (data.total_copies !== undefined) {
      await sql`UPDATE books SET total_copies = ${data.total_copies} WHERE id = ${id}`
    }
    if (data.available_copies !== undefined) {
      await sql`UPDATE books SET available_copies = ${data.available_copies} WHERE id = ${id}`
    }
    if (data.status !== undefined) {
      await sql`UPDATE books SET status = ${data.status} WHERE id = ${id}`
    }

    const result = await sql`SELECT * FROM books WHERE id = ${id}`
    return { book: result[0] as Book, error: null }
  } catch (error) {
    console.error("Update book error:", error)
    return { book: null, error: "Failed to update book" }
  }
}

export async function deleteBook(id: string): Promise<{ error: string | null }> {
  try {
    await requireRole(["librarian", "admin"])
    // Soft delete by setting status to 'maintenance'
    await sql`UPDATE books SET status = 'maintenance' WHERE id = ${id}`
    return { error: null }
  } catch (error) {
    console.error("Delete book error:", error)
    return { error: "Failed to delete book" }
  }
}

export async function getAllBooksIncludingDeleted(search?: string, category?: string): Promise<BookWithDetails[]> {
  const result = await sql`
    SELECT b.*, 
      c.name as category_name
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    ORDER BY b.created_at DESC
  `

  let books = result as any[]

  books = books.map((book) => ({
    ...book,
    authors: book.author_name ? [{ id: "1", name: book.author_name }] : [],
    categories: book.category_name ? [{ id: book.category_id, name: book.category_name }] : [],
    publisher: book.publisher_name ? { id: "1", name: book.publisher_name } : null,
  }))

  if (search) {
    const searchLower = search.toLowerCase()
    books = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchLower) || (book.author_name || "").toLowerCase().includes(searchLower),
    )
  }

  if (category) {
    const categoryLower = category.toLowerCase()
    books = books.filter((book) => (book.category_name || "").toLowerCase().includes(categoryLower))
  }

  return books as BookWithDetails[]
}

export async function getCategories(): Promise<Category[]> {
  const result = await sql`SELECT * FROM categories ORDER BY name`
  return result as Category[]
}

export async function getBookStats() {
  const stats = await sql`
    SELECT 
      COUNT(*) as total_books,
      SUM(total_copies) as total_copies,
      SUM(available_copies) as available_copies,
      SUM(total_copies - available_copies) as borrowed_copies
    FROM books
    WHERE status != 'maintenance'
  `
  return stats[0]
}
