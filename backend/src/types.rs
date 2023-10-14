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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct OptimizedItem{
    pub name: String,
    pub cost: f64,
    pub item_link: String
}

impl ToString for OptimizedItem {
    fn to_string(&self) -> String {
        format!("Item name: {}, Cost: {}, Link: {}", self.name, self.cost, self.item_link)
    }
}
#[derive(Debug)]
pub struct OptimizedItemGPT {
    pub name: String,
    pub prices: Vec<f64>,
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
pub async fn shoppingapicall(item_name: String) -> Vec<OptimizedItem>{
    let mut itemvec: Vec<OptimizedItem> = Vec::new();
    let client = reqwest::Client::new();
    let response= client.get(format!("https://api.shoppingscraper.com/search/googleshopping/ca/?keyword={}&api_key={}&page=1&limit=10", item_name, keys::SHOPPING_SCRAPPER_KEY)).send().await;
    let response_read = response.unwrap();
    let data: serde_json::Value = response_read.json().await.unwrap();
    let item_prices = data.get("shoppingscraper").unwrap().get("results").unwrap();
    //println!("{:?}", item_prices);
    //println!("{}", type_of(&item_prices));
    if let Some(prices_array) = item_prices.as_array() {
        for item in prices_array {
            // Now you can access individual JSON objects
            if let Some(link_json) = item.get("link") {
                if let Ok(link) = from_value::<String>(link_json.clone()) {
                    if let Some(price_json) = item.get("offers").unwrap().as_array().unwrap().get(0).unwrap().get("price"){
                        if let Ok(price) = from_value::<f64>(price_json.clone()) {
                            itemvec.push(OptimizedItem{name: item_name.clone(), cost: price, item_link: link.clone() });
                        }
                        else{
                            println!("Failed to deserialize the price into a String");
                        }
                    }
                    else{
                        println!("Failed to find price");
                    }
                } else {
                    println!("Failed to deserialize the link into a String");
                }
            }
        }
    }
    for item in &itemvec {
        println!("Name: {}, Cost: {}, Link: {}", item.name, item.cost, item.item_link);
    }
    itemvec
    // let itemvec_as_string: String = itemvec
    //     .iter()
    //     .map(|item| item.to_string())
    //     .collect::<Vec<String>>()
    //     .join("\n");
    // println!("{:?}", itemvec_as_string);
    // Ok(itemvec_as_string)

    // Ok("bruh".to_string())
    //println!("{:?}", itemvec);
    // let response_body = response.text().await?;
    //println!("{:?}", response_body);
    // Ok(response_body)
}
fn type_of<T>(_: T) -> &'static str {
    type_name::<T>()
}