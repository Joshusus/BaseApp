import type { RouteObject } from 'react-router';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import Portfolio from './pages/portfolio/Portfolio';

const RouterConfig: () => RouteObject[] = () => [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/portfolio',
    element: <Portfolio />,
  },
];

export default RouterConfig;
