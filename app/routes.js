/* eslint-disable indent */
const { createBooksHandler, getAllBooksHandler, getBooksByIdHandler, editBookByIdHandler, deleteBookByIdHandler } = require('./handler')

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: () => {
            return 'This is homepage'
        }
    },
    {
        method: '*',
        path: '/',
        handler: () => {
            return 'page cannot be access'
        }
    },
    {
        method: 'POST',
        path: '/books',
        handler: createBooksHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBooksByIdHandler
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookByIdHandler
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler
    }
]

module.exports = routes
