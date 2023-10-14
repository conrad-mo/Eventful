mod types;
mod keys;

use axum::{routing::get, Router, Json};
use std::net::SocketAddr;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use tower_http::cors::{Any, CorsLayer};
use crate::types::{OptimizePrompt, ItemsPrompt, gptcall};


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

    let prompt: String = format!("Give me a list of items for a {} event that are total under {} but do not give price, only a list of items separated by commas", request_data.event, request_data.budget);
    let response = gptcall(prompt);
    (StatusCode::OK, Json(response.await.unwrap()))
}