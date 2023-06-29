import React, { useState, useEffect } from "react";
import api from "../components/api";

import logoWhite from '../../../src/images/svg/logoWhite.svg';
import logoBlack from '../../../src/images/svg/logoBlack.svg';


const Main = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [alert, setAlert] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState('');
  const [tokenGlobal, setTokenGlobal] = useState('');

  const [pageLength, setPageLength] = useState(0);
  const [page, setPage] = useState(1);
  const [booksInfo, setBooksInfo] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [bookModalInfo, setBookModalInfo] = useState('');


  useEffect(async () => {
    await getBooks(tokenGlobal);
  }, [page]);

  const loginOptions = {
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  };

  const verifyUser = async () => {
    setAlert(false)
    try {
      const response = await api.post("auth/sign-in", {
        email,
        password,
      }, loginOptions);


      setAlert(false);
      setUser(response.data.name);

      const token = response.headers.authorization;
      setTokenGlobal(token);
      getBooks(token);

      setLoggedIn(true);
    } catch (err) {
      setAlert(true)
    }
  };

  const logout = () => {
    setLoggedIn(false);
  };

  const getBooks = async (token) => {
    try {
      const { data } = await api.get("books", {
        headers: {
          Authorization: `Bearer ` + token
        },
        params: {
          page,
          amount: 12,
        },
      });


      setPageLength(Math.ceil(data.totalPages));
      setBooksInfo(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getBookModal = async (id) => {
    setModalVisible(true);

    try {
      const token = tokenGlobal;
      const { data } = await api.get("books/" + id, {
        headers: {
          Authorization: `Bearer ` + token
        },
      });
      const infoModalBook = data;
      setBookModalInfo(infoModalBook);
    } catch (err) {
      console.error(err);
    }
  };

  const prevPage = () => {
    if (page - 1 > 0) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (page + 1 <= pageLength) {
      setPage(page + 1);
    }
  };

  return (
    <>
      <main className="ioasys__main">
        {!loggedIn ? (
          <>
            <div className="ioasys__main-loginPage">

              <div className="ioasys__main-loginPage--title">
                <img src={logoWhite} alt="Imagem do Produto" /><p>Books</p>
              </div>

              <form className="ioasys__main-loginPage--form" onSubmit={(event) => {
                event.preventDefault();
                verifyUser()
              }}>

                <div className="ioasys__contentInput email">
                  <label for="email" className="ioasys__contentInput-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    className="ioasys__contentInput-input"
                    type="email"
                    required
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  />
                </div>

                <div className="ioasys__contentInput password">
                  <label for="password" className="ioasys__contentInput-label">Senha</label>
                  <input
                    id="password"
                    name="password"
                    className="ioasys__contentInput-input"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                </div>

                <button type="submit" className="ioasys__main-loginPage--form--button">Entrar</button>

                {alert && <span className="ioasys__main-loginPage--form--alert">Email e/ou senha incorretos.</span>}
              </form>

            </div>
          </>
        ) : (
          <>
            <div className="ioasys__main-homePage">
              <div className="ioasys__header">
                <div className="ioasys__header-left">
                  <img src={logoBlack} alt="Imagem do Produto" /><p>Books</p>
                </div>
                <div className="ioasys__header-right">
                  <span className="ioasys__header-right--welcome">Bem vindo, <strong>{user}!</strong></span>
                  <button className="ioasys__header-right--logout" onClick={logout}></button>
                </div>
              </div>
              <ul className="ioasys__content">
                {booksInfo.data?.map((item) => (
                  <li className="ioasys__content-item" id={item.id} onClick={() => getBookModal(item.id)}>
                    <div className="ioasys__content-item--left">
                      <img src={item.imageUrl} alt={item.title} />
                    </div>
                    <div className="ioasys__content-item--right">
                      <h2 className="ioasys__content-item--right--title">{item.title}</h2>
                      <h3 className="ioasys__content-item--right--author">{item.authors[0]}</h3>

                      <span className="ioasys__content-item--right--pages">{item.pageCount} páginas</span>
                      <span className="ioasys__content-item--right--publisher">{item.publisher}</span>
                      <span className="ioasys__content-item--right--published">Publicado em {item.published}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="ioasys__pagination">
                <span className="ioasys__pagination-page">
                  Página <strong>{page}</strong> de <strong>{pageLength}</strong>
                </span>
                <button className="ioasys__pagination-btnLeft"
                  disabled={!booksInfo || booksInfo.currentPage <= 1}
                  onClick={prevPage}
                />
                <button className="ioasys__pagination-btnRight"
                  disabled={
                    !booksInfo || booksInfo.currentPage >= booksInfo.totalPages
                  }
                  onClick={nextPage}
                />
              </div>


              {modalVisible && bookModalInfo && (
                <div className="ioasys__modal">
                  <div className="ioasys__modal-overlay" onClick={() => setModalVisible(false)}></div>
                  <button className="ioasys__modal-close" onClick={() => setModalVisible(false)} />
                  <div className="ioasys__modal-book">
                    <div className="ioasys__modal-book--left">
                      <img src={bookModalInfo.imageUrl} alt={bookModalInfo.title} />
                    </div>
                    <div className="ioasys__modal-book--right">
                      <h2 className="ioasys__modal-book--right--title">{bookModalInfo.title}</h2>
                      <h3 className="ioasys__modal-book--right--author">{bookModalInfo.authors[0]}</h3>

                      <div className="ioasys__modal-book--right--info">
                        <h2 className="ioasys__modal-book--right--info--title">Informações</h2>

                        <div className="ioasys__modal-book--right--info--item">
                          <strong>Páginas</strong> <span>{bookModalInfo.pageCount} páginas</span>
                        </div>
                        <div className="ioasys__modal-book--right--info--item">
                          <strong>Editora</strong> <span>{bookModalInfo.publisher}</span>
                        </div>
                        <div className="ioasys__modal-book--right--info--item">
                          <strong>Publicação</strong> <span>{bookModalInfo.published}</span>
                        </div>
                        <div className="ioasys__modal-book--right--info--item">
                          <strong>Idioma</strong> <span>{bookModalInfo.language}</span>
                        </div>
                        <div className="ioasys__modal-book--right--info--item">
                          <strong>Título Original</strong> <span>{bookModalInfo.title}</span>
                        </div>
                        <div className="ioasys__modal-book--right--info--item">
                          <strong>ISBN-10</strong> <span>{bookModalInfo.isbn10}</span>
                        </div>
                        <div className="ioasys__modal-book--right--info--item">
                          <strong>ISBN-13</strong> <span>{bookModalInfo.isbn13}</span>
                        </div>
                      </div>

                      <div className="ioasys__modal-book--right--review">
                        <h2 className="ioasys__modal-book--right--review--title">Resenha da editora</h2>

                        <span className="ioasys__modal-book--right--review--text">
                          {bookModalInfo.description}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </>

  )
}

export default Main;