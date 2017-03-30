build :
	mkdir -p app/data
	mkdir -p app/srv
	cp -r ../../npm.js app
	cp -r ../../srv/*.js app/srv
	docker build -t nodezoo-npm .

clean :
	rm *~

.PHONY : build clean
