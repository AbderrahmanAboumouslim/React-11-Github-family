import React, { useState, useEffect, useContext } from "react";

import axios from "axios";

const rootUrl = "https://api.github.com/";

const ContextAPP = React.createContext();

const ContextProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState("");
  const [repos, setRepos] = useState("");
  const [followers, setFollowers] = useState("");

  // request loading
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);

  // error
  const [error, setError] = useState({ show: false, message: "" });

  // check how many requests left

  const checkRequests = () => {
    axios(`${rootUrl}rate_limit`)
      .then(
        ({
          data: {
            rate: { remaining },
          },
        }) => {
          setRequests(remaining);
          if (remaining === 0) {
            generateError(
              true,
              "Oops ! You have no requests left. please come back later(60 min)"
            );
          }
        }
      )
      .catch((err) => console.error(err));
  };

  const generateError = (show = false, message = "") => {
    return setError({ show, message });
  };

  // search for user
  const findGithubUser = async (user) => {
    setLoading(true);
    const data = await axios(`${rootUrl}users/${user}`).catch((err) =>
      console.error(err)
    );
    if (data) {
      generateError();
      setGithubUser(data.data);
      const { followers_url, repos_url } = data.data;

      await Promise.allSettled([
        axios(`${followers_url}?per_page=100`),
        axios(`${repos_url}?per_page=100`),
      ])
        .then((results) => {
          const [followers, repos] = results;
          if (followers.status === "fulfilled") {
            setFollowers(followers.value.data);
          }
          if (repos.status === "fulfilled") {
            setRepos(repos.value.data);
          }
        })
        .catch((err) => console.error(err));
    } else {
      generateError(true, "this user does not exist");
    }
    checkRequests();
    setLoading(false);
  };

  useEffect(checkRequests, []);
  useEffect(() => {
    findGithubUser("google");
  }, []);
  return (
    <ContextAPP.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        findGithubUser,
        loading,
      }}
    >
      {children}
    </ContextAPP.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(ContextAPP);
};

export { ContextProvider, useGlobalContext };
