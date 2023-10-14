mod types;
mod keys;

use axum::{routing::get, Router, Json};
use std::net::SocketAddr;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use tower_http::cors::{Any, CorsLayer};
use crate::types::{OptimizePrompt, ItemsPrompt, gptcall, shoppingapicall, OptimizedItem};
use reqwest::Error;
use futures::future::join_all;


#[tokio::main]
async fn main() {
    let cors = CorsLayer::new().allow_origin(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/generateitems", post(items_gen))
        .route("/optimizeitems", post(optimize_items))
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
    let prompt: String = format!("Give me a list of items for a {} event where total cost of all the items are under {} but do not give price, only a list of items separated by commas. Remove any periods at the end", request_data.event, request_data.budget);
    let response = gptcall(prompt).await;
    let output = response.unwrap();
    let parts = output.split(", ");
    let vector: Vec<String> = parts.map(String::from).collect::<Vec<String>>();
    (StatusCode::OK, Json(vector))
}

async fn optimize_items(Json(request_data): Json<OptimizePrompt>) -> impl IntoResponse {
    let items_costs = join_all(request_data.items.iter().map(|item| async { shoppingapicall(item.to_string()).await.unwrap() })).await;
    let formatted_items = format!("{:?}", request_data.items);
    let formatted_costs = format!("{:?}", items_costs);
    (StatusCode::OK, Json(items_costs))
    // println!("Done grabbing shit");
    // let prompt = format!("Given items \n {} \n and given multiple links and costs for ever item in the list above \n {} \n\
    // for every item, return the item name from the original list, the cost and link to the option you found. The total cost for everything must fit inside budget of {} dollars and you should give me a list"
    //     , formatted_items, formatted_costs, request_data.budget);
    // let response = gptcall(prompt.to_string()).await;
    // (StatusCode::OK, Json(response.unwrap()))
}

// async fn price_cleanup(response: Result<String, Error>) -> Vec<OptimizedItem>{
//
// }