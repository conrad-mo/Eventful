mod types;
mod keys;

use axum::{routing::get, Router, Json};
use std::net::SocketAddr;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use reqwest::header::{HeaderMap, HeaderValue};
use tower_http::cors::{Any, CorsLayer};
use crate::types::{OptimizePrompt, ItemsPrompt, GptData, GptMessage, gptcall};


#[tokio::main]
async fn main() {
    let cors = CorsLayer::new().allow_origin(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/generateitems", post(items_gen))
        .route("/optimizeitems", post(root))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn root() -> &'static str {
    "Backend reached"
}

async fn items_gen(Json(request_data): Json<ItemsPrompt>) -> impl IntoResponse {
    let whatever = gptcall(&request_data);
    (StatusCode::OK, Json(whatever.await.unwrap()))
}