import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FavoritesProvider } from './Pages/Components/Context/FavoritesContext'
import { FilterProvider } from './Pages/Components/Context/FilterContext';
import { FilterDataProvider } from './Pages/Components/Context/FilterDataContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FavoritesProvider>
      <FilterDataProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </FilterDataProvider>
    </FavoritesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
