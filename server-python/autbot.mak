.PHONY: help install run tests clean

help:
	@echo "Available commands (assumes venv is already active):"
	@echo "  make install   Install Python dependencies"
	@echo "  make run       Run the FastAPI app (uvicorn)"
	@echo "  make tests     Run pytest tests"
	@echo "  make clean     Clean up cache files"

install:
	pip install --upgrade pip
	pip install -r requirements.txt

run:
	uvicorn main:app --reload --port 3001

tests:
	pytest tests/ -v

clean:
	rm -rf __pycache__ .pytest_cache
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete