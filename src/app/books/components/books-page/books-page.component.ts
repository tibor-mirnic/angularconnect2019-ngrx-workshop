import { Component, OnInit } from "@angular/core";
import { Store } from '@ngrx/store';

import {
  BookModel,
  calculateBooksGrossEarnings,
  BookRequiredProps
} from "src/app/shared/models/book.model";
import { BooksService } from "src/app/shared/services/book.service";
import { State } from '../../../shared/state';
import { BooksPageActions, BooksApiActions } from '../../actions';

@Component({
  selector: "app-books",
  templateUrl: "./books-page.component.html",
  styleUrls: ["./books-page.component.css"]
})
export class BooksPageComponent implements OnInit {
  books: BookModel[] = [];
  currentBook: BookModel | null = null;
  total: number = 0;

  constructor(
    private booksService: BooksService,
    private _store: Store<State>
  ) {}

  ngOnInit() {
    this._store.dispatch(BooksPageActions.enter());

    this.getBooks();
    this.removeSelectedBook();
  }

  getBooks() {
    this.booksService.all().subscribe(books => {
      this.books = books;
      this.updateTotals(books);
      this._store.dispatch(BooksApiActions.getAllBooks({ books: books }));
    });
  }

  updateTotals(books: BookModel[]) {
    this.total = calculateBooksGrossEarnings(books);
  }

  onSelect(book: BookModel) {
    this.currentBook = book;
    this._store.dispatch(BooksPageActions.selectBook({ bookId: book.id }));
  }

  onCancel() {
    this.removeSelectedBook();
  }
  
  removeSelectedBook() {
    this._store.dispatch(BooksPageActions.clearSelectedBook());

    this.currentBook = null;
  }

  onSave(book: BookRequiredProps | BookModel) {
    if ("id" in book) {
      this.updateBook(book);
    } else {
      this.saveBook(book);
    }
  }

  saveBook(bookProps: BookRequiredProps) {
    this._store.dispatch(BooksPageActions.createBook({ book: bookProps }));
    this.booksService.create(bookProps).subscribe(book => {
      this.getBooks();
      this.removeSelectedBook();

      this._store.dispatch(BooksApiActions.bookCreated({ book: book }));
    });
  }

  updateBook(book: BookModel) {
    this._store.dispatch(BooksPageActions.updateBook({ bookId: book.id, book: book }));

    this.booksService.update(book.id, book).subscribe(book => {
      this.getBooks();
      this.removeSelectedBook();

      this._store.dispatch(BooksApiActions.bookUpdated({ book: book }));
    });
  }

  onDelete(book: BookModel) {
    this._store.dispatch(BooksPageActions.deleteBook({ bookId: book.id}));

    this.booksService.delete(book.id).subscribe(() => {
      this.getBooks();
      this.removeSelectedBook();

      this._store.dispatch(BooksApiActions.bookDeleted({ bookId: book.id }));
    });
  }
}
