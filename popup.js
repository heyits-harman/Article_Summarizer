document.getElementById("summarize").addEventListener("click", () => {
  const resultDiv = document.getElementById("result");
  const summaryType = document.getElementById("summary-type").value;

  resultDiv.innerHTML = '<div class="loading"><div class="loader"></div></div>';

  //1) Get User's API Key
  chrome.storage.sync.get(["geminiApiKey"], async (result) => {
    if(!result.geminiApiKey){
      resultDiv.textContent = "No API Key set. Click the gear icon to add one.";
      return;
    }
   //2) Ask content.js for the page text
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "GET_ARTICLE_TEXT" },
        async (res) => {
          if (chrome.runtime.lastError || !res) {
            resultDiv.innerText = "Cannot summarize this page.";
            return;
          }

          try{
            const summary = await getGeminiSummary(res.text, summaryType, result.geminiApiKey);
            resultDiv.innerText = summary;
          }catch(error){
            resultDiv.innerText = `Gemini Error: ${error.message || "Failed to generate summary"}`;
          }
        }
      );
    });
  }); 
});

async function getGeminiSummary(rawText, type, apiKey){
  const max = 20000;
  const text = rawText.length > max ? rawText.slice(0, max) + "..." : rawText;

  const promptMap = {
    brief: `Summarize this in 2-3 sentences:\n\n${text}`,
    detailed: `Give a detailed summary: \n\n${text}`,
    bullets: `Summarize in 5-7 bullet points (start each line with "- "):\n\n${text}`,
  };

  const prompt = promptMap[type] || promptMap.brief;

  try{
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2 }
        })
      }
    )
  
    if(!res.ok){
      const errorData = await res.json();
      throw new Error(errorData.error?.message || " API Request Failed");
    }
    
    const data = await res.json();
    return (data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No Summary.");

  }catch(error){
    console.error("Error calling gemini Api: ", error);
    throw new Error("Failed to generate summary. Please try again.")
  }
}

document.getElementById("copy-btn").addEventListener("click", () => {
  const txt = document.getElementById("result").innerText;
  if(txt && txt.trim() != ""){
    navigator.clipboard.writeText(txt)
    .then(() => {
      const btn = document.getElementById("copy-btn");
      const old = btn.innerText;
      btn.textContent = "Copied!";
      setTimeout(() => {btn.innerText = old}, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err)
    })
  }  
})