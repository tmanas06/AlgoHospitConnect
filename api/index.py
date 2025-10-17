import sys
import os

# Ensure backend app can be imported
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app as _fastapi_app  # noqa: E402

# Vercel expects a top-level variable named `app` for python runtime
app = _fastapi_app
