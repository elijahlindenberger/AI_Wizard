from PIL import Image

input_path = "public/sprites/wizard_blue_purple.png"
img = Image.open(input_path).convert("RGBA")
w, h = img.size

COLS = 4
ROWS = 7 if (h / w) > 1.2 else 5
TARGET_SIZE = 128

raw_tile_w = w / COLS
raw_tile_h = h / ROWS

out_img = Image.new("RGBA", (COLS * TARGET_SIZE, ROWS * TARGET_SIZE), (0, 0, 0, 0))

for r in range(ROWS):
    for c in range(COLS):
        left = int(c * raw_tile_w)
        top = int(r * raw_tile_h)
        right = int((c + 1) * raw_tile_w)
        bottom = int((r + 1) * raw_tile_h)
        
        tile = img.crop((left, top, right, bottom))
        
        # Strip grid lines and borders
        tile_data = tile.getdata()
        clean_data = []
        for item in tile_data:
            red, green, blue, alpha = item
            if (red > 200 and green > 200 and blue > 200) or (red < 120 and green > 140 and blue > 180):
                clean_data.append((0, 0, 0, 0))
            else:
                clean_data.append(item)
        tile.putdata(clean_data)

        # Nearest-neighbor resize preserves pixel art crispness
        tile_resized = tile.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.NEAREST)
        out_img.paste(tile_resized, (c * TARGET_SIZE, r * TARGET_SIZE))

out_img.save(input_path)
print(f"Normalized sprite sheet ({w}x{h}) into clean {COLS*TARGET_SIZE}x{ROWS*TARGET_SIZE} grid!")