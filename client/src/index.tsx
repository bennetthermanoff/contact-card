import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { PdfApp, PdfAppAll } from './Pdf';
import { CreateContact } from './CreateContact';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement,);

const Router = createBrowserRouter([
    {
        path: '/',
        element: <CreateContact />,
        errorElement: <h1>Not Found</h1>,
    },
    {
        path: '/contact/:contactId',
        element: <App />,
        errorElement: <h1>Not Found</h1>,
    },
    {
        path: '/pdf/:contactId',
        element: <PdfApp />,
        errorElement: <h1>Not Found</h1>,
    },
    {
        path: '/pdf/all',
        element: <PdfAppAll />,
        errorElement: <h1>Not Found</h1>,
    },
    {
        path: '/pdf/last',
        element: <PdfAppAll lastOnly={true} />,
        errorElement: <h1>Not Found</h1>,
    }
]);

root.render(<React.StrictMode>
    <RouterProvider router={Router} />
</React.StrictMode>,);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
