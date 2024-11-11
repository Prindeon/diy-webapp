import React, { useState } from 'react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onSearch(query);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search posts by title or tags..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
            />
        </div>
    );
}

export default SearchBar;