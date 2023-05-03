import json


def get_image_urls(post_content):
    """Get all the image urls from a post's content (text)."""
    r = json.loads(post_content)
    blocks = r["blocks"]
    images = filter(lambda block: block["type"] == "image", blocks)
    image_urls = map(lambda image: image["data"]["file"]["url"], images)
    return list(image_urls)
