import { addSearchTermToLocalStorage } from './storage';
import { fetch_GET, SearchParams } from './request';

export function getQueryAndToken(useCaching: boolean): SearchParams {
  const inputs: HTMLElement | null = document.getElementById('gowiz_searchbox_form');
  if (inputs === null) {
    return {
      query: '',
      token: '',
    };
  }
  const query = inputs['query']['value'];
  const token = inputs['token']['value'];

  if (useCaching) {
    addSearchTermToLocalStorage(query);
  }

  return {
    query: query,
    token: token,
  };
}

export function getAutoCompleteValues(query: string): string[] {
  Promise.resolve(fetchAutoCompleteValues(query)).then(
    function (value) {
      return value.map(function (x) {
        return x['word'];
      });
    },
    function () {
      return [];
    }
  );
  return [];
}

async function fetchAutoCompleteValues(query: string): Promise<string[]> {
  const url = 'https://api.datamuse.com/sug?s=' + query;
  const results = fetch_GET(url, 1);
  return await results;
}

//TODO: save values in local storage (retrive them too)
//TODO: use Gowiz autocomplete service not datamouse
