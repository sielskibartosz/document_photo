# -------------------------
# FEEDBACK SERVICE
# -------------------------
import json
from datetime import datetime
from typing import List, Dict, Any

from app.config import config


def save_feedback(message: str) -> None:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = {"timestamp": now, "message": message}

    with open(config.FEEDBACK_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
        f.flush()


def load_feedbacks() -> List[Dict[str, Any]]:
    feedbacks = []
    try:
        with open(config.FEEDBACK_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    feedbacks.append(json.loads(line))
    except FileNotFoundError:
        pass
    return feedbacks
