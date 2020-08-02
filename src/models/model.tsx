export interface SearchResult {
  title: string;
  url: string;
  meta?: string;
  favicon?: string;
}

export interface SearchRequest {
  status: string;
  duration: number;
  data: SearchResult[];
}
