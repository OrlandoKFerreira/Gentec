import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import UserPage from "./pages/userPage/userPage";
import HRPage from "./pages/hrPage/hrPage";


function RoutesWeb() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/hrPage" Component={HRPage} />
        <Route path="/userPage" Component={UserPage} />
        <Route path="/" Component={Login} />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesWeb;
