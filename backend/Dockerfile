FROM python:3.10
ENV PYTHONUNBUFFERED=1
WORKDIR /backend
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
