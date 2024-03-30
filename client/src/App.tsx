// App.js
import * as React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom'; // Import createHashRouter instead of createBrowserRouter
import Home from './pages/Home';
import { ThemeProvider } from "@emotion/react";
import { AppTheme } from "./styles";
import './App.css';

function App() {
  const router = createHashRouter([ // Use createHashRouter
    {
      path: '/',
      element: <Home />,
    }
  ]);

  return (
    <div className="App">
      <ThemeProvider theme={AppTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
