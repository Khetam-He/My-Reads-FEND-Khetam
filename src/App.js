import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Route, Switch } from 'react-router-dom'
import Search from './search-page'
import List from './bookList-page'
import NotFoundPage from './page-notFound'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
           shelfs: {
            currentlyReading: {
                label: 'Currently Reading'
            },
            wantToRead: {
                label: 'Want to Read'
            },
            read: {
                label: 'Read'
            }
        },
        books: [],
        search: {
            query: null,
            books: [],
        },
        bookShelfAssoc: {},
        myRequestComplete: false,
   // showSearchPage: false
  }
 refreshBookList = () => {
        this.setState({
            myRequestComplete: false,
            books: []
        })

        BooksAPI.getAll()
            .then((data) => {
                this.setState({
                    books: data,
                    myRequestComplete: true
                })
                this.updateBookShelfAssoc(data);
            });
    }
 updateBookShelfAssoc(books) {
        let bookShelfAssoc = {};
        books.forEach((book) => {
            bookShelfAssoc[book.id] = book.shelf
        });

        this.setState({ bookShelfAssoc });

        this.onSearchUpdate(
            this.state.search.query,
            this.state.search.books
        );
    }
    onBookMove = (book, newShelf) => {

        return BooksAPI.update(book, newShelf)
            .then(() => this.refreshBookList())

    }

    onSearchUpdate = (query, books) => {

        books.forEach((book) => {
            book.shelf = (this.state.bookShelfAssoc[book.id])
                ? this.state.bookShelfAssoc[book.id]
                : 'none';
        })

        let state = this.state;

        state.search = {
            query: query,
            books: books
        }

        this.setState(state);

    }

    componentDidMount() {
        this.refreshBookList()
    }


  render() {
  
       return (<div className="app">
            <Switch>
                <Route exact path="/search" render={() => (
                    <Search
                        shelfs={this.state.shelfs}
                        books={this.state.search.books}
                        onBookMove={this.onBookMove}
                        onSearchUpdate={this.onSearchUpdate} />
                )} />
                <Route exact path="/" render={() => (
                    <List
                        myRequestComplete={this.state.myRequestComplete}
                        shelfs={this.state.shelfs}
                        books={this.state.books}
                        onBookMove={this.onBookMove} />
                )} />
                <Route component={NotFoundPage} />
            </Switch>
          </div>
    )
  }
}

export default BooksApp
