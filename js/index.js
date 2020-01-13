let users = []
document.addEventListener("DOMContentLoaded", function() {
    let bookArea = document.getElementById("show-panel")
    fetchBooks();
});

function fetchBooks(){
    fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(json => {
        data = json
        renderToList(data);
    });
}

function renderToList(data){
    let bookList = document.getElementById("list-panel")
    data.forEach(book => {
        let li = document.createElement("li")
        li.textContent = book.title
        li.dataset.bookId = book.id 
        li.addEventListener("click", renderBook)
        bookList.appendChild(li)
    })
}

function renderBook(e){
    fetch(`http://localhost:3000/books/${e.target.dataset.bookId}`)
    .then(resp => resp.json())
    .then(book => {
        let bookArea = document.getElementById("show-panel")
        users = book.users
        clear(bookArea)

        let img = document.createElement("img")
        img.src = book.img_url

        let bookName = document.createElement("h2")
        bookName.textContent = book.title

        let desc = document.createElement("p")
        desc.textContent = book.description

        let button = document.createElement("button")
        button.dataset.bookId = book.id
        users = book.users
        console.log(users.find(user => user.id === 1))
        if(book.users.find(user => user.id === 1)){
            button.textContent = "Liked"
        }else{
            button.textContent = "Like"
        }
        button.addEventListener("click", addLike)

        bookArea.appendChild(img)
        bookArea.appendChild(bookName)
        bookArea.appendChild(desc)
        bookArea.appendChild(button)

    })

   
}

function addLike(e){
    let bookId = e.target.dataset.bookId
    console.log(users)
    if(e.target.textContent === "Like"){
        users.push({id: 1, username: "pouros"})
        fetch(`http://localhost:3000/books/${bookId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                users: users
            })
        })
        .then(resp => resp.json())
        .then(json => {
            let user = json.users[json.users.length - 1]
            let li = document.createElement("li")
            li.textContent = user.username
            e.target.textContent = "Liked"
            e.target.before(li)
        })
    }else{
        alert("Already Liked")
    }
}

function clear(item){
    while(item.firstChild){
        item.removeChild(item.firstChild)
    }
}