#FROM arm32v6/alpine
FROM alpine

RUN apk add nodejs

EXPOSE 3200
ENV PORT=3200

ADD ./server.js /root/server.js

WORKDIR /root/
ENV PORT=3000

CMD ["node", "server.js"]