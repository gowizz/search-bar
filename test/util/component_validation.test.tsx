import { cleanup } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import * as val from '../../src/util/component_validation';
import { SearchbarOptions, SearchboxOptions } from '../../src/models/model';

describe('Input validation', () => {
  afterEach(cleanup);

  describe('Searchbox', () => {
    const defaultProps: SearchboxOptions = {};

    it('Query is validated correctly', async () => {
      let props: SearchboxOptions = {
        query: '',
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      props = {
        query: 'test',
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      props = {
        query: '<script>alert("hi")</script>',
      };

      expect(() => {
        val.searchbox_has_valid_props(props);
      }).toThrow('<script>alert("hi")</script> is not a valid query as it contains HTML tags');

      props = {
        query: '<b>test</b>',
      };

      expect(() => {
        val.searchbox_has_valid_props(props);
      }).toThrow('<b>test</b> is not a valid query as it contains HTML tags');

      let my_query = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;

      for (let i = 0; i < 2500; i++) {
        my_query += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      props = {
        query: my_query,
      };

      expect(() => {
        val.searchbox_has_valid_props(props);
      }).toThrow('The entered query is too long');

      my_query = '';

      for (let i = 0; i < 2024; i++) {
        my_query += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      props = {
        query: my_query,
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      my_query = '';

      for (let i = 0; i < 2048; i++) {
        my_query += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      props = {
        query: my_query,
      };

      expect(() => {
        val.searchbox_has_valid_props(props);
      }).toThrow('The entered query is too long');

      props = {
        query: my_query,
      };
    });

    it('Placeholder is validated correctly', async () => {
      let props: SearchboxOptions = {
        placeholder: '',
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      props = {
        placeholder: 'Hello',
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      props = {
        placeholder: '<script>alert("hi")</script>',
      };

      expect(() => {
        val.searchbox_has_valid_props(props);
      }).toThrow('<script>alert("hi")</script> is not a valid placeholder as it contains HTML tags');

      props = {
        placeholder: '<b>test</b>',
      };

      expect(() => {
        val.searchbox_has_valid_props(props);
      }).toThrow('<b>test</b> is not a valid placeholder as it contains HTML tags');

      let my_placeholder = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;

      for (let i = 0; i < 2500; i++) {
        my_placeholder += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      props = {
        placeholder: my_placeholder,
      };

      expect(() => {
        val.searchbox_has_valid_props(props);
      }).toThrow('Entered placeholder it too long. Maximum placeholder size is 150 characters');

      my_placeholder = '';

      for (let i = 0; i < 150; i++) {
        my_placeholder += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      props = {
        placeholder: my_placeholder,
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);
    });

    it('Search suggestions are validated correctly', async () => {
      let props: SearchboxOptions = {
        searchSuggestions: [],
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      props = {
        searchSuggestions: ['test'],
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      const queries = [
        [
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '1',
          '2',
          '3',
          '4',
          '5',
          '1',
          '2',
          '3',
          '4',
          '5',
          '1',
          '2',
          '3',
          '4',
          '5',
          '1',
          '2',
          '3',
          '4',
          '5',
        ],
        ['0', '1', '2', '3', '4', undefined],
        ['0', '1', '2', '3', '4', null],
        ['0', '1', '2', '3', '4', ''],
        ['0', '10', '0'],
        ['0', '2', '3', '<p>test</p>'],
        [
          '00',
          '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        ],
        ['', '1', '2', '3', '4', '0'],
      ];
      const responses = [
        'The maximum number of search suggestions can be 25. Currently 26 search suggestions have been given',
        'Search suggestion can not be empty. The 6th search suggestion is empty',
        'Search suggestion can not be empty. The 6th search suggestion is empty',
        'Search suggestion can not be empty. The 6th search suggestion is empty',
        'All search suggestions need to be unique. The first duplicate search suggestion is 0',
        '<p>test</p> is not a valid search suggestion as it contains HTML tags',
        'The 2nd search suggestion is too long. The maximum search suggestion size is 150 characters',
        'Search suggestion can not be empty. The 1st search suggestion is empty',
      ];

      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];

        const response = responses[i];
        props = {
          searchSuggestions: query,
        };
        expect(() => {
          val.searchbox_has_valid_props(props);
        }).toThrow(response);
      }
    });

    it('Search domains are validated correctly', async () => {
      let props: SearchboxOptions = {
        searchDomains: [],
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      props = {
        searchDomains: ['https://example.com'],
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      const queries = [
        [
          'https://example.com',
          'https://example.org',
          'https://example.net',
          'https://example.io',
          'https://example.ai',
          'https://example.co.uk',
          'https://example.ee',
          'https://example.de',
          'https://example.fe',
          'https://example.us',
          'https://example.ru',
        ],
        [
          'https://example.com',
          'https://example.org',
          'https://example.net',
          'https://example.io',
          'https://example.ai',
          undefined,
        ],
        [
          'https://example.com',
          'https://example.org',
          'https://example.net',
          'https://example.io',
          'https://example.ai',
          null,
        ],
        [
          'https://example.com',
          'https://example.org',
          'https://example.net',
          'https://example.io',
          'https://example.ai',
          '',
        ],
        ['https://example.com', 'example', 'https://www.example.com'],
        ['https://example.com', 'https://www.example.com'],
        ['https://example.com', 'https://example.com'],
        ['', 'https://example.com'],
        ['  https://example.org', 'https://example.com'],
      ];
      const responses = [
        'The maximum number of domains search can be restricted to is 10. Currently 11 search domains have been entered',
        'The 6th search domain is empty',
        'The 6th search domain is empty',
        'The 6th search domain is empty',
        'example is not a valid search domain',
        'All search domains need to be unique. The first duplicate search domain is https://www.example.com',
        'All search domains need to be unique. The first duplicate search domain is https://example.com',
        'The 1st search domain is empty',
        'The 1st search domain should be trimmed',
      ];

      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];

        const response = responses[i];
        props = {
          searchDomains: query,
        };
        expect(() => {
          val.searchbox_has_valid_props(props);
        }).toThrow(response);
      }
    });

    it('Max results are validated correctly', async () => {
      let props: SearchboxOptions = {
        maxResults: 3,
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      props = {
        maxResults: 25,
      };

      expect(val.searchbox_has_valid_props(props)).toBe(undefined);

      const queries = [-2, 26];
      const responses = [
        'Maximum results size can not be negative',
        'Maximum results size can not be more than 25. Currently entered max results size is 26',
      ];

      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];

        const response = responses[i];
        props = {
          maxResults: query,
        };
        expect(() => {
          val.searchbox_has_valid_props(props);
        }).toThrow(response);
      }

      let new_props = {
        maxResults: 0,
        searchSuggestions: ['test'],
      };
      expect(() => {
        val.searchbox_has_valid_props(new_props);
      }).toThrow('Maximum results size can not be zero if search suggestions are provided');

      new_props = {
        maxResults: 0,
        searchSuggestions: [],
      };

      expect(val.searchbox_has_valid_props(new_props)).toBe(undefined);
    });

    it('Default props do not cause an error', async () => {
      expect(val.searchbox_has_valid_props(defaultProps)).toBe(undefined);
    });

    it('Valid props do not cause an error', async () => {
      const props: SearchboxOptions = {
        query: 'Testing',
        placeholder: 'Search',
        useCaching: true,
        showInputSearchIcon: true,
        showResultsSearchIcon: true,
        useAutoComplete: true,
        useAutoFocus: true,
        maxResults: 3,
        searchSuggestions: ['testing component'],
        searchDomains: ['testing.org'],
      };
      expect(val.searchbox_has_valid_props(props)).toBe(undefined);
    });
  });

  describe('Searchbar', () => {
    it('API_KEY is validated correctly', async () => {
      const onSubmit = jest.fn();
      let props: SearchbarOptions = {
        onSubmit: onSubmit,
        API_KEY: '1234567891011',
      };

      expect(val.searchbar_has_valid_props(props)).toBe(undefined);

      const queries = [null, undefined, '', 'api key', ' 1234567891011 '];
      const responses = [
        'API_KEY can not be null',
        'API_KEY can not be undefined',
        'API_KEY can not be empty',
        'API_KEY can not be multiple words',
        'API_KEY needs to be trimmed',
      ];

      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];

        const response = responses[i];
        props = {
          onSubmit: onSubmit,
          API_KEY: query,
        };

        expect(() => {
          val.searchbar_has_valid_props(props);
        }).toThrow(response);
      }
    });

    const defaultProps: SearchbarOptions = {
      API_KEY: '1234567891011',
      onSubmit: jest.fn(),
    };

    it('Default props do not cause an error', async () => {
      expect(val.searchbar_has_valid_props(defaultProps)).toBe(undefined);
    });

    it('Valid props do not cause an error', async () => {
      const props: SearchbarOptions = {
        API_KEY: '1234567891011',
        onSubmit: jest.fn(),
        query: 'Testing',
        placeholder: 'Search',
        useCaching: true,
        showInputSearchIcon: true,
        showResultsSearchIcon: true,
        useAutoComplete: true,
        useAutoFocus: true,
        maxResults: 3,
        searchSuggestions: ['testing component'],
        searchDomains: ['testing.org'],
      };
      expect(val.searchbar_has_valid_props(props)).toBe(undefined);
    });
  });
});
