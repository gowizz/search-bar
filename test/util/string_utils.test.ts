import * as util from '../../src/util/string_util';

describe('String util', () => {
  it('removing http:// or http:// and www', async () => {
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

  it('fully written domains are checked correctly', async () => {
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
  it('partially written domains are checked correctly', async () => {
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
  it('not correct domains are discovered', async () => {
    const queries = ['https:/example.com', 'example.', 'example', 'https:/example.com', 'https:example.com'];
    const response = false;

    for (let i = 0; i < queries.length; i++) {
      let url = queries[i];
      expect(util.url_is_valid(url)).toBe(response);
    }
  });
  it('html tags are discovered', async () => {
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

  it('array index are formatted correctly', () => {
    let bad_index = -5;
    expect(() => {
      util.format_index(bad_index);
    }).toThrow('Array index smaller than 0 can not be formatted');

    const index = [1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 100, 101, 102, 103, 104, 105];
    const response = [
      '1st',
      '2nd',
      '3rd',
      '4th',
      '5th',
      '11th',
      '12th',
      '13th',
      '14th',
      '15th',
      '21st',
      '22nd',
      '23rd',
      '24th',
      '25th',
      '100th',
      '101st',
      '102nd',
      '103rd',
      '104th',
      '105th',
    ];

    for (let i = 0; i < index.length; i++) {
      let inn = index[i];
      let res = response[i];
      expect(util.format_index(inn)).toBe(res);
    }
  });
});
