import json
import logging
from typing import Any
import aiohttp
from app.core.config import settings

logger = logging.getLogger(__name__)

async def call_llm(prompt: str, temperature: float = 0.7, max_tokens: int = 2000) -> str:
    """
    Call the configured LLM provider.
    This project uses Ollama with qwen3:14b only.
    Returns the response as a string.
    """
    system_prompt = (
        "You are Research Copilot, an assistant for scientific literature analysis. "
        "Follow the user's prompt exactly. If the prompt asks for JSON, return valid JSON only "
        "without markdown fences or commentary."
    )

    payload = {
        "model": settings.OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        },
    }

    url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/chat"
    logger.info("Calling Ollama model %s at %s", settings.OLLAMA_MODEL, url)

    timeout = aiohttp.ClientTimeout(total=300)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.post(url, json=payload) as response:
            response_text = await response.text()
            if response.status >= 400:
                raise RuntimeError(f"Ollama request failed ({response.status}): {response_text}")

            try:
                data = json.loads(response_text)
            except json.JSONDecodeError as exc:
                raise RuntimeError(f"Invalid Ollama response: {response_text}") from exc

            message = data.get("message", {}) or {}
            content = message.get("content")
            if not content:
                raise RuntimeError(f"Ollama response missing content: {data}")
            return content.strip()
