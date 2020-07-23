import * as util from '../src/util/string_util';

describe('String util', () => {
  it('removing http:// or http:// and www', () => {
    const queries = [
      'https://example.com',
      'https://www.example.com',
      'http://example.com',
      'example.com',
      'example.com/test',
    ];
    const responses = 'example.com';

    for (let i = 0; i < queries.length; i++) {
      let url = queries[i];
      url = util.domain_to_host(url);
      expect(url).toBe(responses);
    }
  });

  it('fully written domains are checked correctly', () => {
    const queries = [
      'https://www.example.com',
      'https://www.example.org',
      'https://www.Example.com',
      'https://www.example.com/',
      'https://www.example.com/test',
    ];
    const response = true;

    for (let i = 0; i < queries.length; i++) {
      let url = queries[i];
      expect(util.url_is_valid(url)).toBe(response);
    }
  });
  it('partially written domains are checked correctly', () => {
    const queries = [
      'https://example.com',
      'https://example.org',
      'https://Example.com',
      'https://www.example.com/',
      'https://www.example.com/test',
      'example.com',
      'example.com/',
      'https://example.com/test',
    ];
    const response = true;

    for (let i = 0; i < queries.length; i++) {
      let url = queries[i];
      expect(util.url_is_valid(url)).toBe(response);
    }
  });
  it('not correct domains are discovered', () => {
    const queries = ['https:/example.com', 'example.', 'example', 'https:/example.com', 'https:example.com'];
    const response = false;

    for (let i = 0; i < queries.length; i++) {
      let url = queries[i];
      expect(util.url_is_valid(url)).toBe(response);
    }
  });
  it('html tags are discovered', () => {
    let queries = [
      '<script>alert("hi")</script>',
      '<b>hi</b>',
      '<p>hi</p>',
      '<span>hi</span>',
      '<html lang="en">hi</html>',
      'hello <b>world</b>>',
    ];
    let response = true;

    for (let i = 0; i < queries.length; i++) {
      let url = queries[i];
      expect(util.string_contains_html_tags(url)).toBe(response);
    }

    queries = ['test', 'World', 'https://example.com'];
    response = false;

    for (let i = 0; i < queries.length; i++) {
      let url = queries[i];
      expect(util.string_contains_html_tags(url)).toBe(response);
    }
  });
});
