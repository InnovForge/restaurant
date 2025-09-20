FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    lsb-release \
    ca-certificates \
    libssl3 \
    python3 \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://dev.mysql.com/get/Downloads/MySQL-Shell/mysql-shell_8.0.43-1ubuntu22.04_amd64.deb -o /tmp/mysql-shell.deb \
    && DEBIAN_FRONTEND=noninteractive dpkg -i /tmp/mysql-shell.deb \
    && rm /tmp/mysql-shell.deb

CMD ["mysqlsh", "--help"]

