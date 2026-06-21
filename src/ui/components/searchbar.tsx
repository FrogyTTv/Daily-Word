import React from "react";
import SearchIcon from "../assets/search.svg";

function Searchbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: "16rem",
        maxWidth: "25rem",
        gap: "0.6rem",
      }}
      className="searchbar"
    >
      <img src={SearchIcon} style={{ width: "18px" }} />
      <input
        style={{ flexGrow: 1, border: "none", backgroundColor: "inherit" }}
        type="search"
        placeholder="Search..."
      />
      <p>⌘ + F</p>
    </div>
  );
}

export default Searchbar;
