import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import "./index.css";
import { HomePage } from "./pages/home";
import { ChatPage } from "./pages/chat";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/chats", element: <ChatPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);
