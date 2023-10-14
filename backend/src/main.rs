mod types;
mod keys;

use axum::{routing::get, Router, Json};
use std::net::SocketAddr;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use tower_http::cors::{Any, CorsLayer};
use crate::types::{OptimizePrompt, ItemsPrompt, gptcall, shoppingapicall, OptimizedItem, OptimizedItemGPT};
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
    let items_optimized: Vec<Vec<OptimizedItem>> = join_all(request_data.items.iter().map(|item| async { shoppingapicall(item.to_string()).await })).await;
    let formatted_items = format!("{:?}", request_data.items);
    let formatted_costs = format!("{:?}", items_optimized);
    println!("Done this so far");
    let items_price = join_all(items_optimized.clone().iter().map(|item| async { price_dive(item.to_vec()).await })).await;
    println!("{:?}", items_price);
    println!("YESSIR");
    let formatted_prices = format!("{:?}", items_price);
    // (StatusCode::OK, Json(formatted_costs))
    let prompt = format!("Given items \n {} \n and given multiple links and costs for ever item in the list above \n {} \n\
    for every item, return the item name from the original list, the cost to the option you found. The total cost for everything must fit inside budget of {} dollars and you should return it in a format where the item name and its respective price is separated by a colon but every group of item name: price is separated by a comma. The format should contain 1 of each item.\
    Please optimize for the total cost of all the items in the list to be as close to the budget as possible and to not just pick the cheapest items and do not exceed the budget. Do not have any text aside from the format requested. The json should not contain any excess characters too such as \\"
        , formatted_items, formatted_prices, request_data.budget);
    let response = gptcall(prompt.to_string()).await;
    let output = response.unwrap();
    let trimmed = trim_string(&output);
    println!("{}", trimmed);
    let parts = trimmed[2..trimmed.len()-2].split(", ");
    let vector: Vec<String> = parts.map(String::from).collect::<Vec<String>>();
    let finalvector = join_all(vector.iter().map(|item| async { link_dsdr(item.clone(), items_optimized.clone()).await })).await;
    (StatusCode::OK, Json(finalvector))
}

pub async fn price_dive (item_vec: Vec<OptimizedItem>) -> OptimizedItemGPT{
    if item_vec.is_empty() {
        return OptimizedItemGPT {
            name: String::new(),
            prices: Vec::new(),
        };
    }
    let mut prices: Vec<f64> = Vec::new();
    let name = &item_vec[0].name.clone();
    for item in item_vec{
        prices.push(item.cost);
    }
    OptimizedItemGPT{
        name: name.to_string(),
        prices,
    }
}

fn trim_string(input: &str) -> &str {
    let trimmed_start = input.chars().skip_while(|c| !c.is_ascii_alphanumeric()).collect::<String>();
    let trimmed_end = input.chars().rev().skip_while(|c| !c.is_ascii_alphanumeric()).collect::<String>();

    if let Some(first_alphanumeric) = trimmed_start.chars().next() {
        if let Some(last_alphanumeric) = trimmed_end.chars().next() {
            if trimmed_start.len() + trimmed_end.len() <= input.len() {
                let start_idx = input.find(first_alphanumeric).unwrap();
                let end_idx = input.rfind(last_alphanumeric).unwrap();
                return &input[start_idx..end_idx + 1];
            }
        }
    }
    return input;
}

async fn link_dsdr(nameandprice: String, items_vec: Vec<Vec<OptimizedItem>>) -> OptimizedItem{
    let name: String = nameandprice[0..nameandprice.find(":").unwrap()].to_string();
    let price: f64 = nameandprice[nameandprice.find(":").unwrap()+1..].to_string().parse::<f64>().unwrap();
    for vectors in items_vec{
        for elements in vectors{
            if elements.name != name{
                break;
            }
            if elements.cost == price{
                return OptimizedItem{
                    name,
                    cost: price,
                    item_link: elements.item_link,
                };
            }
        }
    }
    return OptimizedItem{name: "".to_string(), cost: 0.0, item_link: "".to_string()};
}