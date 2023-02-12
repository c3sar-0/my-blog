import json

res = '{"time":1676067117276,"blocks":[{"id":"UZdrcThAr_","type":"header","data":{"text":"cat UPDATED","level":2}},{"id":"QuL0n4GL34","type":"paragraph","data":{"text":"cat"}},{"id":"bDLpepf4KB","type":"image","data":{"file":{"url":"http://localhost:8000/api/media/wallhaven-6o951w"},"caption":"","withBorder":false,"stretched":false,"withBackground":false}},{"id":"eCTkQ0nmXn","type":"paragraph","data":{"text":"cat"}}],"version":"2.26.5"}'

resData = json.loads(res)
blocks = resData["blocks"]

images = filter(lambda block: block["type"] == "image", blocks)
# print(list(images))

image_urls = map(lambda image: image["data"]["file"]["url"], images)
print(list(image_urls))
