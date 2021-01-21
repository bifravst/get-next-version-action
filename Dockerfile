FROM node:14-alpine3.10
WORKDIR /workdir
COPY get-next-version.ts /workdir
COPY package.json /workdir
COPY package-lock.json /workdir
COPY tsconfig.json /workdir
RUN npm ci && npx tsc
ENTRYPOINT ["node","--unhandled-rejections=strict","/workdir/dist/get-next-version.js"]