# Dockerfile for storybook

FROM node:20.10.0-alpine

# Install Dependencies
RUN apk add --no-cache --virtual .gyp python3 make g++ curl curl-dev \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    bash \
    imagemagick

# Working directory 
WORKDIR /elemental

# Copy dependecies
COPY ["package.json", "yarn.lock", "./"]

# Installing dependencies
RUN yarn

# Copying repo files
COPY . .

# EXPOSE
EXPOSE 3000

# CMD
CMD ["yarn", "story"]