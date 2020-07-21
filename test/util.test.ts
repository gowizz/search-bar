import { expect } from 'chai';
import * as util from '../src/util';

beforeEach(() => {
  localStorage.clear();
});

describe('Util', () => {
  describe('Key in localstorage', () => {
    it('check if key in local storage', () => {
      expect(util.searchTermInLocalStorage('word')).to.eql(false);
      util.addSearchTermToLocalStorage('word');
      expect(util.searchTermInLocalStorage('word')).to.eql(true);

      let object = { timestamp: new Date().setDate(new Date().getDate() - 3) };
      localStorage.setItem('gowiz_search_suggestion_test', JSON.stringify(object));
      expect(util.searchTermInLocalStorage('test')).to.eql(false);
      expect(localStorage.getItem('gowiz_search_suggestion_test')).to.eql(null);

      object = { timestamp: new Date().setDate(new Date().getDate() + 5) };
      localStorage.setItem('gowiz_search_suggestion_test', JSON.stringify(object));
      expect(util.searchTermInLocalStorage('test')).to.eql(true);
    });
    it('add key to local storage', () => {
      util.addSearchTermToLocalStorage('word');
      expect(util.searchTermInLocalStorage('word')).to.eql(true);
      util.addSearchTermToLocalStorage('key');
      util.addSearchTermToLocalStorage('word');
      expect(util.searchTermInLocalStorage('word')).to.eql(true);
      expect(util.searchTermInLocalStorage('play')).to.eql(false);
    });
    it('remove key from local storage', () => {
      util.addSearchTermToLocalStorage('word');
      expect(util.searchTermInLocalStorage('word')).to.eql(true);
      util.removeSearchTermFromLocalStorage('word');
      expect(util.searchTermInLocalStorage('word')).to.eql(false);
    });
    it('previously searched queries', () => {
      let res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(0);
      util.addSearchTermToLocalStorage('word');
      res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(1);
      expect(res).to.eql(['word']);
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
      util.addSearchTermToLocalStorage('word');
      res = util.getSearchTermsInLocalStorage();
      expect(res.length).to.eql(3);
      expect(res).to.eql(['word', 'bord', 'nord']);
    });
  });

  describe('Highlighting', () => {
    it('empty values', () => {
      let highlights = util.getHighlightParts('', '');
      expect(highlights.length).to.eql(0);
      highlights = util.getHighlightParts('test', '');
      expect(highlights.length).to.eql(0);
      highlights = util.getHighlightParts('', 'test');
      expect(highlights.length).to.eql(0);
    });
    it('equal queries', () => {
      let highlights = util.getHighlightParts('test', 'test');
      expect(highlights.length).to.eql(0);
      highlights = util.getHighlightParts('test', 'Test');
      expect(highlights.length).to.eql(0);
      highlights = util.getHighlightParts('test', ' test');
      expect(highlights.length).to.eql(0);
    });
    it('basic highlighting', () => {
      let highlights = util.getHighlightParts('gowiz', 'g');
      expect(highlights.length).to.eql(2);
      expect(highlights).to.eql(['g', 'owiz']);
      highlights = util.getHighlightParts('gowiz', ' g');
      expect(highlights.length).to.eql(2);
      expect(highlights).to.eql(['g', 'owiz']);
    });
  });
});
