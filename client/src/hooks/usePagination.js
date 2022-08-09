import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
const usePagination = (
  page = 1,
  collectionName,
  route,
  parameters, // Route parameters, excluding page
  dependencies = [] // Dependencies to trigger result gathering, excluding page state
) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  let deleteResult = (_id) => {
    setResults(results.filter(entry => {
      return entry._id != _id;
    }));
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setIsLoading(true);
    setIsError(false);
    setError({});
    let params = Object.assign({}, parameters, {
      page,
      cursor: page > 1 ? results[results.length - 1].createdAt : ''
    });
    let fetchPage = async () => {
      try {
        let response = await axiosPrivate.get(route, {
          params,
        });
        if (!response) {
          setIsError(true);
          setError({
            message: "No response from server",
          });
          setHasNextPage(Boolean(false));
        }
        if (response?.status === 200 && isMounted) {
          setResults((prev) => [
            ...prev,
            ...response?.data?.data?.[collectionName],
          ]);
          setHasNextPage(
            response?.data?.data?.[collectionName]?.length < 15 ? false : true
          );
        } else if (response?.status == 204 && isMounted) {
          setHasNextPage(false);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        setError({
          message: error.message,
        });
      }
    };

    fetchPage();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, ...dependencies]);

  return {
    isLoading,
    isError,
    error,
    results,
    hasNextPage,
    setResults,
    setIsLoading,
    deleteResult
  };
};

export default usePagination;
