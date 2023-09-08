// React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Root Component
import App from "./App";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
