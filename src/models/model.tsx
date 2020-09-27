export interface SearchResult {
  title: string;
  url: string;
  meta?: string;
  favicon?: string;
}

export interface SearchRequest {
  status: SearchRequestResponse;
  duration: number;
  data: SearchResult[];
}

export enum SearchRequestResponse {
  SUCCESS,
  FAILURE,
}
