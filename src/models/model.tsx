export interface SearchResult {
  title: string;
  url: string;
  meta?: string;
  favicon?: string;
}

export interface InputProps {
  query?: string;
  placeholder?: string;
  onChange: (e: any) => void;
  onCancel: (e: any) => void;
  showInputSearchIcon?: boolean;
  useAutoFocus?: boolean;
  useDarkTheme?: boolean;
}

export interface ResultsProps {
  query: string;
  onSelect: (event: any) => void;
  onClick: (str: string) => void;
  onRemove: (str: string) => void;
  results: string[];
  showResultsSearchIcon: boolean;
  useCashing: boolean;
  useDarkTheme: boolean;
  hasSearched: boolean;
  maxResults: number;
}

export interface SearchboxOptions {
  query?: string;
  placeholder?: string;
  useCaching?: boolean;
  showInputSearchIcon?: boolean;
  showResultsSearchIcon?: boolean;
  useAutoComplete?: boolean;
  useDarkTheme?: boolean;
  useAutoFocus?: boolean;
  maxResults?: number;
  searchSuggestions?: string[];
  searchDomains?: string[];
}

export interface SearchbarOptions {
  onSubmit: (results: SearchResult[]) => void;
  API_KEY: string;
  query?: string;
  placeholder?: string;
  useCaching?: boolean;
  showInputSearchIcon?: boolean;
  showResultsSearchIcon?: boolean;
  useAutoComplete?: boolean;
  useAutoFocus?: boolean;
  maxResults?: number;
  searchSuggestions?: string[];
  searchDomains?: string[];
}
