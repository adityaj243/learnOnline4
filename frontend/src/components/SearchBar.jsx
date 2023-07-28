import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { colors } from "@mui/material";

function SearchBar({ setSearchQuery }) {
  return (
    <form>
      <TextField
        id="search-bar"
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
        }}
        // className="text"
        onInput={(e) => {
          setSearchQuery(e.target.value);
        }}
        // label="Enter your field here..."
        variant="outlined"
        placeholder="Search..."
        size="small"
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: "white" }} />
      </IconButton>
    </form>
  );
}

export default SearchBar;
