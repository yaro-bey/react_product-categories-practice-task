import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import { User } from './types/User';
// import { Category } from './types/Category';
import { Product } from './types/Product';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

const extendedProducts = productsFromServer.map(product => {
  const foundCategory = categoriesFromServer.find(
    category => category.id === product.categoryId,
  ) || null;

  const foundUser = usersFromServer.find(
    user => user.id === foundCategory?.ownerId,
  ) || null;

  return {
    ...product,
    category: foundCategory,
    user: foundUser,
  };
});

export const App: React.FC = () => {
  const [currentProducts] = useState<Product[]>(extendedProducts);
  const [owner, setOwner] = useState<User | null>(null);
  const [query, setQuery] = useState('');
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  const visibleProducts = currentProducts.filter(product => {
    const { user } = product;

    if (!owner) {
      return product;
    }

    return user ? user.id === owner.id : false;
  });

  function searchInput(input: string) {
    return input.trim().toLowerCase().includes(query.toLowerCase());
  }

  const searchResult = visibleProducts.filter(
    product => searchInput(product.name),
  );

  function resetAllFilters() {
    setOwner(null);
    setQuery('');
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames(
                  {
                    'is-active': !owner,
                  },
                )}
                onClick={() => setOwner(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={classNames(
                    {
                      'is-active': user.id === owner?.id,
                    },
                  )}
                  onClick={() => {
                    setOwner(user);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  id="search-query"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      aria-label="Clear input"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames(
                  'button is-success mr-6',
                  {
                    'is-outlined': !isCategorySelected,
                  },
                )}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={classNames(
                    'button mr-2 my-1',
                    {
                      'is-info': isCategorySelected,
                    },
                  )}
                  href="#/"
                  onChange={() => setIsCategorySelected(true)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {searchResult.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {searchResult.length > 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {searchResult.map(product => {
                  const { category, user } = product;

                  return (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">
                        {product.name}
                      </td>

                      {category && (
                        <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>
                      )}

                      {user && (
                        <td
                          data-cy="ProductUser"
                          className={classNames({
                            'has-text-link': user.sex === 'm',
                            'has-text-danger': user.sex === 'f',
                          })}
                        >
                          {user.name}
                        </td>
                      )}
                    </tr>
                  );
                })}

              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
