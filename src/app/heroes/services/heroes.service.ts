import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { catchError, Observable, of } from 'rxjs';
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
    
}