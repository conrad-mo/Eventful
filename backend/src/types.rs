use reqwest::Error;
use reqwest::header::{HeaderMap, HeaderValue};
use serde::{Deserialize, Serialize};
use crate::keys;

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

pub async fn gptcall(itemsprompt: &ItemsPrompt) -> Result<String, Error>{
    let client = reqwest::Client::new();
    let prompt = format!("whatever {} {}", itemsprompt.event, itemsprompt.budget);
    let newmessages: GptMessage = GptMessage {role: format!("user"), content: format!("Give me a list of items for a party under 100 but do not give price, only a list of items separated by commas")};
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
    println!("{:?}", response_body);
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