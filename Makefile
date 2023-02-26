test: unit integration
	echo "All tests complete."


unit: dependencies
	cd app && npm run test
	echo "Unit tests complete."


integration: dependencies reset_db
	mkdir -p .pg-data
	docker-compose -f docker-compose.yaml up -d
	sleep 4
	cd app && npx prisma migrate dev --name init && npx prisma db seed
	echo "Integration tests complete."


reset_db:
	docker-compose down -v
	rm -rf .pg-data


dependencies:
	cd app && npm install
