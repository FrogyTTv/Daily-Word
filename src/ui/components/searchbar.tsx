import SearchIcon from "../assets/search.svg";
import { useEffect, useRef } from "react";

function Searchbar() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = window.api.onFocusSearch(() => {
      inputRef.current?.focus();
    });
    return unsubscribe;
  }, []);
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
