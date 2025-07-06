# Grain Spoilage Detection System

A real-time IoT-based grain spoilage detection system that monitors environmental conditions in grain storage facilities to prevent spoilage and ensure food safety.

## 🌟 Features

- **Real-time Sensor Monitoring**: Continuous monitoring of temperature, humidity, and CO2 levels
- **Alert System**: SMS notifications via Twilio when thresholds are exceeded
- **Web Dashboard**: React-based frontend for real-time data visualization
- **Firebase Integration**: Cloud-based data storage and real-time synchronization
- **ThingSpeak Integration**: IoT platform integration for sensor data
- **Arduino Integration**: Hardware sensor data collection

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Arduino       │    │   Backend       │    │   Frontend      │
│   Sensors       │───▶│   Node.js       │───▶│   React App     │
│   (Hardware)    │    │   Express       │    │   Dashboard     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Firebase      │
                       │   Realtime DB   │
                       └─────────────────┘
```

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Arduino IDE (for hardware setup)
- Firebase project
- Twilio account (for SMS alerts)
- ThingSpeak account (for IoT data)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Shrusti-2405/Detection_of_grain_spoilage.git
cd Detection_of_grain_spoilage
```

### 2. Backend Setup
```bash
cd Innovault/backend
npm install
```

### 3. Frontend Setup
```bash
cd Innovault/frontend
npm install
```

### 4. Environment Configuration

#### Backend Configuration
Create a `.env` file in the `Innovault/backend` directory:
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
RECEIVER_PHONE_NUMBER=your_receiver_phone_number
FIREBASE_DATABASE_URL=your_firebase_database_url
THINGSPEAK_API_KEY=your_thingspeak_api_key
```

#### Frontend Configuration
Create a `.env` file in the `Innovault/frontend` directory:
```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Download the service account key and save as `serviceAccountKey.json` in the backend directory
3. Enable Realtime Database
4. Set up security rules

### Twilio Setup
1. Create a Twilio account
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Update the configuration in the backend

### ThingSpeak Setup
1. Create a ThingSpeak account
2. Create a channel for your sensors
3. Get your API key
4. Update the channel ID and API key in the backend

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server
```bash
cd Innovault/backend
npm start
```
The backend will run on `http://localhost:5000`

### 2. Start the Frontend Application
```bash
cd Innovault/frontend
npm start
```
The frontend will run on `http://localhost:3000`

### 3. Access the Application
- Open your browser and navigate to `http://localhost:3000`
- Login with credentials:
  - Username: `admin`
  - Password: `1234`

## 📊 Monitoring Dashboard

The dashboard displays:
- **Real-time Temperature**: Current temperature readings
- **Real-time Humidity**: Current humidity levels
- **Real-time CO2 Levels**: Current CO2 concentration
- **Alert System**: Visual indicators for threshold violations
- **Historical Data**: Data trends over time

## 🚨 Alert Thresholds

The system triggers alerts when:
- **Temperature > 35°C**: High temperature alert
- **Humidity > 70%**: High humidity alert
- **CO2 > 800 ppm**: High gas level alert

## 🔌 Hardware Setup

### Arduino Components
- DHT22 Temperature and Humidity Sensor
- MQ135 CO2 Sensor
- ESP8266 WiFi Module
- Breadboard and connecting wires

### Arduino Code
The Arduino sketch (`sketch_jan31a/sketch_jan31a.ino`) handles:
- Sensor data reading
- WiFi connectivity
- Data transmission to ThingSpeak
- Local data processing

## 📱 SMS Alerts

The system automatically sends SMS alerts via Twilio when:
- Sensor readings exceed predefined thresholds
- System detects potential spoilage conditions
- Critical environmental changes occur

## 🔒 Security Features

- **Authentication**: Login system for dashboard access
- **Data Encryption**: Secure transmission of sensor data
- **API Protection**: Backend API security measures
- **Firebase Security Rules**: Database access control

## 🛠️ API Endpoints

### Backend API
- `GET /api/SensorData`: Real-time sensor data stream (SSE)
- `POST /api/alerts`: Send SMS alerts
- `GET /api/status`: System status check

## 📈 Data Flow

1. **Sensor Data Collection**: Arduino reads sensor values
2. **Data Transmission**: Data sent to ThingSpeak and Firebase
3. **Backend Processing**: Node.js server processes and validates data
4. **Alert Generation**: SMS alerts sent when thresholds exceeded
5. **Frontend Display**: React app displays real-time data
6. **User Notifications**: Browser alerts and SMS notifications

## 🧪 Testing

### Backend Testing
```bash
cd Innovault/backend
npm test
```

### Frontend Testing
```bash
cd Innovault/frontend
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Shrusti** - *Initial work* - [Shrusti-2405](https://github.com/Shrusti-2405)

## 🙏 Acknowledgments

- Firebase for real-time database
- Twilio for SMS services
- ThingSpeak for IoT platform
- React community for frontend framework
- Node.js community for backend framework

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Watching the repository
- Checking the releases page
- Following the development blog

---

**Note**: This system is designed for educational and research purposes. For production use, ensure proper security measures and compliance with local regulations. 