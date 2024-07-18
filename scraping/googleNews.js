const puppeteer = require('puppeteer');
require("dotenv").config()

const categories = {
    india:'CAAqJQgKIh9DQkFTRVFvSUwyMHZNRE55YXpBU0JXVnVMVWRDS0FBUAE?hl=en-IN&gl=IN&ceid=IN%3Aen',
    world:'CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx1YlY4U0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-IN&gl=IN&ceid=IN%3Aen',
    business:'CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-IN&gl=IN&ceid=IN%3Aen',
    technology:'CAAqKggKIiRDQkFTRlFvSUwyMHZNRGRqTVhZU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-IN&gl=IN&ceid=IN%3Aen',
    entertainment:'CAAqKggKIiRDQkFTRlFvSUwyMHZNREpxYW5RU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-IN&gl=IN&ceid=IN%3Aen',
    sports:'CAAqKggKIiRDQkFTRlFvSUwyMHZNRFp1ZEdvU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-IN&gl=IN&ceid=IN%3Aen',
    science:'CAAqKggKIiRDQkFTRlFvSUwyMHZNRFp0Y1RjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-IN&gl=IN&ceid=IN%3Aen',
    health:'CAAqJQgKIh9DQkFTRVFvSUwyMHZNR3QwTlRFU0JXVnVMVWRDS0FBUAE?hl=en-IN&gl=IN&ceid=IN%3Aen'
};

// archiving news articles code
const archiveNewsArticles = async (category, articlesData) => {
    const existingNews = await News.findOne({ category: category});

    try{
        if(existingNews)
        {
            existingNews.articles = [...articlesData, ...existingNews.articles];//prepend
            await existingNews.save();
        }
        else
        {
            const news = new News({
                category: category,
                articles: articlesData
            })
            await news.save();
        }
    }
    catch(error){
        console.error(`Error archiving articles for category ${category}:`, error);
    }
};

const scrapeCategory = async(page, category) => {
    const categoryUrl = categories[category];
    if (!categoryUrl) 
    {
        throw new Error('Invalid category');
    }
    const url = `https://news.google.com/topics/${categoryUrl}`
    console.log(`Scraping category - ${category} articles from ${url}`);

    await page.goto(url, { waitUntil: 'networkidle2'});

    const result = await page.evaluate(() => {
        const articles = document.querySelectorAll('.IBr9hb');
        const articleCount = articles.length;

        const articlesData = Array.from(articles).slice(0, 3).map((article) => {
            const title = article.querySelector('.gPFEn').innerText;
            const link = article.querySelector('.gPFEn').href;
            const time = article.querySelector('.hvbAAd').innerText;
            return {
                title,
                link,
                time
            };
        });

        return { articleCount, articlesData };
    });

    return result || {};
}

const main = async (categoriesArray) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'], headless: true, protocolTimeout: 10000, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH});
    
    const retryScrape = async (category, retries = 3) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const page = await browser.newPage();
                const result = await scrapeCategory(page, category);
                await archiveNewsArticles(category, result.articlesData);
                await page.close();
                return result;
            } catch (error) {
                console.error(`Attempt ${attempt} for category ${category} failed:`, error);
                if (attempt === retries) {
                    console.error(`All attempts to scrape category ${category} failed.`);
                    return null;
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    };

    try {
        const results = {};
        const promises = categoriesArray.map(async (category) => {
            const categoryResult = await retryScrape(category);
            if (categoryResult) {
                results[category] = {
                    articleCount: categoryResult.articleCount,
                    articlesData: categoryResult.articlesData
                };
            }
        });

        await Promise.all(promises);
        return results;
    } catch (error) {
        console.error('Error during scraping:', error);
        return {}; 
    } finally {
        await browser.close();
    }

}



module.exports = main;