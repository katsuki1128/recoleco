import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Money } from "./pages/Money"
import { Health } from "./pages/Health";

import { Assets } from "./pages/Assets";
import { PersonalIndex } from "./pages/PersonalIndex";


const App = () => {
  return (

    < div className="container mx-auto px-4" >
      <BrowserRouter>
        <h1 className="text-center font-bold mb-0">recoleco</h1>

        <ul className="list-decimal pl-5">
          <li className="mb-2">
            <Link
              to="/money"
              className="text-blue-500 hover:underline"
            >
              家計簿
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/health"
              className="text-blue-500 hover:underline"
            >
              健康管理
            </Link>
          </li>
        </ul>
        <Routes>
          <Route path="/money" element={<Money />} />
          <Route path="/health" element={<Health />} />
        </Routes>
        <Assets />
        <PersonalIndex />
      </BrowserRouter>
    </div >
  );
};

export default App;
