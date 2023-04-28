import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', {nonNullable:true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id:'DC Comics', desc: 'DC - Comics' },
    { id:'Marvel Comics', desc: 'Marvel - Comics' }
  ]

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ){}
  
  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroById(id))
      ).subscribe( hero => {
        if(!hero) return this.router.navigateByUrl('/')

        this.heroForm.reset( hero)
        return;
      });

  }

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(){
    if(!this.heroForm.valid) return;

    if(this.currentHero.id){
      this.updateHero();
      return;
    } 

    this.saveHero()
    
  }

  saveHero(): void {
    this.heroesService.addHero(this.currentHero).subscribe({
      next: hero => {
        this.router.navigate(['/heroes/edit/', hero.id])
        this.showSnackbar(`${hero.superhero} creado!`);
        console.log(hero);
      }
    });
  }

  updateHero(): void {
    this.heroesService.updateHero(this.currentHero).subscribe({
      next: hero => {
        this.showSnackbar(`${hero.superhero} actualizado!`);
        console.log(hero);
      }
    });
  }

  showSnackbar( message: string): void {
    this.snackbar.open(message, 'ok', { duration: 2500})
  }

  onDeleteHero(): void {
    if(!this.currentHero.id) throw Error('id requerido');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

   /* dialogRef.afterClosed().subscribe(
      result => {
        if(!result) return;

        this.heroesService.deleteHeroById(this.currentHero.id).subscribe({
          next: result => {
            if(!result) return;
            this.router.navigate(['/heroes/list']);
          }
        });
        
      }
    );*/

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result ),
        switchMap( () => this.heroesService.deleteHeroById(this.currentHero.id) ),
        filter((wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(
        () => {
          this.router.navigate(['/heroes/list']);
        }
      );
  }

}
