// app/src/main.ts
import {
  Auth,
  define,
  History,
  Switch,
  Store
} from "@calpoly/mustang";
import { html } from "lit";

import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";

import { BookshelfHeaderElement } from "./components/bookshelf-header.js";
import { HomeViewElement } from "./views/home-view.js";
import { AuthorViewElement } from "./views/author-view.js";
import { AuthorCommentViewElement } from "./views/author-comment-view.js";
import { BookDetailViewElement } from "./views/book-detail-view.js";
import { BooksViewElement } from "./views/books-view.js";
import { CategoryViewElement } from "./views/category-view.js";
import { CommentViewElement } from "./views/comment-view.js";
import { BookEditViewElement } from "./views/book-edit-view.js";
import { CommentEditViewElement } from "./views/comment-edit-view.js";
import { HeaderAuthElement } from "./components/header-auth.js";
import { AuthorEditViewElement } from "./views/author-edit-view.js";
import { AuthorsViewElement } from "./views/authors-view.js";
import { CategoriesViewElement } from "./views/categories-view.js";
import { CategoryEditViewElement } from "./views/category-edit-view.js";
import "./components/mini-book.js";
import "./components/book-list.js";
import { setupDarkModeForComponents } from "./utils/darkModeUtils.js";

const routes = [
  {
    path: "/app/categories/new",
    view: () => html`
      <category-edit-view></category-edit-view>
    `
  },
  {
    path: "/app/categories/:id/edit",
    view: (params: Switch.Params) => html`
      <category-edit-view category-id=${params.id}></category-edit-view>
    `
  },
  {
    path: "/app/categories/:id",
    view: (params: Switch.Params) => html`
      <category-view category=${params.id}></category-view>
    `
  },
  {
    path: "/app/categories",
    view: () => html`
      <categories-view></categories-view>
    `
  },
  {
    path: "/app/authors/new",
    view: () => html`
      <author-edit-view></author-edit-view>
    `
  },
  {
    path: "/app/authors/:id/edit",
    view: (params: Switch.Params) => html`
      <author-edit-view author-id=${params.id}></author-edit-view>
    `
  },
  {
    path: "/app/authors/:id",
    view: (params: Switch.Params) => html`
      <author-view author-id=${params.id}></author-view>
    `
  },
  {
    path: "/app/authors",
    view: () => html`
      <authors-view></authors-view>
    `
  },
  {
    path: "/app/books/new",
    view: () => html`
      <book-edit-view></book-edit-view>
    `
  },
  {
    path: "/app/books/:id/edit",
    view: (params: Switch.Params) => html`
      <book-edit-view book-id=${params.id}></book-edit-view>
    `
  },
  {
    path: "/app/books/:bookId/comments/new",
    view: (params: Switch.Params) => html`
      <comment-edit-view book-id=${params.bookId}></comment-edit-view>
    `
  },
  {
    path: "/app/books/:bookId/comments/:commentId/edit",
    view: (params: Switch.Params) => html`
      <comment-edit-view 
        book-id=${params.bookId}
        comment-id=${params.commentId}>
      </comment-edit-view>
    `
  },
  {
    path: "/app/authors/:authorId/comments/:commentId",
    view: (params: Switch.Params) => html`
      <author-comment-view 
        author-id=${params.authorId} 
        comment-id=${params.commentId}>
      </author-comment-view>
    `
  },
  {
    path: "/app/books/:bookId/comments/:commentId",
    view: (params: Switch.Params) => html`
      <comment-view 
        book-id=${params.bookId} 
        comment-id=${params.commentId}>
      </comment-view>
    `
  },
  {
    path: "/app/books/:id",
    view: (params: Switch.Params) => html`
      <book-detail-view book-id=${params.id}></book-detail-view>
    `
  },
  {
    path: "/app/books",
    view: () => html`
      <books-view></books-view>
    `
  },
  {
    path: "/app/categories/:category",
    view: (params: Switch.Params) => html`
      <category-view category=${params.category}></category-view>
    `
  },
  {
    path: "/app",
    view: () => html`
      <home-view></home-view>
    `
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "bookshelf:auth");
    }
  },
  "bookshelf-header": BookshelfHeaderElement,
  "home-view": HomeViewElement,
  "books-view": BooksViewElement,
  "author-view": AuthorViewElement,
  "author-comment-view": AuthorCommentViewElement,
  "book-detail-view": BookDetailViewElement,
  "book-edit-view": BookEditViewElement,
  "comment-edit-view": CommentEditViewElement,
  "category-view": CategoryViewElement,
  "comment-view": CommentViewElement,
  "header-auth": HeaderAuthElement,
  "author-edit-view": AuthorEditViewElement,
  "authors-view": AuthorsViewElement,
  "categories-view": CategoriesViewElement,
  "category-edit-view": CategoryEditViewElement,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "bookshelf:history", "bookshelf:auth");
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setupDarkModeForComponents();
});