import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Money } from "./pages/Money"
import { Health } from "./pages/Health";

import { Assets } from "./pages/Assets";
import { PersonalIndex } from "./pages/PersonalIndex";

import { IconLink } from "./pages/IconLink";
import { faWallet, faWeightScale, faHouse } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  return (

    < div className="container mx-auto px-4" >
      <BrowserRouter>
        <h1 className="text-center text-lg font-bold m-3 bg-gray-200 rounded p-4">
          recoleco
        </h1>

        <div className="mt-6">
          <div className="flex justify-center">
            <IconLink to="/" icon={faHouse} label="Home" />
            <IconLink to="/money" icon={faWallet} label="Wallet" />
            <IconLink to="/health" icon={faWeightScale} label="Weight" />
          </div>
        </div>

        <div className="text-center text-lg font-bold m-3 bg-gray-200 rounded p-4">
          <div className="flex flex-row justify-between">
            <div>
              Asset
            </div>
            <div>
              <Assets />
            </div>
          </div>
        </div>
        <PersonalIndex />

        <Routes>
          <Route path="/money" element={<Money />} />
          <Route path="/health" element={<Health />} />
        </Routes>

      </BrowserRouter>

    </div >
  );
};

export default App;
