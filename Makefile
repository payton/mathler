test: unit integration
	echo "All tests complete."


unit: dependencies
	cd app && npm run unit
	echo "Unit tests complete."


integration: dependencies reset_db
	mkdir -p .pg-data
	docker-compose -f docker-compose.yaml up -d
	sleep 4
	cd app && npx prisma migrate dev --name init
	cd app && npm run integration
	echo "Integration tests complete."


dev: dependencies reset_db
	mkdir -p .pg-data
	docker-compose -f docker-compose.yaml up -d
	sleep 4
	cd app && npx prisma migrate dev --name init && npx prisma db seed
	cd app && npm run dev


reset_db:
	docker-compose down -v
	rm -rf .pg-data


dependencies:
	cd app && npm install
