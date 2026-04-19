#!/bin/bash
# BDM Carousel Generator — http://carousel-generator.local:8080
cd "$(dirname "$0")/carousel-generator"
echo "🌐 http://carousel-generator.local:8080 에서 실행 중..."
echo "   종료: Ctrl+C"
python3 -m http.server 8080 --bind 0.0.0.0
