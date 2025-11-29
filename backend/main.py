import cv2
import threading
import time
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
from deepface import DeepFace

import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global State
current_emotion = "neutral"
current_meme_url = ""
last_meme_fetch_time = 0

# API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GIPHY_API_KEY = os.getenv("GIPHY_API_KEY")

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # model = genai.GenerativeModel('gemini-pro') # Used for text
    # vision_model = genai.GenerativeModel('gemini-pro-vision') # Used for images

import random

# Fallback Meme Collections
FALLBACK_MEMES = {
    "angry": [
        "https://media.giphy.com/media/11tTNkNy1SdXGg/giphy.gif", # Office rage
        "https://media.giphy.com/media/l1J9u3TZfpmeDLkD6/giphy.gif", # Samuel L Jackson
        "https://media.giphy.com/media/3o9bJX4O9ShW1L32eY/giphy.gif", # Panda rage
        "https://media.giphy.com/media/11tTNkNy1SdXGg/giphy.gif", # Duplicate for weight
        "https://media.giphy.com/media/WoF3yfYupTt8mHc7va/giphy.gif", # Arthur fist
    ],
    "sad": [
        "https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif", # Crying cat
        "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif", # Crying Dawson
        "https://media.giphy.com/media/7SF5scGB2AFrgsXP63/giphy.gif", # Sad Pikachu
        "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif", # Rain cloud
    ],
    "happy": [
        "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif", # Happy cat
        "https://media.giphy.com/media/chzz1FQgqhszAEiyNd/giphy.gif", # Dog smile
        "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif", # Minions
    ],
    "fear": [
        "https://media.giphy.com/media/14ut8PhnIwzros/giphy.gif", # Scared cat
        "https://media.giphy.com/media/bEVKYB487Lqxy/giphy.gif", # Clint Eastwood
    ],
    "neutral": [
        "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif", # Confused math
        "https://media.giphy.com/media/hzrvwvnb9BsYXfq7u2/giphy.gif", # Waiting
    ]
}

def fetch_meme(emotion, force=False):
    global current_meme_url, last_meme_fetch_time
    
    # Debounce meme fetching (don't fetch too often) unless forced
    if not force and time.time() - last_meme_fetch_time < 20:
        return

    print(f"Fetching meme for emotion: {emotion}")
    
    try:
        search_term = f"funny {emotion} meme"
        new_url = ""
        
        # 1. Generate Search Term via Gemini REST API (if available)
        if GEMINI_API_KEY:
            try:
                prompt = f"Generate a single, funny, specific search query for a GIF to cheer up someone who looks '{emotion}'. Return ONLY the search term, no quotes."
                
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }]
                }
                
                response = requests.post(url, json=payload, timeout=5) # 5s timeout
                if response.status_code == 200:
                    data = response.json()
                    if "candidates" in data and data["candidates"]:
                        search_term = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        print(f"Gemini suggested: {search_term}")
                else:
                    print(f"Gemini API Error: {response.status_code} - {response.text}")
                    
            except Exception as e:
                print(f"Gemini Error: {e}")

        # 2. Fetch from Giphy (if available)
        if GIPHY_API_KEY:
            try:
                url = f"https://api.giphy.com/v1/gifs/random?api_key={GIPHY_API_KEY}&tag={search_term}&rating=pg-13"
                response = requests.get(url, timeout=5) # 5s timeout
                data = response.json()
                if data.get("data"):
                    new_url = data["data"]["images"]["original"]["url"]
                    print(f"Giphy URL: {new_url}")
                else:
                    print("No GIF found")
            except Exception as e:
                print(f"Giphy Error: {e}")
        
        # Fallback if no URL found yet (either no key or API failed)
        if not new_url:
            print("Using fallback meme")
            # Pick a random meme from the collection
            meme_list = FALLBACK_MEMES.get(emotion, FALLBACK_MEMES["neutral"])
            new_url = random.choice(meme_list)
            
        # Update global state with timestamp to force frontend update
        if new_url:
            current_meme_url = f"{new_url}?t={int(time.time())}"
            
    except Exception as e:
        print(f"Error in fetch_meme: {e}")
    
    last_meme_fetch_time = time.time()

    
    last_meme_fetch_time = time.time()

@app.get("/fetch_meme_reddit")
def fetch_meme_reddit(emotion: str):
    """
    Dopamine Agent: Fetches a meme from Reddit based on emotion.
    Bypasses browser CORS issues by fetching server-side.
    """
    subreddit = "wholesomememes"
    fallback_subreddit = "memes"
    
    # Logic matching the frontend plan
    emotion_lower = emotion.lower()
    if emotion_lower in ["sad", "fear", "disgust"]:
        subreddit = "wholesomememes"
        fallback_subreddit = "aww"
    elif emotion_lower == "angry":
        subreddit = "satisfying"
        fallback_subreddit = "oddlysatisfying"
    elif emotion_lower in ["happy", "surprise"]:
        subreddit = "CryptoCurrencyMemes" # More images than r/cc
        fallback_subreddit = "motivation"
    else:
        subreddit = "programmerhumor"
        fallback_subreddit = "technology"

    print(f"Dopamine Agent: Fetching from r/{subreddit} for mood '{emotion}'")

    def fetch_from_sub(sub):
        try:
            # Reddit requires a specific User-Agent. Using a browser-like one often helps.
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            url = f"https://www.reddit.com/r/{sub}/top.json?limit=100&t=week" # Increased limit & week filter for better quality
            
            print(f"Requesting: {url}")
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                posts = data.get("data", {}).get("children", [])
                
                # Filter for images (relaxed check)
                image_posts = []
                for post in posts:
                    p_data = post.get("data", {})
                    url = p_data.get("url", "")
                    hint = p_data.get("post_hint", "")
                    domain = p_data.get("domain", "")
                    
                    # Check for direct image links or reddit image hosting
                    if (url.endswith((".jpg", ".png", ".gif", ".jpeg")) or 
                        hint == "image" or 
                        (domain == "i.redd.it" and not url.endswith(".gifv"))):
                        image_posts.append(p_data)
                
                if image_posts:
                    selected_post = random.choice(image_posts)
                    print(f"Success: Found {len(image_posts)} images in r/{sub}. Selected: {selected_post['title']}")
                    return {
                        "url": selected_post["url"],
                        "source": f"r/{sub}",
                        "title": selected_post["title"]
                    }
        except Exception as e:
            print(f"Error fetching from r/{sub}: {e}")
        return None

    # Try primary subreddit
    result = fetch_from_sub(subreddit)
    if result:
        return result
        
    # Try fallback subreddit
    print(f"Primary subreddit r/{subreddit} failed. Trying fallback r/{fallback_subreddit}...")
    result = fetch_from_sub(fallback_subreddit)
    if result:
        return result

    return {"error": f"Failed to find images in r/{subreddit} or r/{fallback_subreddit}"}

@app.post("/analyze_mood")
def analyze_mood():
    global current_emotion, current_meme_url
    
    print("Received manual mood scan request...")
    
    # Open camera only for a split second
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        return {"error": "Could not open webcam"}

    ret, frame = cap.read()
    cap.release() # Release immediately
    
    if not ret:
        return {"error": "Could not capture frame"}

    try:
        # Analyze the frame
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        
        if result:
            dominant_emotion = result[0]['dominant_emotion']
            current_emotion = dominant_emotion
            print(f"Detected: {current_emotion}")
            
            # Always fetch meme for manual trigger
            fetch_meme(current_emotion, force=True)
            
            return {
                "emotion": current_emotion,
                "meme_url": current_meme_url
            }
            
    except Exception as e:
        print(f"Error in analysis: {e}")
        return {"error": str(e)}

    return {"status": "No face detected"}

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribes uploaded audio using Gemini 1.5 Flash.
    """
    if not GEMINI_API_KEY:
        return {"error": "Gemini API Key not configured"}

    print(f"Received audio file: {file.filename}")
    
    try:
        # Save temp file
        temp_filename = f"temp_{int(time.time())}.webm"
        with open(temp_filename, "wb") as buffer:
            buffer.write(await file.read())
            
        print(f"Saved temp file: {temp_filename}")

        # Upload to Gemini
        print("Uploading to Gemini...")
        audio_file = genai.upload_file(path=temp_filename)
        print(f"Uploaded: {audio_file.uri}")
        
        # Generate content
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([
            "Transcribe this audio exactly. Return ONLY the transcription text, no preamble.",
            audio_file
        ])
        
        transcription = response.text.strip()
        print(f"Transcription: {transcription}")
        
        # Cleanup
        os.remove(temp_filename)
        # Note: In production, you might want to delete the file from Gemini too using genai.delete_file(audio_file.name)
        
        return {"transcription": transcription}

    except Exception as e:
        print(f"Transcription Error: {e}")
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        return {"error": str(e)}

@app.get("/")
def read_root():
    return {"status": "Nebula AI Backend Running"}

@app.get("/status")
def get_status():
    return {
        "emotion": current_emotion,
        "meme_url": current_meme_url
    }


class LifeData(BaseModel):
    journal_entries: List[Any]
    finance_data: List[Any]
    habit_data: List[Any]

@app.post("/analyze_life")
def analyze_life(data: LifeData):
    if not GEMINI_API_KEY:
        return {"error": "Gemini API Key not configured"}

    print("Received life analysis request...")
    
    try:
        # Construct Prompt
        prompt = f"""
        You are an advanced AI Life Coach. Analyze the following user data to find hidden correlations between their Mood, Finances, and Habits.
        
        DATA:
        - Recent Journal/Moods: {data.journal_entries}
        - Recent Spending: {data.finance_data}
        - Recent Habits: {data.habit_data}
        
        TASK:
        1. Identify 3 specific patterns/correlations (e.g., "You spend more on food when you are anxious").
        2. Provide 1 concrete, actionable recommendation.
        
        OUTPUT FORMAT (JSON):
        {{
            "insights": ["Insight 1", "Insight 2", "Insight 3"],
            "recommendation": "Actionable advice"
        }}
        Return ONLY valid JSON. Do not use Markdown formatting.
        """
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        # Clean response
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        if text.startswith("```"):
            text = text[3:-3]
        
        return {"analysis": text}

    except Exception as e:
        print(f"Analysis Error: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    # No background thread needed anymore
    uvicorn.run(app, host="0.0.0.0", port=8000)
