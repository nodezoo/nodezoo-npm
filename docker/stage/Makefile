build :
	mkdir -p app/data
	mkdir -p app/srv
	cp -r ../../npm.js app
	cp -r ../../srv/*.js app/srv
	docker build -t nodezoo-npm:1 .
	docker build -t nodezoo-npm-prod:1 -f Dockerfile-prod .

clean :
	rm *~

.PHONY : build clean
