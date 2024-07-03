import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { PdfApp, PdfAppAll } from './Pdf';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CreateEvent } from './pages/CreateEvent';
import { ManageEvent } from './pages/ManageEvent';
import { EditContact } from './pages/EditContact';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement,);

const Router = createBrowserRouter([
    {
        path: '/',
        element: <CreateEvent />,
        errorElement: <h1>Not Found</h1>,
    },
    {
        path: '/event/:eventId/manage/:adminSecret',
        element: <ManageEvent />,
        errorElement: <h1>Not Found</h1>,
    },
    {
        path: '/event/:eventId/contact/:contactId',
        element: <App />,
        errorElement: <h1>Not Found</h1>,
    },
    {
        path: '/event/:eventId/pdf/',
        element: <PdfApp />,
        errorElement: <h1>Not Found</h1>,
    },
    {
        path: '/event/:eventId/:secret/create/new',
        element: <EditContact isNew ={true}/>,
        errorElement: <h1>Not Found</h1>,
    },
    {
        path: '/event/:eventId/:secret/edit/:contactId',
        element: <EditContact isNew={false} />,
        errorElement: <h1>Not Found</h1>,
    }
    // {
    //     path: '/contact/:contactId',
    //     element: <App />,
    //     errorElement: <h1>Not Found</h1>,
    // },
    // {
    //     path: '/pdf/:contactId',
    //     element: <PdfApp />,
    //     errorElement: <h1>Not Found</h1>,
    // },
    // {
    //     path: '/pdf/all',
    //     element: <PdfAppAll />,
    //     errorElement: <h1>Not Found</h1>,
    // }
]);

root.render(<React.StrictMode>
    <RouterProvider router={Router} />
</React.StrictMode>,);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
