import asyncio
import logging
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
import aiohttp
from app.core.config import settings

logger = logging.getLogger(__name__)

async def fetch_papers_from_arxiv(search_query: str, max_results: int = 100) -> List[Dict[str, Any]]:
    """
    Fetch papers from arXiv API based on search query.
    Returns a list of paper dictionaries.
    """
    logger.info(f"Fetching from arXiv: {search_query} (max_results={max_results})")

    # Prepare the API request
    params = {
        "search_query": search_query,
        "start": 0,
        "max_results": max_results,
        "sortBy": "relevance",
        "sortOrder": "descending"
    }

    timeout = aiohttp.ClientTimeout(total=20)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        try:
            async with session.get(settings.ARXIV_API_URL, params=params) as response:
                if response.status != 200:
                    logger.error(f"arXiv API returned status {response.status}")
                    return []

                xml_content = await response.text()
                return parse_arxiv_xml(xml_content)
        except Exception as e:
            logger.error(f"Error fetching from arXiv: {e}")
            return []

def parse_arxiv_xml(xml_content: str) -> List[Dict[str, Any]]:
    """
    Parse the XML response from arXiv API.
    """
    papers = []
    try:
        root = ET.fromstring(xml_content)
        # Define namespaces
        ns = {
            'atom': 'http://www.w3.org/2005/Atom',
            'arxiv': 'http://arxiv.org/schemas/atom'
        }

        # Find all entry elements
        entries = root.findall('atom:entry', ns)

        for entry in entries:
            paper = {}

            # Extract arXiv ID
            id_elem = entry.find('atom:id', ns)
            if id_elem is not None:
                arxiv_id = id_elem.text.split('/')[-1]
                paper['arxiv_id'] = arxiv_id

            # Extract title
            title_elem = entry.find('atom:title', ns)
            if title_elem is not None:
                paper['title'] = title_elem.text.strip()

            # Extract abstract
            summary_elem = entry.find('atom:summary', ns)
            if summary_elem is not None:
                paper['abstract'] = summary_elem.text.strip()

            # Extract authors
            authors = []
            for author_elem in entry.findall('atom:author', ns):
                name_elem = author_elem.find('atom:name', ns)
                if name_elem is not None:
                    authors.append(name_elem.text.strip())
            paper['authors'] = authors

            # Extract published date
            published_elem = entry.find('atom:published', ns)
            if published_elem is not None:
                paper['published_date'] = published_elem.text.strip()

            # Extract updated date
            updated_elem = entry.find('atom:updated', ns)
            if updated_elem is not None:
                paper['updated_date'] = updated_elem.text.strip()

            # Extract categories
            categories = []
            for category_elem in entry.findall('atom:category', ns):
                term = category_elem.get('term')
                if term:
                    categories.append(term)
            paper['categories'] = ','.join(categories)

            # Extract DOI if available
            doi_elem = entry.find('arxiv:doi', ns)
            if doi_elem is not None:
                paper['doi'] = doi_elem.text.strip()

            # Extract journal reference
            journal_ref_elem = entry.find('arxiv:journal_ref', ns)
            if journal_ref_elem is not None:
                paper['journal_ref'] = journal_ref_elem.text.strip()

            # Construct PDF URL
            if 'arxiv_id' in paper:
                paper['pdf_url'] = f"https://arxiv.org/pdf/{paper['arxiv_id']}.pdf"

            papers.append(paper)

    except Exception as e:
        logger.error(f"Error parsing arXiv XML: {e}")

    return papers
