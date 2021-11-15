import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/context";
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
  const { repos } = useGlobalContext();
  let languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) return total;
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});

  // MOST POPULAR LANGUAGES
  const mostUsedLanguages = Object.values(languages) // from object to array
    .sort((a, b) => b.value - a.value) // return languages with highest value to lowest..
    .slice(0, 6); // return only first 6 lang

  //STARS PER LANGUAGES
  const starsPerLanguage = Object.values(languages)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 6)
    .map((item) => {
      return { ...item, value: item.stars };
    });

  //STARS & FORKS
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { name, stargazers_count, forks } = item;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    { stars: {}, forks: {} }
  );

  const metaValue = (data) => {
    const value = Object.values(data)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    return value;
  };

  // stars
  // or stars = metaValue(stars);
  stars = Object.values(stars).slice(-5).reverse();
  // forks
  forks = metaValue(forks);

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsedLanguages} />
        <Column3D data={stars} />
        <Doughnut2D data={starsPerLanguage} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
