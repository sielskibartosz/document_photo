import json


def parse_bg_color(bg_color: str):
    """Safely parse bg_color string into valid RGBA tuple."""
    try:
        if bg_color.startswith("[") and bg_color.endswith("]"):
            bg_list = json.loads(bg_color)
        else:
            bg_list = [int(x) for x in bg_color.split(",")]
        # Clamp values and ensure 4 elements
        bg_list = [max(0, min(255, int(c))) for c in bg_list[:4]]
        while len(bg_list) < 4:
            bg_list.append(255)
        return tuple(bg_list)
    except Exception:
        return (255, 255, 255, 255)