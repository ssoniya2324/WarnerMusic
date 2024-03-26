import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home'
import { ThemeProvider } from "@emotion/react";
import { AppTheme } from "./styles";
import './App.css'
function App() {

  const router = createBrowserRouter([
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
