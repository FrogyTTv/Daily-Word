import React from "react";
import SearchIcon from "../assets/search.svg";
import { useRef } from "react";

function Searchbar() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div onClick={() => inputRef.current?.focus()} className="searchbar">
      <img src={SearchIcon} style={{ width: "18px" }} />
      <input
        ref={inputRef}
        style={{
          // flexGrow: 1,
          border: "none",
          backgroundColor: "transparent",
          outline: "none",
          color: "white",
        }}
        // type="search"
        placeholder="Search..."
      />
      <p>⌘ + F</p>
    </div>
  );
}

export default Searchbar;
