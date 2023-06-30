export type SearchDTO = {
  name: string;
};

export type AddOrRemoveFavoriteHeroDto = {
  userId: string;
  heroId: number;
  name: string;
  description: string;
};

export type HeroesResponse = {
  offset: number;
  total: number;
  heroes: heroesDto[];
};

export type heroesDto = {
  id: number;
  name: string;
  description: string;
};
