# nodezoo-npm

FROM node:4

ADD . /

EXPOSE 44003
EXPOSE 43003

CMD ["node","srv/npm-dev.js","--seneca.options.tag=npm","--seneca.log.all"]

# build and run:
# $ docker build -t nodezoo-npm-03 .
# $ docker run -d -p 44003:44003 -p 43003:43003 -e HOST=$(docker-machine ip default) -e REDIS=192.168.99.1 --volumes-from nodezoo-level nodezoo-npm-03
# local docker ip:
# $ docker-machine ip default


