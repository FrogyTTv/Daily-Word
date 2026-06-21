import { useState } from "react";
import "./App.css";
import Registration from "./components/registration";
import { Navbar } from "./components/navigation";
import Dashboard from "./components/dashboard";
import Wip from "./components/wip";
import Searchbar from "./components/searchbar";

function App() {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  return (
    <>
      <div className="grid-wrapper">
        <div className="titlebar">
          <div className="logo"></div>
          <Searchbar />
        </div>
        <Navbar currentPage={currentPage} updatePage={setCurrentPage}/>
        <main>
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "notes" && <Wip title={'notes'}/>}
          {currentPage === "registration" && <Registration />}
          {currentPage === "analytics" && <Wip title={'analytics'} />}
          {currentPage === "support" && <Wip title={'support'}/>}
          {currentPage === "settings" && <Wip title={'settings'}/>}
        </main>
      </div>
    </>
  );
}

export default App;
