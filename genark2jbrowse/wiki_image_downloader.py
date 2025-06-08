#!/usr/bin/env python3
"""
Wikipedia Image Downloader with LLM integration
Downloads the main image from a Wikipedia page using a scientific name,
with LLM assistance for name validation and alternative suggestions.
"""

import requests
import os
import sys
import subprocess
from urllib.parse import urlparse
import argparse
import unicodedata
import re

# Set up headers for Wikipedia API compliance
HEADERS = {
    'User-Agent': 'WikipediaImageDownloader/1.0 (https://github.com/user/repo; user@example.com)'
}
def query_llm(species):
    """Query the LLM command-line tool."""
    cmd = ["llm", "-m","claude-3-haiku", "-t", "prompt.yaml", species]
    print(" ".join(cmd))
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return result.stdout.strip()

def get_wikipedia_page_info(scientific_name):
    """Get Wikipedia page information for a scientific name."""
    api_url = "https://en.wikipedia.org/api/rest_v1/page/summary/"
    
    def try_name(name):
        try:
            response = requests.get(f"{api_url}{name}", headers=HEADERS)
            if response.status_code == 200:
                return response.json()
        except requests.RequestException:
            pass
        return None
    
    # Try direct lookup first
    result = try_name(scientific_name)
    if result:
        return result
    
    # Try with underscores instead of spaces
    name_with_underscores = scientific_name.replace(' ', '_')
    result = try_name(name_with_underscores)
    if result:
        return result
    
    # Try search API as fallback
    try:
        search_url = "https://en.wikipedia.org/w/api.php"
        search_params = {
            'action': 'opensearch',
            'search': scientific_name,
            'limit': 3,
            'format': 'json'
        }
        
        search_response = requests.get(search_url, params=search_params, headers=HEADERS)
        search_data = search_response.json()
        
        # Try each search result
        for page_title in search_data[1]:
            result = try_name(page_title)
            if result:
                return result
                
    except requests.RequestException as e:
        print(f"Error with search API: {e}")
    
    return None

def download_image(image_url, filename):
    """Download an image from URL and save it to filename."""
    try:
        response = requests.get(image_url, stream=True, headers=HEADERS)
        response.raise_for_status()
        
        os.makedirs('speciesImages', exist_ok=True)
        filepath = os.path.join('speciesImages', filename)
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return filepath
    except requests.RequestException as e:
        print(f"Error downloading image: {e}")
        return None

def get_file_extension(url):
    """Extract file extension from URL."""
    parsed_url = urlparse(url)
    path = parsed_url.path
    return os.path.splitext(path)[1].lower() or '.jpg'

def get_resized_image_url(original_url, max_width):
    """Convert a Wikipedia image URL to a specific width."""
    if not original_url or max_width is None:
        return original_url
    
    # Wikipedia image URLs can be resized by modifying the path
    # Example: https://upload.wikimedia.org/wikipedia/commons/thumb/a/b/image.jpg/1200px-image.jpg
    # Can be changed to: https://upload.wikimedia.org/wikipedia/commons/thumb/a/b/image.jpg/300px-image.jpg
    
    if '/thumb/' in original_url and 'px-' in original_url:
        # Split URL at the last occurrence of 'px-'
        parts = original_url.rsplit('px-', 1)
        if len(parts) == 2:
            # Reconstruct with new width
            return f"{parts[0]}{max_width}px-{parts[1]}"
    
    return original_url

def try_alternative_names(alternatives_text, original_name):
    """Try alternative names suggested by LLM."""
    if not alternatives_text or "ALTERNATIVES:" not in alternatives_text:
        return None
    
    alternatives_part = alternatives_text.split("ALTERNATIVES:")[1].strip()
    alternative_names = [name.strip() for name in alternatives_part.split(',')]
    
    print(f"Trying alternative names: {', '.join(alternative_names)}")
    
    for alt_name in alternative_names:
        if alt_name and alt_name != original_name:
            print(f"  Trying: {alt_name}")
            page_info = get_wikipedia_page_info(alt_name)
            if page_info:
                return page_info, alt_name
    
    return None

def main():
    parser = argparse.ArgumentParser(description='Download Wikipedia image by scientific name (with LLM assistance)')
    parser.add_argument('scientific_name', help='Scientific name of the organism')
    parser.add_argument('-o', '--output', help='Output filename (optional)')
    parser.add_argument('-m', '--model', help='LLM model to use (optional)')
    parser.add_argument('--size', type=int, choices=[150, 300, 500, 800, 1200], 
                       help='Maximum image width in pixels (150, 300, 500, 800, 1200). Uses original size if not specified.')
    
    args = parser.parse_args()
    
    original_name = args.scientific_name
    scientific_name = original_name
    
    print(f"Searching for: {scientific_name}")
    llm_response = query_llm(scientific_name)
    
    if llm_response:
        print(f"LLM response: {llm_response}")
        
        if llm_response.startswith("VALID:"):
            scientific_name = llm_response.split("VALID:")[1].strip()
            print(f"✓ Name validated: {scientific_name}")
        elif llm_response.startswith("CORRECTED:"):
            scientific_name = llm_response.split("CORRECTED:")[1].split('\n')[0].strip()
            print(f"→ Name corrected to: {scientific_name}")
        elif llm_response.startswith("INVALID:"):
            reason = llm_response.split("INVALID:")[1].split('\n')[0].strip()
            print(f"✗ Invalid name: {reason}")
            # Still try to proceed in case LLM was wrong
    else:
        print("Could not validate with LLM, proceeding anyway...")
    
    # Try to get Wikipedia page info
    page_info = get_wikipedia_page_info(scientific_name)
    found_name = scientific_name
    
    # If not found and we have LLM response with alternatives, try them
    if not page_info and llm_response:
        alt_result = try_alternative_names(llm_response, scientific_name)
        if alt_result:
            page_info, found_name = alt_result
            print(f"✓ Found using alternative name: {found_name}")
    
    if not page_info:
        print(f"Could not find Wikipedia page for '{scientific_name}' or any alternatives")
        return 1
    
    print(f"Found page: {page_info.get('title', 'Unknown')}")
    
    # Check for image
    if 'thumbnail' not in page_info:
        print("No image found on the Wikipedia page")
        
        # Ask LLM for suggestions
        print("Asking LLM for alternative search suggestions...")
        suggestion_prompt = f"""The Wikipedia page for "{found_name}" exists but has no images. 
Can you suggest 2-3 alternative scientific names or common names that might have images on Wikipedia? 
Just list them separated by commas, nothing else."""
        
        suggestions = query_llm(suggestion_prompt)
        if suggestions:
            print(f"LLM suggests trying: {suggestions}")
        
        return 1
    
    image_url = page_info['thumbnail']['source']
    
    # Try to get higher resolution or requested size
    if 'originalimage' in page_info and not args.size:
        image_url = page_info['originalimage']['source']
        print(f"Found high-resolution image: {image_url}")
    elif args.size:
        # Use thumbnail as base and resize
        if 'originalimage' in page_info:
            base_url = page_info['originalimage']['source']
        else:
            base_url = page_info['thumbnail']['source']
        
        resized_url = get_resized_image_url(base_url, args.size)
        if resized_url != base_url:
            image_url = resized_url
            print(f"Found {args.size}px width image: {image_url}")
        else:
            print(f"Using available image: {image_url}")
    else:
        print(f"Found thumbnail image: {image_url}")
    
    # Determine filename
    if args.output:
        filename = args.output
    else:
        # Slugify the name to match slugify npm package behavior
        safe_name = unicodedata.normalize('NFD', original_name)
        # Remove non-alphanumeric characters (except spaces) and convert to ASCII
        safe_name = re.sub(r'[^\w\s-]', '', safe_name.encode('ascii', 'ignore').decode('ascii'))
        # Replace spaces with hyphens
        safe_name = re.sub(r'[-\s]+', '-', safe_name).strip('-')
        extension = get_file_extension(image_url)
        filename = f"{safe_name}{extension}"
    
    # Download the image and save the image URL to a text file
    print("Downloading image...")
    txt_filepath = os.path.join('speciesImages', f"{os.path.splitext(filename)[0]}.txt")
    
    # Save the image URL to a text file
    try:
        if image_url:
            with open(txt_filepath, 'w') as txt_file:
                txt_file.write(image_url)
            print(f"✓ Image URL saved to: {txt_filepath}")
        else:
            with open(txt_filepath, 'w') as txt_file:
                txt_file.write('none')
            print(f"✓ No image URL found, 'none' saved to: {txt_filepath}")
    except Exception as e:
        try:
            # Attempt to write 'none' if the original write failed
            with open(txt_filepath, 'w') as txt_file:
                txt_file.write('none')
            print(f"✓ Error saving image URL, 'none' saved to: {txt_filepath}: {e}")
        except Exception as inner_e:
            print(f"✗ Failed to save image URL file: {inner_e}")
    
    # Download the actual image file
    filepath = None
    if image_url:
        filepath = download_image(image_url, filename)
        if filepath:
            print(f"✓ Image downloaded to: {filepath}")
        else:
            print("✗ Failed to download image")
    
    # Write the Wikipedia page URL to a separate text file
    page_url = page_info.get('content_urls', {}).get('desktop', {}).get('page', '')
    page_txt_filepath = os.path.join('speciesImages', f"{os.path.splitext(filename)[0]}_page.txt")
    try:
        if page_url:
            with open(page_txt_filepath, 'w') as page_txt_file:
                page_txt_file.write(page_url)
            print(f"✓ Wikipedia page URL saved to: {page_txt_filepath}")
        else:
            with open(page_txt_filepath, 'w') as page_txt_file:
                page_txt_file.write('none')
            print(f"✓ No Wikipedia page URL found, 'none' saved to: {page_txt_filepath}")
    except Exception as e:
        try:
            # Attempt to write 'none' if the original write failed
            with open(page_txt_filepath, 'w') as page_txt_file:
                page_txt_file.write('none')
            print(f"✓ Error saving Wikipedia page URL, 'none' saved to: {page_txt_filepath}: {e}")
        except Exception as inner_e:
            print(f"✗ Failed to save Wikipedia page URL file: {inner_e}")

    

if __name__ == "__main__":
    sys.exit(main())
