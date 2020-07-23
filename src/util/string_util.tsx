export function reformatQueryForSearch(query: string): string {
  query = query.trim();
  //query = escape(query);
  //TODO: we should do some more stuff here
  return query;
}
export function reformat_url(base: string, query: string): string {
  return base + encodeURIComponent(reformatQueryForSearch(query));
}

export function url_is_valid(domain: string): boolean {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(domain);
}
export function domain_to_host(domain: string): string {
  return domain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
}

export function string_contains_html_tags(str: string): boolean {
  const pattern = new RegExp(/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/, 'i'); // fragment locator
  return !!pattern.test(str);
}
