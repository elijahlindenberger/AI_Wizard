from PIL import Image

input_path = "public/sprites/wizard_blue_purple.png"
img = Image.open(input_path).convert("RGBA")
pixels = img.load()

width, height = img.size

# Corner pixel is usually the base background color
bg_r, bg_g, bg_b, _ = pixels[0, 0]

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]

        # 1. Remove white bounding frames & borders
        if r > 220 and g > 220 and b > 220:
            pixels[x, y] = (0, 0, 0, 0)

        # 2. Remove grid lines and background color (with minor color tolerance)
        elif abs(r - bg_r) < 30 and abs(g - bg_g) < 30 and abs(b - bg_b) < 30:
            pixels[x, y] = (0, 0, 0, 0)

        # 3. Remove cyan/light blue grid lines
        elif r < 120 and g > 150 and b > 200:
            pixels[x, y] = (0, 0, 0, 0)

img.save(input_path)
print("Sprite sheet background and grid lines removed successfully!")