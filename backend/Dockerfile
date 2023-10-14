FROM rust:latest as builder
WORKDIR /eventful
COPY . .
RUN apt-get update && apt-get install libssl-dev pkg-config -y
RUN cargo build --release
RUN chmod +x /eventful

FROM debian
RUN apt-get update && apt-get install libssl-dev pkg-config ca-certificates -y
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /eventful/target/release/eventful /eventful
ENTRYPOINT ["/eventful"]
EXPOSE 3000