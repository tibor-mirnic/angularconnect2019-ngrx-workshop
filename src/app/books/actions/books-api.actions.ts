import { createAction, props } from "@ngrx/store";
import { BookModel } from "src/app/shared/models/book.model";

export const getAllBooks = createAction(
  "[Books API] Get All Books Success",
  props<{ books: BookModel[] }>()
);

export const bookCreated = createAction(
  "[Books API] Book Created",
  props<{ book: BookModel }>()
);

export const bookUpdated = createAction(
  "[Books API] Book Updated",
  props<{ book: BookModel }>()
);

export const bookDeleted = createAction(
  "[Books API] Book Deleted",
  props<{ bookId: string }>()
);