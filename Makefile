.PHONY: all build start stop test lint loc

all: build

build:
	docker-compose build

start:
	docker-compose up -d

stop:
	docker-compose down

test:
	cd backend && mvn test
	cd frontend && npm test

lint:
	cd frontend && npm run lint

loc:
	node scripts/count-loc.js
