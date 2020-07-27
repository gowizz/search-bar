import * as req from '../../src/util/request';
import * as locs from '../../src/util/storage';

describe('Request', () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    window.location = {
      replace: jest.fn(),
    };
  });

  afterAll(() => {
    window.location = location;
  });

  it('no request with empty queries', async () => {
    const queries = ['', ' '];
    const token = locs.generateInputSessionToken();
    for (let i = 0; i < queries.length; i++) {
      jest.clearAllMocks();
      req.goToGowiz(queries[i], token);
      expect(window.location.replace).toHaveBeenCalledTimes(0);
    }
  });

  it('valid query should trigger a request', async () => {
    const queries = ['test', 'Test', 'testing'];
    const responses = [
      'https://gowiz.eu/search/test',
      'https://gowiz.eu/search/Test',
      'https://gowiz.eu/search/testing',
    ];

    for (let i = 0; i < queries.length; i++) {
      const token = locs.generateInputSessionToken();
      jest.clearAllMocks();
      req.goToGowiz(queries[i], token);
      expect(window.location.replace).toHaveBeenCalledTimes(1);
      expect(window.location.replace).toHaveBeenCalledWith(responses[i]);
    }
  });
  it('query can be  a webaddress', async () => {
    const queries = ['example.com', 'https://example.com', 'https://www.example.com'];
    const responses = [
      'https://gowiz.eu/search/example.com',
      'https://gowiz.eu/search/https%3A%2F%2Fexample.com',
      'https://gowiz.eu/search/https%3A%2F%2Fwww.example.com',
    ];

    for (let i = 0; i < queries.length; i++) {
      const token = locs.generateInputSessionToken();
      jest.clearAllMocks();
      req.goToGowiz(queries[i], token);
      expect(window.location.replace).toHaveBeenCalledTimes(1);
      expect(window.location.replace).toHaveBeenCalledWith(responses[i]);
    }
  });

  it('search can be restricted to pre defined domains', async () => {
    const queries = ['test', 'test'];
    const pre_domains = [['https://example.com'], ['https://example.com', 'example.com', 'wwww.example.org']];
    const responses = [
      'https://gowiz.eu/search/test%20site%3Aexample.com',
      'https://gowiz.eu/search/test%20site%3Aexample.com%2Cwwww.example.org',
    ];

    for (let i = 0; i < queries.length; i++) {
      const token = locs.generateInputSessionToken();
      jest.clearAllMocks();
      req.goToGowiz(queries[i], token, pre_domains[i]);
      expect(window.location.replace).toHaveBeenCalledTimes(1);
      expect(window.location.replace).toHaveBeenCalledWith(responses[i]);
    }
  });

  it('query can contain search domains', async () => {
    // query, response
    const dict = {
      'test site:example.com': 'https://gowiz.eu/search/test%20site%3Aexample.com',
      'test site:': 'https://gowiz.eu/search/test',
      'test site': 'https://gowiz.eu/search/test%20site',
      'test site:word': 'https://gowiz.eu/search/test',
      'test site:example.com site:': 'https://gowiz.eu/search/test%20site%3Aexample.com',
      'test site:example.com site': 'https://gowiz.eu/search/test%20site%20site%3Aexample.com',
      'test site:example.com site:example.org': 'https://gowiz.eu/search/test%20site%3Aexample.org%2Cexample.com',
      'test site:example.com site:http://example.com': 'https://gowiz.eu/search/test%20site%3Aexample.com',
      'test Site:example.com': 'https://gowiz.eu/search/test%20site%3Aexample.com',
      'test site:http:example.com': 'https://gowiz.eu/search/test',
      'a message site:example.com from me': 'https://gowiz.eu/search/a%20message%20from%20me%20site%3Aexample.com',
    };

    for (const query in dict) {
      const token = locs.generateInputSessionToken();
      const response = dict[query];
      jest.clearAllMocks();
      req.goToGowiz(query, token);
      expect(window.location.replace).toHaveBeenCalledTimes(1);
      expect(window.location.replace).toHaveBeenCalledWith(response);
    }
  });

  it('query and predefined domains are merged correctly', async () => {
    const queries = [
      'test site:example.org',
      'test site:example.com',
      'test site:www.example.com',
      'test site:http://www.example.com',
    ];
    const pre_domains = [
      ['https://example.com'],
      ['https://example.com'],
      ['https://example.com'],
      ['https://example.com'],
    ];
    const responses = [
      'https://gowiz.eu/search/test%20site%3Aexample.org%2Cexample.com',
      'https://gowiz.eu/search/test%20site%3Aexample.com',
      'https://gowiz.eu/search/test%20site%3Aexample.com',
      'https://gowiz.eu/search/test%20site%3Aexample.com',
    ];

    for (let i = 0; i < queries.length; i++) {
      const token = locs.generateInputSessionToken();
      jest.clearAllMocks();
      req.goToGowiz(queries[i], token, pre_domains[i]);
      expect(window.location.replace).toHaveBeenCalledTimes(1);
      expect(window.location.replace).toHaveBeenCalledWith(responses[i]);
    }
  });

  it('query does not have to be in english', async () => {
    jest.clearAllMocks();
    const all_queries = [
      {
        hello: 'Welcome!',
      },
      {
        hello: 'hallo',
      },
      {
        hello: 'Përshëndetje',
      },
      {
        hello: 'ሰላም',
      },
      {
        hello: 'مرحبا',
      },
      {
        hello: 'Բարեւ',
      },
      {
        hello: 'Salam',
      },
      {
        hello: 'Kaixo',
      },
      {
        hello: 'добры дзень',
      },
      {
        hello: 'হ্যালো',
      },
      {
        hello: 'zdravo',
      },
      {
        hello: 'Здравейте',
      },
      {
        hello: 'Hola',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'Moni',
      },
      {
        hello: '您好',
      },
      {
        hello: '您好',
      },
      {
        hello: 'Bonghjornu',
      },
      {
        hello: 'zdravo',
      },
      {
        hello: 'Ahoj',
      },
      {
        hello: 'Hej',
      },
      {
        hello: 'Hallo',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'Saluton',
      },
      {
        hello: 'Tere',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'Hei',
      },
      {
        hello: 'Bonjour',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'Ola',
      },
      {
        hello: 'გამარჯობა',
      },
      {
        hello: 'Hallo',
      },
      {
        hello: 'Γεια σας',
      },
      {
        hello: 'હેલો',
      },
      {
        hello: 'Bonjou',
      },
      {
        hello: 'Sannu',
      },
      {
        hello: 'Alohaʻoe',
      },
      {
        hello: 'שלום',
      },
      {
        hello: 'नमस्ते',
      },
      {
        hello: 'Nyob zoo',
      },
      {
        hello: 'Helló',
      },
      {
        hello: 'Halló',
      },
      {
        hello: 'Ndewo',
      },
      {
        hello: 'Halo',
      },
      {
        hello: 'Dia duit',
      },
      {
        hello: 'Ciao',
      },
      {
        hello: 'こんにちは',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'ಹಲೋ',
      },
      {
        hello: 'Сәлем',
      },
      {
        hello: 'ជំរាបសួរ',
      },
      {
        hello: '안녕하세요.',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'салам',
      },
      {
        hello: 'ສະບາຍດີ',
      },
      {
        hello: 'salve',
      },
      {
        hello: 'Labdien!',
      },
      {
        hello: 'Sveiki',
      },
      {
        hello: 'Moien',
      },
      {
        hello: 'Здраво',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'ഹലോ',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'Hiha',
      },
      {
        hello: 'हॅलो',
      },
      {
        hello: 'Сайн байна уу',
      },
      {
        hello: 'မင်္ဂလာပါ',
      },
      {
        hello: 'नमस्ते',
      },
      {
        hello: 'Hallo',
      },
      {
        hello: 'سلام',
      },
      {
        hello: 'سلام',
      },
      {
        hello: 'Cześć',
      },
      {
        hello: 'Olá',
      },
      {
        hello: 'ਹੈਲੋ',
      },
      {
        hello: 'Alo',
      },
      {
        hello: 'привет',
      },
      {
        hello: 'Talofa',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'Здраво',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'هيلو',
      },
      {
        hello: 'හෙලෝ',
      },
      {
        hello: 'ahoj',
      },
      {
        hello: 'Pozdravljeni',
      },
      {
        hello: 'Hello',
      },
      {
        hello: 'Hola',
      },
      {
        hello: 'halo',
      },
      {
        hello: 'Sawa',
      },
      {
        hello: 'Hallå',
      },
      {
        hello: 'Салом',
      },
      {
        hello: 'ஹலோ',
      },
      {
        hello: 'హలో',
      },
      {
        hello: 'สวัสดี',
      },
      {
        hello: 'Merhaba',
      },
      {
        hello: 'Здрастуйте',
      },
      {
        hello: 'ہیلو',
      },
      {
        hello: 'Salom',
      },
      {
        hello: 'Xin chào',
      },
      {
        hello: 'Helo',
      },
      {
        hello: 'Sawubona',
      },
      {
        hello: 'העלא',
      },
      {
        hello: 'Kaabo',
      },
      {
        hello: 'Sawubona',
      },
    ];

    for (let i = 0; i < all_queries.length; i++) {
      const token = locs.generateInputSessionToken();
      jest.clearAllMocks();
      req.goToGowiz(all_queries[i].hello, token);
      expect(window.location.replace).toHaveBeenCalledTimes(1);
      expect(window.location.replace).toHaveBeenCalledWith(
        'https://gowiz.eu/search/' + encodeURIComponent(all_queries[i].hello)
      );
    }
  });

  it('query is formatted before the call', async () => {
    jest.clearAllMocks();
    const query = ' test ';
    const token = locs.generateInputSessionToken();
    req.goToGowiz(query, token);
    expect(window.location.replace).toHaveBeenCalledTimes(1);
    expect(window.location.replace).toHaveBeenCalledWith('https://gowiz.eu/search/test');
  });
  it('request is not triggered when the query is too long', async () => {
    jest.clearAllMocks();
    let query = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const base_url = 'https://gowiz.eu/search/';
    let token = locs.generateInputSessionToken();
    for (let i = 0; i < 2500; i++) {
      query += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    req.goToGowiz(query, token);
    expect(window.location.replace).toHaveBeenCalledTimes(0);
    /*                    */
    query = '';
    token = locs.generateInputSessionToken();
    for (let i = 0; i < 2048 - base_url.length + 1; i++) {
      query += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    req.goToGowiz(query, token);
    expect(window.location.replace).toHaveBeenCalledTimes(0);
    /*                    */
    query = '';
    token = locs.generateInputSessionToken();
    for (let i = 0; i < 2048 - base_url.length; i++) {
      query += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    req.goToGowiz(query, token);
    expect(window.location.replace).toHaveBeenCalledTimes(1);
  });
  it('special characters are escaped', async () => {
    // query, response
    const dict = {
      '/search': 'https://gowiz.eu/search/%2Fsearch',
      'query/filter': 'https://gowiz.eu/search/query%2Ffilter',
      '5 / 20': 'https://gowiz.eu/search/5%20%2F%2020',
      "this can't be done": "https://gowiz.eu/search/this%20can't%20be%20done",
      '1. of January': 'https://gowiz.eu/search/1.%20of%20January',
      '¯\\_(ツ)_/¯': 'https://gowiz.eu/search/%C2%AF%5C_(%E3%83%84)_%2F%C2%AF',
    };

    for (const query in dict) {
      const token = locs.generateInputSessionToken();
      const response = dict[query];
      jest.clearAllMocks();
      req.goToGowiz(query, token);
      expect(window.location.replace).toHaveBeenCalledTimes(1);
      expect(window.location.replace).toHaveBeenCalledWith(response);
    }
  });

  it('attacks can be tolerated', async () => {
    // query, response
    const dict = {
      'https://gowiz.eu/search': 'https://gowiz.eu/search/https%3A%2F%2Fgowiz.eu%2Fsearch',
      "<script>alert('test');</script>": "https://gowiz.eu/search/%3Cscript%3Ealert('test')%3B%3C%2Fscript%3E",
      '<!doctype html><html><head> <title>Example Domain</title> <meta charset="utf-8"/> <meta http-equiv="Content-type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1"/> <style type="text/css"> body{background-color: #f0f0f2; margin: 0; padding: 0; font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;}div{width: 600px; margin: 5em auto; padding: 2em; background-color: #fdfdff; border-radius: 0.5em; box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);}a:link, a:visited{color: #38488f; text-decoration: none;}@media (max-width: 700px){div{margin: 0 auto; width: auto;}}</style> </head><body><div> <h1>Example Domain</h1> <p>This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.</p><p><a href="https://www.iana.org/domains/example">More information...</a></p></div></body></html>':
        'https://gowiz.eu/search/%3C!doctype%20html%3E%3Chtml%3E%3Chead%3E%20%3Ctitle%3EExample%20Domain%3C%2Ftitle%3E%20%3Cmeta%20charset%3D%22utf-8%22%2F%3E%20%3Cmeta%20http-equiv%3D%22Content-type%22%20content%3D%22text%2Fhtml%3B%20charset%3Dutf-8%22%2F%3E%20%3Cmeta%20name%3D%22viewport%22%20content%3D%22width%3Ddevice-width%2C%20initial-scale%3D1%22%2F%3E%20%3Cstyle%20type%3D%22text%2Fcss%22%3E%20body%7Bbackground-color%3A%20%23f0f0f2%3B%20margin%3A%200%3B%20padding%3A%200%3B%20font-family%3A%20-apple-system%2C%20system-ui%2C%20BlinkMacSystemFont%2C%20%22Segoe%20UI%22%2C%20%22Open%20Sans%22%2C%20%22Helvetica%20Neue%22%2C%20Helvetica%2C%20Arial%2C%20sans-serif%3B%7Ddiv%7Bwidth%3A%20600px%3B%20margin%3A%205em%20auto%3B%20padding%3A%202em%3B%20background-color%3A%20%23fdfdff%3B%20border-radius%3A%200.5em%3B%20box-shadow%3A%202px%203px%207px%202px%20rgba(0%2C0%2C0%2C0.02)%3B%7Da%3Alink%2C%20a%3Avisited%7Bcolor%3A%20%2338488f%3B%20text-decoration%3A%20none%3B%7D%40media%20(max-width%3A%20700px)%7Bdiv%7Bmargin%3A%200%20auto%3B%20width%3A%20auto%3B%7D%7D%3C%2Fstyle%3E%20%3C%2Fhead%3E%3Cbody%3E%3Cdiv%3E%20%3Ch1%3EExample%20Domain%3C%2Fh1%3E%20%3Cp%3EThis%20domain%20is%20for%20use%20in%20illustrative%20examples%20in%20documents.%20You%20may%20use%20this%20domain%20in%20literature%20without%20prior%20coordination%20or%20asking%20for%20permission.%3C%2Fp%3E%3Cp%3E%3Ca%20href%3D%22https%3A%2F%2Fwww.iana.org%2Fdomains%2Fexample%22%3EMore%20information...%3C%2Fa%3E%3C%2Fp%3E%3C%2Fdiv%3E%3C%2Fbody%3E%3C%2Fhtml%3E',
      '<html><body><script>alert("hi")</script></body></html>':
        'https://gowiz.eu/search/%3Chtml%3E%3Cbody%3E%3Cscript%3Ealert(%22hi%22)%3C%2Fscript%3E%3C%2Fbody%3E%3C%2Fhtml%3E',
      'window.location.replace(delfi.ee)': 'https://gowiz.eu/search/window.location.replace(delfi.ee)',
    };

    for (const query in dict) {
      const token = locs.generateInputSessionToken();
      const response = dict[query];
      jest.clearAllMocks();
      req.goToGowiz(query, token);
      expect(window.location.replace).toHaveBeenCalledTimes(1);
      expect(window.location.replace).toHaveBeenCalledWith(response);
    }
  });
});
