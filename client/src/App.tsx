// App.js
import * as React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom'; // Import createHashRouter instead of createBrowserRouter
import Home from './pages/Home';
import { ThemeProvider } from "@emotion/react";
import { AppTheme } from "./styles";
import './App.css';
import Form from './pages/Form';
import { Grid } from '@mui/material';
import Header from './components/Header';

function App() {
  const router = createHashRouter([ // Use createHashRouter
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/form',
      element: <Form />,
    }
  ]);

  return (
    <div className="App">
      
      <>
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Header />
          <ThemeProvider theme={AppTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
        

        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </>
    </div>
  );
}

export default App;
