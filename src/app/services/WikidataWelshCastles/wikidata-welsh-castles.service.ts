import { Injectable } from '@angular/core';
import { Castle } from 'src/app/interfaces/castle';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class WikidataWelshCastlesService {

  castles: Castle[] = [];
  query: string = `SELECT DISTINCT ?item ?itemLabel ?locationLabel ?image WHERE {
    ?item wdt:P31 wd:Q23413 .
    ?item wdt:P4141|wdt:P2966 ?id .
    FILTER (REGEX(lcase(?id), "welsh") || EXISTS { ?item wdt:P2966 [] }).
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    OPTIONAL { ?item wdt:P131 ?location. }
    OPTIONAL { ?item wdt:P276 ?location. }
    OPTIONAL { ?item wdt:P18 ?image. }
    FILTER (BOUND(?location))
  }`;
  url: string = "https://query.wikidata.org/sparql";

  params = new URLSearchParams({
    format: "json",
    query: this.query
  });

  constructor() { }

  getCastles(): Promise<Castle[]> {
    this.castles = [];

    // get castlesRetrievalTimestamp from localstorage if not exists get epoch timestamp
    let castlesRetrievalTimestamp = localStorage.getItem("castlesRetrievalTimestamp") ?? moment(0).format();

    // if castlesRetrievalTimestamp is less than 1 day ago and castles exists in localstorage
    if (moment(castlesRetrievalTimestamp).isAfter(moment().subtract(1, "days")) && localStorage.getItem("castles")) {
      this.castles = JSON.parse(localStorage.getItem("castles") ?? "[]");
      return Promise.resolve(this.castles);
    } else {
      return fetch(`${this.url}?${this.params}`)
        .then(result => result.json())
        .then(data => {
          for (let item of data.results.bindings) {
            let name = item.itemLabel.value;
            let location = item.locationLabel.value;
            let image = undefined;

            if ("image" in item) {
              image = item.image.value;
            } else {
              image = `https://openclipart.org/image/800px/231040`;
            }

            let castle: Castle = {
              name: name,
              location: location,
              image: image
            };

            this.castles.push(castle);
          }
          localStorage.setItem("castles", JSON.stringify(this.castles));
          localStorage.setItem("castlesRetrievalTimestamp", moment().format());
          return this.castles;
        }

        );
    }
  }


  }
