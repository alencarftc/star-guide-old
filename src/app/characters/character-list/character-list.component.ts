import { Component, OnInit } from '@angular/core';
import { CharacterService } from 'src/app/core/services/character.service';
import CharacterModel from 'src/app/core/models/character.model';
import { PageableModel } from 'src/app/core/models/pageable.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityEnum } from 'src/app/core/models/entity.enum';
import { UtilService } from 'src/app/core/util.service';
import RouteInterface from 'src/app/core/interfaces/route.interface';

@Component({
  selector: 'sw-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit, RouteInterface {
  private readonly actualEntity: EntityEnum = EntityEnum.CHARACTER;
  private searchValue: string = null;
  private characters: CharacterModel[] = [];
  private pageable: PageableModel;

  constructor(private activatedRoute: ActivatedRoute, 
    private router: Router,
    private utilService: UtilService,
    private characterService: CharacterService) {

    this.pageable = { next: null, previous: null, page: 1 }
  }

  ngOnInit() {
    const response = this.activatedRoute.snapshot.parent.data['characters'];

    this.characters = response.results;
    this.pageable.next = response.next;
    this.pageable.previous = response.previous;
    this.characterService.savePage(this.characters, this.pageable.page);
  }

  request(){
    const characters = this.characterService.getPage(this.pageable.page);

    if( characters.length > 0 ){
      this.characters = characters;
    }
    else {
      this.update()
    }
  }

  search(value: string){
    this.searchValue = value;
    this.characterService
      .search(value, this.actualEntity)
      .subscribe(response => {
        this.characters = response.results;
        this.pageable.next = response.next;
        this.pageable.previous = response.previous;
        this.pageable.page = 1; 
      });
  }

  update(){
    this.characterService.requestPage(this.pageable.page, this.searchValue).subscribe(response => {
      this.characters = response.results;
      this.pageable.next = response.next;
      this.pageable.previous = response.previous;      

      if( !this.searchValue ){
        this.characterService.savePage(response.results, this.pageable.page);
      }
    });
  }

  getImage(url: string){
    return this.utilService.getEntityImage(url, this.actualEntity);
  }
  
  getId(character: CharacterModel){
    return this.utilService.getEntityId(character.url);
  }

  goToDetail(position: number){
    const character = this.characters[position];
    this.characterService.character = character;
    this.router.navigate(['characters', this.getId(character)]);
  }
}