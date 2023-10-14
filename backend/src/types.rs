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
    pub messages: GptMessage,
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
    let newmessages: GptMessage = GptMessage {role: format!("user"), content: format!("Whatever")};
    let body = GptData {
        model: "gpt-4".to_string(),
        messages: newmessages,
        temperature: 0.7,
    };
    let mut headers = HeaderMap::new();
    headers.insert("Authorization", HeaderValue::from_str(&format!("BEARER {}", keys::GPT_KEY)).unwrap());
    headers.insert("Content-Type", HeaderValue::from_static("application/json"));
    let response = client.post("https://api.openai.com/v1/chat/completions").headers(headers).json(&body).send().await?;
    let response_body = response.text().await?;
    Ok(response_body)
}