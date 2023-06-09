import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

    private baseUrl: string = environments.baseUrl;

    constructor(private http: HttpClient) { }

    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
    }

    getHeroById(idHeroe: string): Observable<Hero | undefined> {
        return this.http.get<Hero>(`${this.baseUrl}/heroes/${idHeroe}`)
            .pipe(
                catchError(error => of(undefined))
            );
    }

    getSuggestions(query: string): Observable<Hero[]> {
        return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limits=6`);
    }

    addHero(hero: Hero): Observable<Hero>{
        return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
    }
    
    updateHero(hero: Hero): Observable<Hero>{
        if(!hero.id) throw Error("id es requerido")
        return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
    }

    deleteHeroById(id: string): Observable<boolean>{
        if(!id) throw Error("id es requerido")
        return this.http.delete(`${this.baseUrl}/heroes/${id}`)
            .pipe(
                map( response => true),
                catchError(error => of(false)),
            );
    }
}