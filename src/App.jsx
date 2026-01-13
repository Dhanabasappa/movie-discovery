import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Wishlist from "./pages/Wishlist";
import Navbar from "./components/Navbar";

function App() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popularity.desc");
  const [filters, setFilters] = useState({
    genre: "",
    rating: "",
    year: "",
  });

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <BrowserRouter>
      <Navbar 
        query={query} 
        setQuery={setQuery}
        onFilterChange={handleFilterChange}
        sort={sort}
        setSort={setSort}
      />
      <Routes>
        <Route 
          path="/" 
          element={<Home query={query} filters={filters} sort={sort} />} 
        />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
