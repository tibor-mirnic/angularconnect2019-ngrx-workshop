import { Component, OnInit } from "@angular/core";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  BookModel,
  BookRequiredProps
} from "src/app/shared/models/book.model";
import { BooksService } from "src/app/shared/services/book.service";
import { State, selectAllBooks, selectActiveBook, selectBooksEarningsTotals } from '../../../shared/state';
import { BooksPageActions, BooksApiActions } from '../../actions';

@Component({
  selector: "app-books",
  templateUrl: "./books-page.component.html",
  styleUrls: ["./books-page.component.css"]
})
export class BooksPageComponent implements OnInit {
  books$: Observable<BookModel[]>;
  currentBook$: Observable<BookModel | null>;
  total$: Observable<number>;

  constructor(
    private booksService: BooksService,
    private _store: Store<State>
  ) {
    this.books$ = this._store.select(selectAllBooks);
    this.currentBook$ = this._store.select(selectActiveBook);
    this.total$ = this._store.select(selectBooksEarningsTotals);
  }

  ngOnInit() {
    this._store.dispatch(BooksPageActions.enter());
    this.getBooks();
  }

  getBooks() {
    this.booksService.all().subscribe(books => {
      this._store.dispatch(BooksApiActions.getAllBooks({ books: books }));
    });
  }

  onSelect(book: BookModel) {
    this._store.dispatch(BooksPageActions.selectBook({ bookId: book.id }));
  }

  onCancel() {
    this._store.dispatch(BooksPageActions.clearSelectedBook());
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
      this._store.dispatch(BooksApiActions.bookCreated({ book: book }));
    });
  }

  updateBook(book: BookModel) {
    this._store.dispatch(BooksPageActions.updateBook({ bookId: book.id, book: book }));

    this.booksService.update(book.id, book).subscribe(book => {
      this._store.dispatch(BooksApiActions.bookUpdated({ book: book }));
    });
  }

  onDelete(book: BookModel) {
    this._store.dispatch(BooksPageActions.deleteBook({ bookId: book.id}));

    this.booksService.delete(book.id).subscribe(() => {
      this._store.dispatch(BooksApiActions.bookDeleted({ bookId: book.id }));
    });
  }
}
