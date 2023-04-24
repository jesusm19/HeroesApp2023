export interface Hero {
    id: string;
    superhero: string;
    plublisher: Publisher;
    alter_ego: string;
    first_appearance: string;
    characters: string;
}

export enum Publisher {
    DCComics = "DC Comics",
    MarvelComics = "Marvel Comics"
}