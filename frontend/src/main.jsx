import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import './index.css';
import { HomePage } from './pages/home';
import { ChatPage } from './pages/chat';
import { ChatProvider } from './context/chat-provider';

const router = createBrowserRouter([
  {
    element: <ChatProvider />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      { path: '/chats', element: <ChatPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <div className='app min-h-svh flex bg-cover bg-center'>
      <RouterProvider router={router} />
    </div>
  </ChakraProvider>,
);
