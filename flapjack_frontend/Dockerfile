FROM node:14

ARG app_env
ENV APP_ENV $app_env

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH
# install and cache app dependencies
ADD package.json /usr/src/app/package.json
ADD package-lock.json /usr/src/app/package-lock.json
RUN npm install
RUN npm install react-scripts@3.4 -g
# add app
ADD . /usr/src/app

# start app
CMD if [ ${APP_ENV} = production ]; \
	then \
	npx browserslist@latest --update-db \
	npm install -g http-server && \
	npm run build && \
	cd build && \
	hs -p 3000 -S; \
	else \
	npm run start; \
	fi
  
EXPOSE 3000