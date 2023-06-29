import axios from "axios";

const booksApi = axios.create({
  baseURL: "https://books.ioasys.com.br/api/v1",
});

export default booksApi;
