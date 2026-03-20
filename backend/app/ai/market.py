import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from .exa_search import get_exa_search_tool
from langgraph.prebuilt import create_react_agent

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

async def get_market_indices():
    """
    Uses Gemini + Web Search to get the latest levels of Nifty 50, Sensex, and Gold.
    Returns a list of dicts.
    """
    if not GEMINI_API_KEY:
        return [
            {"name": "Nifty 50", "value": "22,000", "change": "+0.5%", "status": "up"},
            {"name": "Sensex", "value": "72,500", "change": "+0.4%", "status": "up"},
            {"name": "Gold (24K)", "value": "65,200", "change": "-0.2%", "status": "down"}
        ]

    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=GEMINI_API_KEY)
        tools = [get_exa_search_tool()]
        
        system_prompt = """You are a financial data extractor. 
        Your task is to find the CURRENT (today's) levels of:
        1. Nifty 50 Index (India)
        2. BSE Sensex (India)
        3. Gold Price per 10g (24K, India)
        
        Respond ONLY with a JSON array of objects. Example:
        [
            {"name": "Nifty 50", "value": "22,096.75", "change": "+0.45%", "status": "up"},
            ...
        ]
        Search the web to get the absolute latest values from reliable sources like Moneycontrol or NSE/BSE.
        """
        
        agent = create_react_agent(model=llm, tools=tools, prompt=system_prompt)
        
        result = await agent.ainvoke(
            {"messages": [HumanMessage(content="Get current Nifty 50, Sensex, and Gold prices for India.")]}
        )
        
        # Extract the last message content
        raw_content = result["messages"][-1].content
        
        # Clean the content if LLM wrapped it in markdown
        if "```json" in raw_content:
            raw_content = raw_content.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_content:
            raw_content = raw_content.split("```")[1].split("```")[0].strip()
            
        return json.loads(raw_content)
        
    except Exception as e:
        print(f"[MarketAI] Error: {e}")
        # Fallback values if search fails
        return [
            {"name": "Nifty 50", "value": "22,000", "change": "---", "status": "neutral"},
            {"name": "Sensex", "value": "72,000", "change": "---", "status": "neutral"},
            {"name": "Gold (24K)", "value": "65,000", "change": "---", "status": "neutral"}
        ]
