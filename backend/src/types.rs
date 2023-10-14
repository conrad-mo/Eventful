use reqwest::Error;
use reqwest::header::{HeaderMap, HeaderValue};
use serde::{Deserialize, Serialize};
use crate::keys;
use std::any::type_name;
use serde_json::from_value;

#[derive(Serialize, Deserialize)]
pub struct ItemsPrompt {
    pub event: String,
    pub budget: i32,
}
#[derive(Deserialize)]
pub struct OptimizePrompt {
    pub items: Vec<String>,
    pub budget: i32,
}
#[derive(Serialize)]
pub struct GptData {
    pub model: String,
    pub messages: Vec<GptMessage>,
    pub temperature: f64,
}

#[derive(Serialize)]
pub struct GptMessage {
    pub(crate) role: String,
    pub(crate) content: String,
}

#[derive(Deserialize)]
pub struct OptimizedItem{
    pub name: String,
    pub cost: f64,
    pub link: String
}

pub async fn gptcall(prompt: String) -> Result<String, Error>{
    let client = reqwest::Client::new();
    let newmessages: GptMessage = GptMessage {role: format!("user"), content: prompt};
    let mut newvec = Vec::new();
    newvec.push(newmessages);
    let body = GptData {
        model: "gpt-4".to_string(),
        messages: newvec,
        temperature: 0.7,
    };
    let mut headers = HeaderMap::new();
    headers.insert("Authorization", HeaderValue::from_str(&format!("Bearer {}", keys::GPT_KEY)).unwrap());
    headers.insert("Content-Type", HeaderValue::from_static("application/json"));
    let response = client.post("https://api.openai.com/v1/chat/completions").headers(headers).json(&body).send().await?;
    let response_body = response.text().await?;
    //println!("{:?}", response_body);
    if !(response_body.is_empty()){
        let index1 = response_body.find("\"content\": \"");
        let indexone =  index1.unwrap() + 12;
        let index2 = response_body.find("\"\n      },\n      \"finish_reason\":");
        let indextwo = index2.unwrap();
        Ok(String::from(&response_body[indexone..indextwo]))
    }
    else{
        Ok(String::from("Error"))
    }
}
pub async fn shoppingapicall(item: String) -> Result<String, Error>{
    let client = reqwest::Client::new();
    let response: reqwest::Response = client.get(format!("https://api.shoppingscraper.com/search/googleshopping/ca/?keyword={}&api_key={}&page=1&limit=10", item, keys::SHOPPING_SCRAPPER_KEY)).send().await?;
    let data: serde_json::Value = response.json().await?;
    let item_prices = data.get("shoppingscraper").unwrap().get("results").unwrap();
    println!("{:?}", item_prices);
    println!("{}", type_of(&item_prices));
    if let Some(prices_array) = item_prices.as_array() {
        for item in prices_array {
            // Now you can access individual JSON objects
            if let Some(link_json) = item.get("link") {
                if let Ok(link) = from_value::<String>(link_json.clone()) {
                    println!("{}", link);
                } else {
                    println!("Failed to deserialize the name into a String");
                }
            }
        }
    }
    // let response_body = response.text().await?;
    //println!("{:?}", response_body);
    // Ok(response_body)
    Ok("LMAOOO".to_string())
}
fn type_of<T>(_: T) -> &'static str {
    type_name::<T>()
}