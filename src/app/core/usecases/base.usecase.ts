import { Observable } from 'rxjs';

export abstract class BaseUsecase<P, R> {
  abstract call(param?: P): Observable<R>;
}
