import fitz # PyMuPDF
import io
import os
from PIL import Image

pdf_path = "/Users/mathe_ifn2kjr/Documents/plsanner/EBOOK DIARIO DO DESENVOLVIMENTO- PRIMEIRO 30 DIAS.pdf"
doc = fitz.open(pdf_path)

if not os.path.exists("images"):
    os.makedirs("images")

img_idx = 0
for page_index in range(len(doc)):
    page = doc.load_page(page_index)
    image_list = page.get_images(full=True)
    
    for image_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        try:
            # Load it to PIL to filter out tiny images or logos
            image = Image.open(io.BytesIO(image_bytes))
            if image.width < 200 or image.height < 200:
                continue
                
            img_idx += 1
            image_name = f"images/bebe_{img_idx}.{image_ext}"
            with open(image_name, "wb") as f:
                f.write(image_bytes)
        except Exception as e:
            print(f"Skipped an image on page {page_index}: {e}")

print(f"Extracted {img_idx} images.")
