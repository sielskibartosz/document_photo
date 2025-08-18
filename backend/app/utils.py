
def hex_to_rgba(hex_color: str):
    hex_color = hex_color.lstrip('#')
    length = len(hex_color)
    if length == 6:
        r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
        a = 255
    elif length == 8:
        r, g, b, a = (int(hex_color[0:2], 16), int(hex_color[2:4], 16),
                      int(hex_color[4:6], 16), int(hex_color[6:8], 16))
    else:
        return (255, 255, 255, 255)
    return (r, g, b, a)
