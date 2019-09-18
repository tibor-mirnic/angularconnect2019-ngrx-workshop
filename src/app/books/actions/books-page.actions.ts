import { createAction, props } from "@ngrx/store";
import { BookModel, BookRequiredProps } from "src/app/shared/models/book.model";


export const enter = createAction(
  '[Books Page] Enter'
);

export const selectBook = createAction(
  '[Books Page] Select Book',
  props<{ bookId: string }>()
)

export const clearSelectedBook = createAction(
  "[Books Page] Clear Selected Book"
);

export const createBook = createAction(
  '[Books Page] Create Book',
  props<{ book: BookRequiredProps }>()
)

export const updateBook = createAction(
  '[Books Page] Update Book',
  props<{ bookId: string, book: BookModel }>()
)

export const deleteBook = createAction(
  '[Books Page] Create Book',
  props<{ bookId: string }>()
)