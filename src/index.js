document.addEventListener('DOMContentLoaded', () => {

const quotesURL = 'http://localhost:3000/quotes'

const quoteList = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')

const getQuotesFetch = () => {
  fetch(quotesURL)
  .then(res => res.json())
  .then(quotes => slapAllQuotesToDom(quotes))
}

const slapAllQuotesToDom = (quotes) => {
  quotes.forEach(slapOneQuoteToDom)
  }

const slapOneQuoteToDom = (quoteObj) => {
  let id = quoteObj.id
  let quote = quoteObj.quote
  let likes = quoteObj.likes
  let author = quoteObj.author

  quoteList.innerHTML +=
    `
    <li class='quote-card' data-id="${id}">
       <blockquote class="blockquote">
         <p class="mb-0">${quote}</p>
         <footer class="blockquote-footer">${author}</footer>
         <br>
         <button class='btn-success' data-id='${id}'>Likes: <span>${likes}</span></button>
         <button class='btn-danger' data-id='${id}'>Delete</button>
       </blockquote>
     </li>
     `
}

const handleNewQuoteFormButton = () => {
  newQuoteForm.addEventListener('submit', createNewQuote)
}

const createNewQuote = (event) => {
    event.preventDefault();
    let newQuoteFromForm = event.target.parentElement.querySelector('#new-quote').value
    let newAuthorFromForm = event.target.parentElement.querySelector('#author').value

    fetch('http://localhost:3000/quotes', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        quote: newQuoteFromForm,
        likes: 0,
        author: newAuthorFromForm
      })
    })
    .then(res => res.json())
    .then(newQuoteObj => slapOneQuoteToDom(newQuoteObj))
    .then(newQuoteForm.reset())
}

const addEventListenerToLikesButton = () => {
  quoteList.addEventListener('click', handleLikesButton)
}

const handleLikesButton = (event) => {
  if(event.target.classList.contains('btn-success')){
    // console.log('likes button clicked', event.target.lastElementChild.innerText)
    // debugger
    let newLikes = parseInt(event.target.lastElementChild.innerText) + 1
    let id = event.target.dataset.id

    fetch(`${quotesURL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(event.target.lastElementChild.innerText = `${newLikes}`)
  }
}

const addEventListenerToDeleteButton = () => {
  quoteList.addEventListener('click', handleDeleteButton)
}

const handleDeleteButton = (event) => {
  if(event.target.classList.contains('btn-danger')){
    let id = event.target.dataset.id
    fetch(`${quotesURL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(event.target.parentElement.parentElement.remove())
  }
}


// CALLS
getQuotesFetch();
handleNewQuoteFormButton();
addEventListenerToLikesButton();
addEventListenerToDeleteButton();
}) // END OF DOMCONTENTLOADED
