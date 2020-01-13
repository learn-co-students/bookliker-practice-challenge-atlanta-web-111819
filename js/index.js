const BASE_URL = 'http://localhost:3000'
const BOOKS_URL = `${BASE_URL}/books`
let BOOK_LIST_PANEL
let SHOW_BOOK_PANEL

const BOOK_LIST = []

const THIS_USER = {
    id: 1,
    username: 'pouros'
}

function doesUserLikeBook(book) {
    return !!book.users.find(user => user.id === THIS_USER.id)
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function loadAllBooks() {
    fetch(BOOKS_URL)
    .then(res => res.json())
    .then(books => {
        for (book of books) {
            BOOK_LIST.push(book)
            renderBookToList(book)
        }
    })
}

function renderBookToList(book) {
    const bookItem = document.createElement('li')
    bookItem.setAttribute('data-id', book.id)
    bookItem.textContent = book.title
    bookItem.addEventListener('click', clickBook)

    BOOK_LIST_PANEL.appendChild(bookItem)
}

function clickBook(event) {
    fetch(`${BOOKS_URL}/${event.target.getAttribute('data-id')}`)
    .then(res => res.json())
    .then(book => {
        renderBookToShowPanel(book)
    })
}

function displayAllLikingUsernames(book) {
    if (book.users.length > 0) {
        const likedHeader = document.createElement('h2')
        likedHeader.textContent = 'Liked By: '
        const userNames = book.users.map(user => user.username)
        const pNames = document.createElement('p')
        pNames.id = 'liking-user-list'
        pNames.textContent = userNames.join(', ')
        
        SHOW_BOOK_PANEL.appendChild(likedHeader)
        SHOW_BOOK_PANEL.appendChild(pNames)
    }
}

function updateLikedList(book, usernameList) {
    removeAllChildren(usernameList)

    const usernames = book.users.map(user => user.username)
    usernameList.textContent = usernames.join(', ')
}

function addLikeToBook(bookId) {
    body = {
        users: [
            ...BOOK_LIST[bookId-1].users,
            THIS_USER
        ]
    }
    options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }

    fetch(BOOKS_URL+`/${bookId}`, options)
    .then(res => res.json())
    .then(bookData => {
        BOOK_LIST[bookData.id-1] = bookData
        updateLikedList(book, document.querySelector('#liking-user-list'))
    })
}

function clickLikeButton(e) {
    const bookId = e.target.dataset.bookId
    if (doesUserLikeBook(BOOK_LIST[bookId-1])) {
        alert("You already like this book!")
    } else {
        addLikeToBook(bookId)
    }
}

function renderBookToShowPanel(book) {
    removeAllChildren(SHOW_BOOK_PANEL)

    const bookTitle = document.createElement('h2')
    bookTitle.textContent = book.title

    const bookCover = document.createElement('img')
    bookCover.src = book.img_url

    const bookDescription = document.createElement('p')
    bookDescription.textContent = book.description

    const likeButton = document.createElement('button')
    likeButton.textContent = 'Like Book'
    likeButton.dataset.bookId = book.id
    likeButton.addEventListener('click', clickLikeButton)

    SHOW_BOOK_PANEL.appendChild(bookTitle)
    SHOW_BOOK_PANEL.appendChild(bookCover)
    SHOW_BOOK_PANEL.appendChild(bookDescription)

    displayAllLikingUsernames(book)

    SHOW_BOOK_PANEL.appendChild(likeButton)
}

document.addEventListener("DOMContentLoaded", function() {
    BOOK_LIST_PANEL = document.querySelector('#list-panel')
    SHOW_BOOK_PANEL = document.querySelector('#show-panel')
    
    loadAllBooks()
});
