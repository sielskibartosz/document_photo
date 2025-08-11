from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from PIL import Image
import io
import base64
from rembg import remove

def hex_to_rgba(hex_color):
    hex_color = hex_color.lstrip('#')
    length = len(hex_color)
    if length == 6:
        r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
        a = 255
    elif length == 8:
        r, g, b, a = (int(hex_color[0:2], 16), int(hex_color[2:4], 16),
                      int(hex_color[4:6], 16), int(hex_color[6:8], 16))
    else:
        # Domyślny biały, jeśli format niepoprawny
        return (255, 255, 255, 255)
    return (r, g, b, a)

class RemoveBackgroundView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        if 'image' not in request.FILES:
            return Response({"error": "No image provided"}, status=400)

        file_obj = request.FILES['image']

        # Pobierz kolor tła z request.data (opcjonalnie)
        bg_color_hex = request.data.get('bg_color', '#ffffff')
        bg_color_rgba = hex_to_rgba(bg_color_hex)

        # Otwórz obraz
        input_image = Image.open(file_obj).convert("RGBA")

        # Usuń tło
        output_image = remove(input_image)

        # Zamień przezroczyste tło na wybrany kolor
        bg = Image.new("RGBA", output_image.size, bg_color_rgba)
        bg.paste(output_image, mask=output_image.split()[3])

        final_img = bg

        buffered = io.BytesIO()
        final_img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return Response({"image_no_bg": img_str})
