import { expect } from 'chai';
import * as util from '../src/util';

beforeEach(() => {
  localStorage.clear();
});

describe('Util', () => {
  describe('Key in localstorage', () => {
    it('check if key in local storage', () => {
      expect(util.searchTermInLocalStorage('word')).to.eql(false);
      /*                               */
      util.addSearchTermToLocalStorage('word');
      expect(util.searchTermInLocalStorage('word')).to.eql(true);
      /*                               */
      util.addSearchTermToLocalStorage('nord');
      expect(util.searchTermInLocalStorage('nord')).to.eql(true);
      /*                               */
      let expired_3_days_ago = new Date(new Date().getTime() + performance.now() - 259200000).getTime();
      let current_values = [{ query: 'test', timestamp: expired_3_days_ago }];
      localStorage.setItem('gowiz_search_suggestion', JSON.stringify(current_values));
      expect(util.searchTermInLocalStorage('test')).to.eql(false);
      localStorage.clear();
      /*                               */
      let expires_in_5_days = new Date(new Date().getTime() + performance.now() + 432000000).getTime();
      current_values = [{ query: 'test', timestamp: expires_in_5_days }];
      localStorage.setItem('gowiz_search_suggestion', JSON.stringify(current_values));
      expect(util.searchTermInLocalStorage('test')).to.eql(true);
      /*                               */
      let expired_now = new Date(new Date().getTime()).getTime();
      current_values = [{ query: 'test', timestamp: expired_now }];
      localStorage.setItem('gowiz_search_suggestion', JSON.stringify(current_values));
      expect(util.searchTermInLocalStorage('test')).to.eql(false);
    });
    it('add key to local storage', () => {
      util.addSearchTermToLocalStorage('word');
      expect(util.searchTermInLocalStorage('word')).to.eql(true);
      /*                               */
      util.addSearchTermToLocalStorage('key');
      util.addSearchTermToLocalStorage('word');
      expect(util.searchTermInLocalStorage('word')).to.eql(true);
      expect(util.searchTermInLocalStorage('play')).to.eql(false);
    });
    it('remove key from local storage', () => {
      util.addSearchTermToLocalStorage('word');
      expect(util.searchTermInLocalStorage('word')).to.eql(true);
      /*                               */
      util.removeSearchTermFromLocalStorage('word');
      expect(util.searchTermInLocalStorage('word')).to.eql(false);
      /*                               */
      localStorage.setItem('gowiz_search_suggestion', null);
      util.removeSearchTermFromLocalStorage('word');
      let res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(0);
      expect(res).to.eql([]);
      /*                               */
      const expired_now = new Date(new Date().getTime()).getTime();
      const expires_in_5_days = new Date(new Date().getTime() + performance.now() + 432000000).getTime();
      const current_values = [
        { query: 'test', timestamp: expires_in_5_days },
        { query: 'word', timestamp: expired_now },
      ];
      localStorage.setItem('gowiz_search_suggestion', JSON.stringify(current_values));
      util.removeSearchTermFromLocalStorage('word');
      res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(1);
      expect(res).to.eql(['test']);
    });
    it('previously searched queries', () => {
      let res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(0);
      /*                               */
      util.addSearchTermToLocalStorage('word');
      res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(1);
      expect(res).to.eql(['word']);
      /*                               */
      // We need to make things a bit slower
      let sum = 0;
      for (let i = 0; i < 100000; i++) {
        sum += 1;
      }
      util.addSearchTermToLocalStorage('nord');
      for (let i = 0; i < 100000; i++) {
        sum += 1;
      }
      util.addSearchTermToLocalStorage('bord');
      res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(3);
      expect(res).to.eql(['bord', 'nord', 'word']);
      /*                               */
      util.addSearchTermToLocalStorage('word');
      res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(3);
      expect(res).to.eql(['word', 'bord', 'nord']);
      /*                               */
      let expired_3_days_ago = new Date(new Date().getTime() + performance.now() - 259200000).getTime();
      let current_values = [{ query: 'test', timestamp: expired_3_days_ago }];
      localStorage.setItem('gowiz_search_suggestion', JSON.stringify(current_values));
      util.addSearchTermToLocalStorage('word');
      res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(1);
      expect(res).to.eql(['word']);
    });
    it('can handle multiple key types', () => {
      let res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(0);
      /*                               */
      localStorage.setItem('other_key', '');
      res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(0);
    });
  });

  describe('Highlighting', () => {
    it('empty values', () => {
      let highlights = util.getHighlightParts('', '');
      expect(highlights.length).to.eql(0);
      highlights = util.getHighlightParts(undefined, '');
      expect(highlights.length).to.eql(0);
      /*                               */
      highlights = util.getHighlightParts('test', '');
      expect(highlights.length).to.eql(0);
      /*                               */
      highlights = util.getHighlightParts('', 'test');
      expect(highlights.length).to.eql(0);
    });
    it('equal queries', () => {
      let highlights = util.getHighlightParts('test', 'test');
      expect(highlights.length).to.eql(0);
      /*                               */
      highlights = util.getHighlightParts('test', 'Test');
      expect(highlights.length).to.eql(0);
      /*                               */
      highlights = util.getHighlightParts('test', ' test');
      expect(highlights.length).to.eql(0);
    });
    it('basic highlighting', () => {
      let highlights = util.getHighlightParts('gowiz', 'g');
      expect(highlights.length).to.eql(2);
      expect(highlights).to.eql(['g', 'owiz']);
      /*                                 */
      highlights = util.getHighlightParts('gowiz', ' g');
      expect(highlights.length).to.eql(2);
      expect(highlights).to.eql(['g', 'owiz']);
    });
  });
});
