import React, { useState, useEffect } from "react";
import { getDocument } from "../../api/api";

const PaginationScrollView = ({
  id,
  searchDocumentName,
  searchDocumenttype,
  limit,
  renderData,
}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (isLoading) {
      return; // Prevent multiple API calls while loading
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getDocument(
        id,
        searchDocumentName,
        searchDocumenttype,
        currentPage,
        limit
      );

      if (response.data.length === 0) {
        // No more data available
        setIsLoading(false);
        return;
      }
      setData(response.data);
      // setData((prevData) => [...prevData, ...response.data]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchData();
  };

  return (
    <div style={{ height: "400px", overflow: "auto" }}>
      {data.map((item) => renderData(item))}

      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <button onClick={handleLoadMore} disabled={isLoading}>
          Load More
        </button>
      )}
    </div>
  );
};

export default PaginationScrollView;
