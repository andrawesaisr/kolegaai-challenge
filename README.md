
# AI-Powered Document Management System

A modern full-stack application that leverages AI to analyze, categorize, and manage documents intelligently. Built with React, Node.js, and PostgreSQL, featuring AWS S3 storage and OpenAI integration.


## ✨ Key Features

- 📄 PDF & DOCX file support with drag-and-drop interface
- 🤖 AI-powered document analysis and categorization
- 📝 Automatic summary generation using OpenAI
- ☁️ Secure cloud storage with AWS S3
- 🔍 Full-text search capabilities
- 📱 Responsive design for all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Material-UI v5** - Component library
- **Styled Components** - Styling solution
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **AWS S3** - Cloud storage
- **OpenAI API** - AI analysis

## 🚀 Quick Start

### Prerequisites
```bash
# Required software
Node.js >= 16.x
PostgreSQL >= 13
AWS Account
OpenAI API Key
````

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/document-management-system.git
cd document-management-system
```

2. **Backend Setup**

```bash
# Install dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start server
npm run dev
```

3. **Frontend Setup**

```bash
# Install dependencies
cd frontend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm start
```

## 🗄️ Environment Variables

### Backend (.env)

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_bucket_name
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env)

```env
REACT_APP_API_URL= backend_api_url
```

## 📁 Project Structure

```
document-management-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   └── server.js
```

## 🔌 API Endpoints

### Documents

```javascript
// Upload Document
POST /api/upload
Content-Type: multipart/form-data
Body: { document: File }

// Get All Documents
GET /api/documents

// Delete Document
DELETE /api/documents/:id
```

## 💾 Database Schema

```sql
CREATE TABLE Documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  summary TEXT,
  s3Url TEXT NOT NULL,
  uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## 🙏 Acknowledgments

- OpenAI for their powerful API
- AWS for cloud storage solutions
- Material-UI team for the component library
```

## deployment
- backend server on EC2 instance, port 4000 with PM2 to keep the server live.
- frontend on s3 bucket with Pipeline to automate deploying whenever pushed to main branch. 
- postgreSQL on AWS RDS databasse.
