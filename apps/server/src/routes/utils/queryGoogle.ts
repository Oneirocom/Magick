import unirest from 'unirest'
import cheerio from 'cheerio'

const queryGoogle = (searchTerm: string) => {
  const query = searchTerm.split(' ').join('+')
  return unirest
    .get(`https://www.google.com/search?q=${query}&gl=us&hl=en`)
    .headers({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
    })
    .then((response: any) => {
      let $ = cheerio.load(response.body);

      const el = $('.hgKElc')
      const featuredResult = $(el).text()

      if (featuredResult) return featuredResult

      let snippets = $(".g .VwiC3b ")

      return $(snippets[0]).text()
    });
};

export default queryGoogle