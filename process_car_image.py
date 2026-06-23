from PIL import Image

img_path = r"C:\Users\rober\.gemini\antigravity\scratch\HACS Energyflow Card\volkswagen_tiguan.png"

img = Image.open(img_path).convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    # If pixel is close to white (RGB > 230), make it transparent
    if item[0] > 230 and item[1] > 230 and item[2] > 230:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)

# Crop the image to bounding box of non-transparent pixels
bbox = img.getbbox()
if bbox:
    cropped_img = img.crop(bbox)
    cropped_img.save(img_path, "PNG")
    print("Background removed and image cropped successfully!")
else:
    img.save(img_path, "PNG")
    print("Background removed, but bbox was empty.")
