import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import MovieModel from '../models/movie.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import MovieService from '../services/movie.service';

@Injectable({ providedIn: 'root' })
export class MovieResolver implements Resolve<MovieModel> {
    constructor(private movieService: MovieService){}

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot) : Observable<MovieModel[]> | Promise<any> | any {
        return this.movieService.requestMovies().pipe(
            map((movies: any) => this.movieService.sortByEpisodeId(movies.results))
        );
    }
}