import React from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth0();
  return (
    <Wrapper>
      {isAuthenticated && user && user.picture && (
        <img src={user.picture} alt={user.name} />
      )}
      {isAuthenticated && user && user.name && (
        <h4>
          welcome, <strong>{user.name}</strong>
        </h4>
      )}
      {isAuthenticated && (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </button>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  padding: 1.5rem;
  margin-bottom: 4rem;
  background: var(--clr-body);
  text-align: center;
  display: grid;
  grid-template-columns: auto auto 100px;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  border-bottom: 2px solid var(--clr-secondary);
  h4 {
    margin-bottom: 0;
    font-weight: 400;
  }
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
  }
  button {
    background: transparent;
    border: transparent;
    font-size: 1.2rem;
    text-transform: capitalize;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-5);
    cursor: pointer;
  }
`;

export default Navbar;
