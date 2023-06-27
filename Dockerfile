FROM ubuntu:20.04
LABEL authors="seunghunmoon023"

WORKDIR ~/workerpool-test

COPY dist config ecosystem.config.js package.json ./
COPY ./assets/node-v16.18.0-linux-x64.tar.xz /usr/bin/

    # install required package
RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y sudo vim xz-utils

    # install linux
RUN tar -xvf /usr/bin/node-v16.18.0-linux-x64.tar.xz -C /usr/bin/ && \
    rm /usr/bin/node-v16.18.0-linux-x64.tar.xz

# 여기서 에러 발생중..
#RUN #mv /usr/bin/node-v16.18.0-linux-x64 /usr/bin/node && \
#    echo 'PATH=$PATH:/usr/bin/node/bin' >> ~/.bashrc && \
#    source ~/.bashrc

ENTRYPOINT ["/bin/bash"]
