import * as locs from '../src/util/local_storage';

beforeEach(() => {
  localStorage.clear();
});

describe('Localstorage', () => {
  it('check if key in local storage', () => {
    expect(locs.searchTermInLocalStorage('word')).toBe(false);
    /*                               */
    locs.addSearchTermToLocalStorage('word');
    expect(locs.searchTermInLocalStorage('word')).toBe(true);
    /*                               */
    locs.addSearchTermToLocalStorage('nord');
    expect(locs.searchTermInLocalStorage('nord')).toBe(true);
    /*                               */
    let expired_3_days_ago = new Date(new Date().getTime() + performance.now() - 259200000).getTime();
    let current_values = [{ query: 'test', timestamp: expired_3_days_ago }];
    localStorage.setItem('gowiz_search_suggestion', JSON.stringify(current_values));
    expect(locs.searchTermInLocalStorage('test')).toBe(false);
    localStorage.clear();
    /*                               */
    let expires_in_5_days = new Date(new Date().getTime() + performance.now() + 432000000).getTime();
    current_values = [{ query: 'test', timestamp: expires_in_5_days }];
    localStorage.setItem('gowiz_search_suggestion', JSON.stringify(current_values));
    expect(locs.searchTermInLocalStorage('test')).toBe(true);
    /*                               */
    let expired_now = new Date(new Date().getTime()).getTime();
    current_values = [{ query: 'test', timestamp: expired_now }];
    localStorage.setItem('gowiz_search_suggestion', JSON.stringify(current_values));
    expect(locs.searchTermInLocalStorage('test')).toBe(false);
  });
  it('add key to local storage', () => {
    locs.addSearchTermToLocalStorage('word');
    expect(locs.searchTermInLocalStorage('word')).toBe(true);
    /*                               */
    locs.addSearchTermToLocalStorage('key');
    locs.addSearchTermToLocalStorage('word');
    expect(locs.searchTermInLocalStorage('word')).toBe(true);
    expect(locs.searchTermInLocalStorage('play')).toBe(false);
  });
  it('remove key from local storage', () => {
    locs.addSearchTermToLocalStorage('word');
    expect(locs.searchTermInLocalStorage('word')).toBe(true);
    /*                               */
    locs.removeSearchTermFromLocalStorage('word');
    expect(locs.searchTermInLocalStorage('word')).toBe(false);
    /*                               */
    localStorage.setItem('gowiz_search_suggestion', null);
    locs.removeSearchTermFromLocalStorage('word');
    let res = locs.getSearchTermsInLocalStorage();
    expect(res.length).toBe(0);
    expect(res).toStrictEqual([]);
    /*                               */
    const expired_now = new Date(new Date().getTime()).getTime();
    const expires_in_5_days = new Date(new Date().getTime() + performance.now() + 432000000).getTime();
    const current_values = [
      { query: 'test', timestamp: expires_in_5_days },
      { query: 'word', timestamp: expired_now },
    ];
    localStorage.setItem('gowiz_search_suggestion', JSON.stringify(current_values));
    locs.removeSearchTermFromLocalStorage('word');
    res = locs.getSearchTermsInLocalStorage();
    expect(res.length).toBe(1);
    expect(res).toStrictEqual(['test']);
  });
  it('previously searched queries', () => {
    let res = locs.getSearchTermsInLocalStorage();
    expect(res.length).toBe(0);
    /*                               */
    locs.addSearchTermToLocalStorage('word');
    res = locs.getSearchTermsInLocalStorage();
    expect(res.length).toBe(1);
    expect(res).toStrictEqual(['word']);
    /*                               */
    // We need to make things a bit slower
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
      sum += 1;
    }
    locs.addSearchTermToLocalStorage('nord');
    for (let i = 0; i < 100000; i++) {
      sum += 1;
    }
    locs.addSearchTermToLocalStorage('bord');
    res = locs.getSearchTermsInLocalStorage();
    expect(res.length).toBe(3);
    expect(res).toStrictEqual(['bord', 'nord', 'word']);
    /*                               */
    locs.addSearchTermToLocalStorage('word');
    res = locs.getSearchTermsInLocalStorage();
    expect(res.length).toBe(3);
    expect(res).toStrictEqual(['word', 'bord', 'nord']);
    /*                               */
    let expired_3_days_ago = new Date(new Date().getTime() + performance.now() - 259200000).getTime();
    let current_values = [{ query: 'test', timestamp: expired_3_days_ago }];
    localStorage.setItem('gowiz_search_suggestion', JSON.stringify(current_values));
    locs.addSearchTermToLocalStorage('word');
    res = locs.getSearchTermsInLocalStorage();
    expect(res.length).toBe(1);
    expect(res).toStrictEqual(['word']);
  });
  it('can handle multiple key types', () => {
    let res = locs.getSearchTermsInLocalStorage();
    expect(res.length).toBe(0);
    /*                               */
    localStorage.setItem('other_key', '');
    res = locs.getSearchTermsInLocalStorage();
    expect(res.length).toBe(0);
  });
});
