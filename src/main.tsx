import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './i18n';
import '../index.css';
import RouterConfig from './RouterConfig';

const router = createBrowserRouter(RouterConfig());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
