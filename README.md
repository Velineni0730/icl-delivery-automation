# ICL Delivery Automation

An AI-powered delivery sheet automation system that extracts shipment details from courier delivery sheet images and automatically updates Microsoft Excel using Microsoft Graph API.

## Features

- AI-based extraction of shipment details from delivery sheet images
- Automatic extraction of:
  - Runsheet Date
  - AWB Number
  - Pieces
  - Charge Weight
- Automatic shipment amount calculation
- Edit extracted data before submission
- Add or remove shipment rows
- Duplicate AWB validation before upload
- Microsoft Account authentication
- Automatic Excel update using Microsoft Graph API
- Upload history and processing logs
- Responsive interface for desktop and mobile

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- Firebase Authentication

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Gemini API
- Microsoft Graph API
- Multer

## Workflow

1. User signs in using Google Authentication.
2. Capture or upload a delivery sheet image.
3. Gemini extracts shipment details.
4. User reviews and edits extracted data.
5. Shipment amounts are calculated automatically.
6. User confirms the delivery sheet.
7. Microsoft OAuth authorizes Excel access.
8. Shipments are appended to the Excel workbook.
9. Upload is stored in MongoDB as processed.
10. Processing history is available in Upload Logs.

---

## Deployment

### Frontend
- Vercel

### Backend
- Render

### Database
- MongoDB Atlas

### Authentication
- Firebase Authentication
- Microsoft Entra ID OAuth

---

## Future Improvements

- Better OCR validation
- Retry support for AI rate limits
- Duplicate shipment detection across uploads
- Excel upload progress indicator
- Analytics dashboard
- Export reports

---
