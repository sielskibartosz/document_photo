from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from PIL import Image
import io
import base64
from rembg import remove

class RemoveBackgroundView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        if 'image' not in request.FILES:
            return Response({"error": "No image provided"}, status=400)

        file_obj = request.FILES['image']

        # Otwórz obraz
        input_image = Image.open(file_obj).convert("RGBA")

        # Usuń tło
        output_image = remove(input_image)

        # Zamień przezroczyste tło na białe
        bg = Image.new("RGBA", output_image.size, (255, 255, 255, 255))
        bg.paste(output_image, mask=output_image.split()[3])

        # NIE ZMIENIAMY rozmiaru, zwracamy obraz w oryginalnym rozmiarze
        final_img = bg

        buffered = io.BytesIO()
        final_img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return Response({"image_no_bg": img_str})
