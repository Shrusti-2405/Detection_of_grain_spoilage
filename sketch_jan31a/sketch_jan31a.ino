#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_PCF8574.h>
#include "DHT.h"

 
#define WIFI_SSID "Xyz"
#define WIFI_PASSWORD "shrustimp24"


#define FIREBASE_HOST "https://real-time-monitoring-92f83-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "VzOhp5j3VdCdH6VtUmBchzwtT5q125mD5a2DwkPZ"


const char* THINGSPEAK_API_KEY = "C5J1MLU1VY9BN0U5";
const char* THINGSPEAK_SERVER = "http://api.thingspeak.com";


#define DHTPIN 26
#define DHTTYPE DHT22
#define MQ135_PIN 34
#define BUZZER 25
#define RED_LED 27    
#define YELLOW_LED 12  
#define BLUE_LED 14    


DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_PCF8574 lcd(0x27);


const float TEMP_THRESHOLD = 35.0;
const float HUMIDITY_THRESHOLD = 70.0;
const int CO2_THRESHOLD = 800;

void setup() {
  Serial.begin(9600);
  Wire.begin(21, 22); 

  
  connectToWiFi();

  
  dht.begin();
  lcd.begin(16, 2);
  lcd.setBacklight(255);
  lcd.setCursor(0, 0);
  lcd.print("System Initializing");
  delay(2000);
  lcd.clear();

 
  pinMode(BUZZER, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);

  
  resetAlarms();
}

void loop() {
  
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int sensorValue = analogRead(MQ135_PIN);
  float co2_ppm = sensorValue / 10.0;  

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  Serial.print("Temp: "); Serial.print(temperature); Serial.print("°C  ");
  Serial.print("Humidity: "); Serial.print(humidity); Serial.print("%  ");
  Serial.print("CO2: "); Serial.print(co2_ppm); Serial.println(" ppm");

  lcd.setCursor(0, 0);
  lcd.print("T:"); lcd.print(temperature); lcd.print("C ");
  lcd.print("H:"); lcd.print(humidity); lcd.print("%");

  lcd.setCursor(0, 1);
  lcd.print("CO2: "); lcd.print(co2_ppm); lcd.print("ppm ");

  
  sendDataToFirebase(temperature, humidity, co2_ppm);

  
  sendDataToThingSpeak(temperature, humidity, co2_ppm);

  
  checkThresholds(temperature, humidity, co2_ppm);

  delay(5000);  
}

void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int retry = 0;

  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    Serial.print(".");
    delay(1000);
    retry++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to Wi-Fi");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to Wi-Fi!");
  }
}

void sendDataToFirebase(float temperature, float humidity, float co2_ppm) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Disconnected! Reconnecting...");
    connectToWiFi();
  }

  HTTPClient http;
  String firebaseUrl = String(FIREBASE_HOST) + "/SensorData.json?auth=" + FIREBASE_AUTH;

  String jsonData = "{\"Temperature\":" + String(temperature) +
                    ",\"Humidity\":" + String(humidity) +
                    ",\"CO2\":" + String(co2_ppm) + "}";

  http.begin(firebaseUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.PATCH(jsonData); 
  Serial.print("Firebase Response Code: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode != 200) {
    Serial.println("Error: Failed to update Firebase!");
  }

  http.end();
}

void sendDataToThingSpeak(float temperature, float humidity, float co2_ppm) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Disconnected! Reconnecting...");
    connectToWiFi();
  }

  HTTPClient http;
  String thingspeakUrl = String(THINGSPEAK_SERVER) + "/update?api_key=" + THINGSPEAK_API_KEY +
                         "&field1=" + String(temperature) +
                         "&field2=" + String(humidity) +
                         "&field3=" + String(co2_ppm);

  http.begin(thingspeakUrl);
  int httpResponseCode = http.GET();

  Serial.print("ThingSpeak Response Code: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode != 200) {
    Serial.println("Error: Failed to update ThingSpeak!");
  }

  http.end();
}

void checkThresholds(float temperature, float humidity, float co2_ppm) {
  
  resetAlarms();

  if (temperature > TEMP_THRESHOLD) {
    lcd.clear();
    lcd.print("Warning: High Temp");
    Serial.println("ALERT: High Temperature!");
    digitalWrite(YELLOW_LED, HIGH);
    triggerAlarm();
  }

  if (humidity > HUMIDITY_THRESHOLD) {
    lcd.clear();
    lcd.print("Warning: High Humid");
    Serial.println("ALERT: High Humidity!");
    digitalWrite(RED_LED, HIGH);
    triggerAlarm();
  }

  if (co2_ppm > CO2_THRESHOLD) {
    lcd.clear();
    lcd.print("CO2 Level High!");
    Serial.println("ALERT: High CO2!");
    digitalWrite(BLUE_LED, HIGH);
    triggerAlarm();
  }
}

void triggerAlarm() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER, HIGH);
    delay(500);
    digitalWrite(BUZZER, LOW);
    delay(500);
  }
}

void resetAlarms() {
  digitalWrite(BUZZER, LOW);
  digitalWrite(RED_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(BLUE_LED, LOW);
}
