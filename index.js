const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto('https://www.amazon.in/s?k=iphone+se');

  /**
   * Get page content as HTML.
   */
  const content = await page.content();

  /**
   * Load content in cheerio.
   */
  const $ = cheerio.load(content);
  const title = $('title').text();

  var results = [];
  $('.s-result-item').each(function(item, elem) {
    const resultItem = cheerio.load(elem);
    const links = resultItem('a');
    let name, price, href;
    try{
      name = cheerio.load(links[1]).text().trim();
      price = cheerio.load(links[4])(".a-price").text().trim().split("₹")[1];
      href = cheerio.load(links[1])
    }catch(error) {
      // console.log("couldn't fetch details of a few items");
    }
    if(name && price) {
      results.push({
        name,
        price: `₹${price}`,
      })
    }
  });

  await browser.close();

  console.log("title: ", title);
  console.log("results: ", results);
})();
