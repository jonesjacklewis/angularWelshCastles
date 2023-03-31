import { Component } from '@angular/core';
import { WikidataWelshCastlesService } from '../../services/WikidataWelshCastles/wikidata-welsh-castles.service';
import { Castle } from 'src/app/interfaces/castle';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  allCastles: Castle[] = [];
  castles: Castle[] = [];
  page: number = 1;
  pageSize: number = 10;
  search: string = "";
  items: Castle[] = [];
  excludeImageCastles: boolean = false;
  searchOn: string = "name";
  timeout: any = null;

  constructor(
    private wikidataWelshCastlesService: WikidataWelshCastlesService
  ){
    wikidataWelshCastlesService.getCastles().then((data: Castle[]) => {
      this.allCastles = data;
      this.castles = this.allCastles;
      this.updateDisplayedCastles();
    });
  }

  filterCastles() {
    this.castles = this.allCastles.filter((castle: Castle) => {
      // Filter by search string

      // if name
      if(this.searchOn == "name"){
        if (this.search && !castle.name.toLowerCase().includes(this.search.toLowerCase())) {
          return false;
        }
      }else{
        // if location
        if (this.search && !castle.location.toLowerCase().includes(this.search.toLowerCase())) {
          return false;
        }
      }

      
      // Filter by exclude image castles checkbox
      if (this.excludeImageCastles && castle.image === 'https://openclipart.org/image/800px/231040') {
        return false;
      }
      return true;
    });
    this.updateDisplayedCastles();
  }

  updateDisplayedCastles() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.items = this.castles.slice(startIndex, endIndex);
  }

  searchCastles() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.page = 1;
      this.filterCastles();
    });

  }

  handlePageEvent($event: any) {
    this.page = $event.pageIndex + 1;
    this.updateDisplayedCastles();
  }

  clear() {
    this.page = 1;
    this.search = "";
    this.filterCastles();
  }

  toggleExcludeImageCastles() {
    this.excludeImageCastles = !this.excludeImageCastles;
    this.filterCastles();
  }

  


  
}


