import requests
import os
import csv
import time
from bs4 import BeautifulSoup
from newsapi import NewsApiClient
from urllib.parse import quote_plus
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.action_chains import ActionChains

# API Key setup for NewsAPI
newsapi_key = 'f6ca840d5a4c456eb77d77ad72087ff9'
newsapi = NewsApiClient(api_key=newsapi_key)

def download_image(query, filename, min_size=5000):
    """Downloads the highest resolution image for a query using Selenium and saves it with the specified filename."""
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    try:
        driver.get(f"https://www.google.com/search?q=%22{quote_plus(query)}%22&tbm=isch")
        time.sleep(5)

        for _ in range(22):
            driver.switch_to.active_element.send_keys(Keys.TAB)
            time.sleep(0.2)

        if driver.find_elements(By.CLASS_NAME, "YQ4gaf"):
            driver.switch_to.active_element.send_keys(Keys.ENTER)
            time.sleep(2)

        element = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".sFlh5c.FyHeAf.iPVvYb"))
        )
        image_src = element.get_attribute("src")
        img_data = requests.get(image_src).content

        if len(img_data) >= min_size:
            with open(filename, 'wb') as handler:
                handler.write(img_data)
            print(f"Downloaded image for '{query}' as '{filename}'")
            return filename
        else:
            print(f"Image for '{query}' was too small.")
            return None
    except Exception as e:
        print(f"Error downloading image for '{query}': {e}")
        return None
    finally:
        driver.quit()

def fetch_articles(query, num_articles=10):
    """Fetch articles using the NewsAPI."""
    try:
        articles = newsapi.get_everything(q=query, language='en', page_size=num_articles)
        return articles['articles']
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return []

def fetch_article_text(url):
    """Fetch the full text of an article given its URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        article_text = soup.find('article')
        if article_text:
            return ' '.join(p.get_text() for p in article_text.find_all('p'))
    except Exception as e:
        print(f"Error fetching article text from {url}: {e}")
    return None

def append_articles_to_csv(articles, query, output_csv='articles.csv'):
    if not os.path.exists('downloaded_images'):
        os.makedirs('downloaded_images')

    file_exists = os.path.isfile(output_csv)
    existing_titles = set()

    if file_exists:
        with open(output_csv, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            existing_titles = {row['Title'] for row in reader}

    with open(output_csv, 'a', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Index', 'Title', 'Description', 'URL', 'Full_Article_Text', 'Image_path_link', 'Image_File_Path', 'Tag']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()

        existing_images = len(os.listdir('downloaded_images'))
        index = existing_images

        for article in articles:
            title = article.get('title', 'No Title')
            if title in existing_titles:
                print(f"Skipping duplicate article: {title}")
                continue

            image_filename = f"downloaded_images/image_{index}.jpg"
            downloaded_image = download_image(title, image_filename)
            image_path_link_url = f"http://localhost:5000/images/image_{index}.jpg" if downloaded_image else "1"
            image_file_path = os.path.abspath(image_filename) if downloaded_image else "1"

            description = article.get('description', 'No Description')
            url = article.get('url')
            full_text = fetch_article_text(url)

            if full_text:
                writer.writerow({
                    'Index': index,
                    'Title': title,
                    'Description': description,
                    'URL': url,
                    'Full_Article_Text': full_text,
                    'Image_path_link_url': image_path_link_url,
                    'Image_File_Path': image_file_path,
                    'Tag': query
                })
                index += 1
                existing_titles.add(title)

if __name__ == "__main__":
    query = "Politics"
    articles = fetch_articles(query, 10)
    append_articles_to_csv(articles, query)
