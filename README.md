# Gowiz searchbar ![GitHub license](https://img.shields.io/badge/license-UNLICENSED-blue.svg)[![Actions Status](https://github.com/gowizz/SearchBar/workflows/Searchbar%20CI/badge.svg)](https://github.com/gowizz/SearchBar/actions)[![npm version](https://badge.fury.io/js/%40gowiz%2Fsearchbar.svg)](https://badge.fury.io/js/%40gowiz%2Fsearchbar)

Gowiz search bars are highly customisable powerful components that can enhance your page experience and that respect the privacy of your users.

## Getting started

```bash
   npm install @gowiz/searchbar
```

After that the following components will be available

```javascript
// CommonJS
const { Searchbox, GowizSearchBar } = require('@gowiz/searchbar');

// ES6
import { Searchbox, GowizSearchBar } from '@gowiz/searchbar';
```

## Components

### Search box

This component allows you to create a fully functional search bar that forwards the query to the Gowiz search engine.
By default this component does not require any properties and it renders as follows.

![Searchbox](https://res.cloudinary.com/dl7zea2jd/image/upload/v1595520606/Gowiz/Github/ToGowizDefaultSearchBar_y3oowk.png)

The search bar is highly customizable and the following properties can be set.

| Name                  | Description                                               | Default | Restrictions            |
| --------------------- | --------------------------------------------------------- | ------- | ----------------------- |
| query                 | a query that will be set as the initial input value       |         | 0 < x < 2024 characters |
| placeholder           | a placeholder that will be showed when input is empty     |         | 0 < x < 150 characters  |
| useCaching            | specify if typed searches should be saved in the cache    | true    |                         |
| showInputSearchIcon   | specify if the search icon is displayed next to the input | true    |                         |
| showResultsSearchIcon | specify if search icon is displayed next to suggestions   | true    |                         |
| useAutoComplete       | specify if Gowiz autocomplete is used                     | true    |                         |
| useAutoFocus          | specify if the search bar is focused                      | false   |                         |
| useDarkTheme          | specify if the search bar is shown in dark theme          | false   |                         |
| maxResults            | number of search suggestions that will be shown           | 10      | 0 < x < 25              |
| searchSuggestions     | predefined search suggestions                             | []      | 0 < x < 25 suggestions  |
| searchDomains         | predefined domains the results are restricted to          | []      | 0 < x < domains         |

Many applications require components in dark mode and with a single property the searchbox renders in dark theme

![Dark Searchbox](https://res.cloudinary.com/dl7zea2jd/image/upload/v1595873370/Gowiz/Github/DarkThemeSearchbox_dkl935.png)


#### Auto complete

The search bar has an autocomplete functionality that attempts to predict the next query.

```javascript
import { Searchbox } from '@gowiz/searchbar';

const search_box = (
  <Searchbox
    query={'mars'}
    searchSuggestions={[
      'mars',
      'marshal',
      'marshall',
      'marsh',
      'marshmallow',
      'marsupial',
      'marsala',
      'marshalling',
      'marseille',
      'marshy',
    ]}
  />
);
```

The characters that the users would want to type next are set to bold

![Search bar with suggestions](https://res.cloudinary.com/dl7zea2jd/image/upload/v1595526793/Gowiz/Github/ToGowizSearchbarWithSuggestions_uqtfw9.png)

#### Actions

Actions allow the user to perform certain actions faster by utilizing the keyboard.

| Key           | Action                                                                          |
| ------------- | ------------------------------------------------------------------------------- |
| Enter         | Triggers the search with the current input query                                |
| Tab           | Navigate through search results, clear search field, remove search from history |
| Esc           | Closes the suggestions list                                                     |
| Up/Down arrow | Changes the current query by selecting the previous/next search suggestion      |

### Search bar

This component is accessible, but it has no legit functionality.
