import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})
export class SearchPageComponent implements OnInit{
  
  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero?:  Hero;

  ngOnInit(): void {
    
  }

  constructor(private heroesService: HeroesService){}

  searchHero(): void {
    const value: string = this.searchInput.value || '';
    if(!value){
      this.heroes = [];
      return;
    } 
      

    this.heroesService.getSuggestions(value).subscribe(
      {
        next: response => {
          this.heroes = response;          
        }
      }
    )
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent):void {
    if(!event.option.value) {
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);
    this.selectedHero = hero;


  }

}
