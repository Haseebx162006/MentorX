# Multi-stage Dockerfile for MentorX FastAPI Backend
FROM python:3.12-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests
COPY requirements.txt pyproject.toml README.md ./

# Install dependencies into a virtual environment or wheel cache
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# ==============================================================================
# Production Runtime Stage
# ==============================================================================
FROM python:3.12-slim AS runner

WORKDIR /app

# Install runtime PostgreSQL client library
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed python packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application source code
COPY . /app

# Ensure temp directory exists and set permissions
RUN mkdir -p /app/temp && \
    useradd -m -u 1001 appuser && \
    chown -R appuser:appuser /app

USER appuser

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start FastAPI application via Uvicorn
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
