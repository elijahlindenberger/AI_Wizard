from PIL import Image

path = "public/sprites/wizard_blue_purple.png"
img = Image.open(path).convert("RGBA")
w, h = img.size

cols, rows = 4, 7 if h > 700 else 5
tile_w = w // cols
tile_h = h // rows

TARGET_SIZE = 128
out_img = Image.new("RGBA", (cols * TARGET_SIZE, rows * TARGET_SIZE), (0, 0, 0, 0))

for r in range(rows):
    for c in range(cols):
        # Crop the current squished double tile
        box = (c * tile_w, r * tile_h, (c + 1) * tile_w, (r + 1) * tile_h)
        tile = img.crop(box)
        
        # Isolate the main full wizard on the right half of the tile
        right_half = tile.crop((tile_w // 2, 0, tile_w, tile_h))
        
        # Strip blue grid lines and dark border pixels
        pix = right_half.load()
        for y in range(right_half.height):
            for x in range(right_half.width):
                red, green, blue, alpha = pix[x, y]
                if (red < 120 and green > 130 and blue > 170) or (red > 210 and green > 210 and blue > 210):
                    pix[x, y] = (0, 0, 0, 0)

        # Calculate bounding box of Merlin's pixels
        bbox = right_half.getbbox()
        if bbox:
            merlin = right_half.crop(bbox)
            
            # Calculate position to center Merlin inside the 128x128 canvas frame
            paste_x = (c * TARGET_SIZE) + ((TARGET_SIZE - merlin.width) // 2)
            paste_y = (r * TARGET_SIZE) + ((TARGET_SIZE - merlin.height) // 2)
            out_img.paste(merlin, (paste_x, paste_y))

out_img.save(path)
print("Single wizard isolated, cleaned, and centered successfully!")