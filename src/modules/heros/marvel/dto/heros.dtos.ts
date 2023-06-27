export type SearchDTO = {
  name: string;
};

export type AddOrRemoveFavoriteHeroDto = {
  userId: string;
  heroId: number;
  name: string;
  description: string;
};
