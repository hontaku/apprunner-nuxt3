FROM public.ecr.aws/bitnami/node:latest
WORKDIR /usr/app
COPY ./ /usr/app

# timezone setting
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

RUN npm i
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]