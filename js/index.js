document.addEventListener("DOMContentLoaded", function() {

fetch('http://localhost:3000/books').then(resp => resp.json()).then(data => AllBooks(data))



});


function AllBooks(data){
    data.forEach(book => { listBook(book) })
}

function listBook(book){

    const ul = document.querySelector('#list')
    const li = document.createElement('li')
    li.textContent = book.title

    li.addEventListener('click', function(e){displayInfo(book)})


    ul.appendChild(li)
    
}


function displayInfo(book){
    const div = document.querySelector('#show-panel')
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
    const h2 = document.createElement('h2')
    h2.textContent = book.title

    const image = document.createElement('img')
    image.src = book.img_url

    const p = document.createElement('p')
    p.textContent = book.description

    const h3 = document.createElement('h3')
    h3.textContent = 'How like it:'

    

    const button = document.createElement('button')
    button.textContent = 'Read Book'
    button.dataset.id = book.id
    
    
    button.addEventListener('click', (e) => {
        button.textContent = 'liked';
        let bookLiked = book.users
        bookLiked.push({"id": 1, "username": "Yash"})
        
        
          fetch(`http://localhost:3000/books/${e.target.dataset.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({users: bookLiked})

            })
            .then(res => res.json())
            .then(book => {
                
                
            })
  
        
        
    })




    div.appendChild(h2)
    div.appendChild(image)
    div.appendChild(p)
    div.appendChild(button)


}