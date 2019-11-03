import { fromEvent, EMPTY } from "rxjs"
import { map, debounceTime, distinctUntilChanged, switchMap, mergeMap, catchError, filter, tap } from "rxjs/operators"
import { ajax } from "rxjs/ajax"

const url = "https://api.github.com/search/users?q="

const search = document.getElementById('search');
const result = document.getElementById('result');

const stream$ = fromEvent(search, 'input').pipe(
  map((event) => event.target.value),
  debounceTime(1000),
  distinctUntilChanged(),
  tap(() => result.innerHTML = null),
  filter((val) => val),
  switchMap((v) => ajax.getJSON(url + v).pipe(
    catchError(err => EMPTY)
  )),
  map((res) => res.items),
  mergeMap((items) => items)
)

stream$.subscribe((user) => {
  const html = `<div class="card">
<div class="card-image">
  <img src="${user.avatar_url}" alt="">
  <span class="card-title">${user.login}</span>
</div>
<div class="card-action">
  <a href="${user.html_url}" target="blank">Open Github</a>
</div>
</div>`

  result.insertAdjacentHTML('beforeend', html);

}
)
