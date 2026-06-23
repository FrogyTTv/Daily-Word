import { useState, useEffect } from "react";
import "./App.css";
import Registration from "./components/registration";
import { Navbar } from "./components/navigation";
import Dashboard from "./components/dashboard";
import Wip from "./components/wip";
import Searchbar from "./components/searchbar";

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return sessionStorage.getItem("currentPage") || "dashboard";
  });

  useEffect(() => {
    sessionStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    const unsubscribe = window.api.onNavigate((page) => setCurrentPage(page));
    return unsubscribe;
  }, []);

  return (
    <>
      <div className="grid-wrapper">
        <div className="titlebar">
          <Searchbar />
          {/* <div className="logo"></div> */}
        </div>
        <Navbar currentPage={currentPage} updatePage={setCurrentPage} />
        <main>
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "notes" && <Wip title={"notes"} />}
          {currentPage === "registration" && <Registration />}
          {currentPage === "analytics" && <Wip title={"analytics"} />}
          {currentPage === "support" && <Wip title={"support"} />}
          {currentPage === "settings" && <Wip title={"settings"} />}
        </main>
      </div>
    </>
  );
}

export default App;
