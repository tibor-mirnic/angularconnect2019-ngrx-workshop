import { Component, OnInit } from "@angular/core";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  BookModel,
  BookRequiredProps
} from "src/app/shared/models/book.model";
import { State, selectAllBooks, selectActiveBook, selectBooksEarningsTotals } from '../../../shared/state';
import { BooksPageActions } from '../../actions';

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
    private _store: Store<State>
  ) {
    this.books$ = this._store.select(selectAllBooks);
    this.currentBook$ = this._store.select(selectActiveBook);
    this.total$ = this._store.select(selectBooksEarningsTotals);
  }

  ngOnInit() {
    this._store.dispatch(BooksPageActions.enter());
  }

  onSelect(book: BookModel) {
    this._store.dispatch(BooksPageActions.selectBook({ bookId: book.id }));
  }

  onCancel() {
    this._store.dispatch(BooksPageActions.clearSelectedBook());
  }
  
  onSave(book: BookRequiredProps | BookModel) {
    if ("id" in book) {
      this._store.dispatch(BooksPageActions.updateBook({ bookId: book.id, book: book }));
    } else {
      this._store.dispatch(BooksPageActions.createBook({ book: book }));
    }
  }

  onDelete(book: BookModel) {
    this._store.dispatch(BooksPageActions.deleteBook({ bookId: book.id}));
  }
}
