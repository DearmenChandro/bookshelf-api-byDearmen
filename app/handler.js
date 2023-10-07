/* eslint-disable no-unused-vars */
const bookshelf = require('./bookshelf')
const { nanoid } = require('nanoid')
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const createBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload

    const id = nanoid(16)

    if (readPage > pageCount) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        res.code(400)
        return res
    }

    const isFinished = (readPage, pageCount) => {
        if (readPage === pageCount) {
            return true
        }
        if (readPage < pageCount) {
            return false
        }
    }
    const finished = isFinished(readPage, pageCount)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    if (!name) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        res.code(400)
        return res
    }
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    }
    bookshelf.push(newBook)
    const isSuccess = bookshelf.filter(book => book.id === id).length > 0
    if (isSuccess) {
        const res = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        res.code(201)
        return res
    }
    const res = h.response({
        status: 'error',
        message: 'Books failed to added'
    })
    res.code(500)
    return res
}

const getAllBooksHandler = (request, h) => {
    const filteredBooks = bookshelf.filter(book => book.name !== undefined && book.publisher !== undefined)

    return {
        status: 'success',
        data: {
            books: filteredBooks.map(book => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    }
}

const getBooksByIdHandler = (request, h) => {
    const { bookId } = request.params
    const book = bookshelf.find((book) => book.id === bookId)

    if (book) {
        const res = h.response({
            status: 'success',
            data: {
                book
            }
        })
        res.code(200)
        return res
    } else {
        const res = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        })
        res.code(404)
        return res
    }
}

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params
    const bookIndex = bookshelf.findIndex((book) => book.id === bookId)

    if (bookIndex === -1) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        })
        res.code(404)
        return res
    }

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload

    if (!name) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        res.code(400)
        return res
    } else if (readPage > pageCount) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        res.code(400)
        return res
    }

    bookshelf[bookIndex] = {
        ...bookshelf[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    }

    const res = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    })
    res.code(200)
    return res
}

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params
    const bookIndex = bookshelf.findIndex((book) => book.id === bookId)

    if (bookIndex === -1) {
        const res = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        })
        res.code(404)
        return res
    }

    bookshelf.splice(bookIndex, 1)

    const res = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
    })
    res.code(200)
    return res
}

module.exports = {
    createBooksHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
}
