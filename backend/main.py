from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import logging
import base64
import re
import io
import os
from dotenv import load_dotenv

# Load local .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "https://birth-wish-automation-git-master-nilesh-pawars-projects.vercel.app",
        "https://birth-wish-automation.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WhatsAppMessage(BaseModel):
    recipientNumber: str
    messageBody: str
    imageUrl: str = None
    phoneNumberId: str = None # Optional in request, can use ENV
    accessToken: str = None   # Optional in request, can use ENV

@app.post("/send-message")
async def send_message(data: WhatsAppMessage):
    try:
        # 0. Get credentials from ENV or Request Body
        env_phone_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
        env_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
        
        phone_number_id = data.phoneNumberId or env_phone_id
        access_token = data.accessToken or env_token

        if not phone_number_id or not access_token:
            raise HTTPException(
                status_code=401, 
                detail="Credentials missing. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in backend environment."
            )

        url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"
        media_url = f"https://graph.facebook.com/v18.0/{phone_number_id}/media"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
        }

        recipient = data.recipientNumber.strip()
        if not recipient.startswith("91") and len(recipient) == 10:
            recipient = "91" + recipient

        media_id = None

        # 1. Handle Image Upload if it's a local data URL (Banner)
        if data.imageUrl and data.imageUrl.startswith("data:image"):
            try:
                logger.info("Local image detected. Uploading to Meta Media API...")
                header, encoded = data.imageUrl.split(",", 1)
                mime_type = re.search(r"data:(.*?);", header).group(1)
                file_ext = mime_type.split("/")[-1]
                image_data = base64.b64decode(encoded)
                
                async with httpx.AsyncClient() as client:
                    files = {"file": (f"banner.{file_ext}", io.BytesIO(image_data), mime_type)}
                    data_fields = {"messaging_product": "whatsapp", "type": mime_type}
                    upload_res = await client.post(media_url, headers=headers, files=files, data=data_fields)
                    
                    if upload_res.status_code == 200:
                        media_id = upload_res.json().get("id")
                        logger.info(f"✅ Media uploaded successfully. ID: {media_id}")
                    else:
                        logger.error(f"❌ Media upload failed: {upload_res.text}")
            except Exception as upload_err:
                logger.error(f"Upload error: {str(upload_err)}")

        # 2. Construct Payload
        if media_id:
            payload = {
                "messaging_product": "whatsapp",
                "to": recipient,
                "type": "image",
                "image": {"id": media_id, "caption": data.messageBody}
            }
        elif data.imageUrl and data.imageUrl.startswith("http"):
            payload = {
                "messaging_product": "whatsapp",
                "to": recipient,
                "type": "image",
                "image": {"link": data.imageUrl, "caption": data.messageBody}
            }
        else:
            payload = {
                "messaging_product": "whatsapp",
                "to": recipient,
                "type": "text",
                "text": {"body": data.messageBody}
            }

        async with httpx.AsyncClient() as client:
            headers["Content-Type"] = "application/json"
            response = await client.post(url, json=payload, headers=headers)
            
            logger.info(f"Response Status: {response.status_code}")
            logger.info(f"Response Body: {response.text}")

            if response.status_code == 200:
                logger.info("✅ SUCCESS: Meta accepted the message.")
                res_data = response.json()
                res_data["_hint"] = "If not received, please REPLY 'Hi' to the bot on WhatsApp."
                return res_data

            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
            
            return response.json()

    except HTTPException as e:
        # Re-raise HTTPExceptions (like the 400 from Meta) so FastAPI handles them
        logger.error(f"HTTP Error: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected Backend Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Wish Weaver Backend is running"}
