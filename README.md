# QR Master

Professional QR code generator with advanced customization options. Create dynamic QR codes with custom shapes, colors, effects, and logos.

## Overview

QR Master is a full-stack application that allows users to generate QR codes for various content types (URLs, PDFs, emails, WiFi, contacts, and social media). The platform provides extensive design customization through an intuitive web interface, supporting multiple shape styles, color schemes, gradient effects, and center logos.

## Technology Stack

**Frontend**
- React 18
- Vite (build tool)
- Bootstrap 5 (styling)
- ES6 modules

**Backend**
- Node.js
- Express.js
- qr-code-styling (QR generation)
- Canvas (image rendering)

## Project Structure

```
qr-master-project/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── body/           # Body shape preview SVGs (1-6)
│   │   │   ├── edges/          # Corner style preview SVGs (1-7)
│   │   │   └── logo.png
│   │   ├── pages/
│   │   │   └── QrPage.jsx      # Main QR generator component
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── backend/
    ├── server.js               # Express server & API endpoints
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository
```bash
cd qr-master-project
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

## Running the Application

### Development Mode

Terminal 1 - Start the backend server:
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

Terminal 2 - Start the frontend development server:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5179`

Open your browser and navigate to `http://localhost:5179`

### Production Build

Frontend:
```bash
cd frontend
npm run build
```

## Core Features

**QR Content Types**
- Website URLs
- PDF files (via URL upload)
- Email addresses with subject and message
- Phone numbers and SMS
- WiFi connection details
- Contact information (vCard)
- Social media profiles (Facebook, Instagram, Twitter/X, LinkedIn, YouTube, TikTok)

**Design Customization**

Color Section:
- Preset color palette for QR dots
- Custom color picker
- Background options: None, Solid color, or Gradient effects
- 12 pre-built gradient effects

Shape Section:
- 6 body type styles (Square, Dots, Rounded, Extra Rounded, Classy, Classy Rounded)
- 7 corner/edge styles with visual previews
- Real-time QR preview

Logo Section:
- Add custom PNG/JPG image to center of QR code
- Live preview with URL input

**Export Options**
- Download as PNG
- Download as SVG

## API Endpoint

**POST** `/api/generate-qr`

Request body:
```json
{
  "text": "content to encode",
  "color": "#000000",
  "bgColor": "#ffffff",
  "dotsType": "square",
  "cornersType": "square",
  "logo": "https://example.com/logo.png"
}
```

Response:
```json
{
  "qrImage": "data:image/png;base64,..."
}
```

## Component Architecture

**Frontend - QrPage.jsx**
- State management for QR content, colors, shapes, and settings
- Real-time QR generation on input/setting changes
- Tabbed interface for Color, Shape, and Logo customization
- Image-based button system for shape and edge selection

**Backend - server.js**
- Accepts QR configuration from frontend
- Uses qr-code-styling library to generate QR with custom parameters
- Renders SVG to PNG using Canvas
- Returns base64-encoded image data

## Asset Structure

Shape and edge styles are represented with preview SVG images:

- `/assets/body/`: 6 SVG previews for body types (numbered 1-6)
- `/assets/edges/`: 7 SVG previews for corner styles (numbered 1-7)

These provide visual feedback when selecting design options.

## UI/UX Design

- Clean, modern interface with card-based layout
- Two-column design: Controls (left) and QR Preview (right)
- Responsive grid system using Bootstrap utilities
- Hover effects and smooth transitions on interactive elements
- Color-coded buttons (teal accent color: #0a9396)
- Checkmark indicators for selected options

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

Tested on modern browsers with ES6 support.

## Development Notes

- Frontend imports are ES6 modules
- SVG assets are imported as modules
- Image arrays map indices to imported SVG modules for dynamic loading
- Real-time QR generation uses 400ms debounce
- Bootstrap 5 utilities for responsive styling

## Troubleshooting

**Frontend won't start**
- Ensure backend is running on port 5000
- Clear node_modules and reinstall: `npm install`
- Check that port 5179 is available

**QR generation fails**
- Verify backend server is running
- Check browser console for CORS issues
- Ensure valid input content is provided

**Images not displaying**
- Confirm SVG files exist in `/frontend/src/assets/body/` and `/frontend/src/assets/edges/`
- Check that imports match actual file names and paths

## Future Enhancements

- Batch QR code generation
- QR code analytics
- Advanced customization presets
- QR code history/library
- Dark mode
- Multi-language support

## License

Private project
