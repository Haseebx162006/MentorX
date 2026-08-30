import sys
from pathlib import Path

# Ensure root backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
app_dir = Path(__file__).resolve().parent

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))
