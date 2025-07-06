import { useState, useEffect } from "react";

const SensorData = () => {
  const [data, setData] = useState(null);
  const [alertsSent, setAlertsSent] = useState({
    highTemp: false,
    highHumidity: false,
    highCO2: false,
  });

  useEffect(() => {
   
    const eventSource = new EventSource("http://localhost:5000/api/SensorData");

    eventSource.onmessage = (event) => {
      try {
        const sensorData = JSON.parse(event.data);

        console.log("Received Sensor Data:", sensorData); 

        const fixedData = {
          Temperature: sensorData.Temperature || 0,
          Humidity: sensorData.Humidity || 0,
          CO2: sensorData.CO2 ? parseFloat(sensorData.CO2) : 0, 
        };

        setData(fixedData);

        
        if (fixedData.Temperature > 35 && !alertsSent.highTemp) {
          alert(`🔥 High Temperature Alert! Temperature is ${fixedData.Temperature}°C`);
          setAlertsSent((prev) => ({ ...prev, highTemp: true }));
          
        } else if (fixedData.Temperature <= 35 && alertsSent.highTemp) {
          setAlertsSent((prev) => ({ ...prev, highTemp: false }));
        }

        if (fixedData.Humidity > 70 && !alertsSent.highHumidity) {
          alert(`💧 High Humidity Alert! Humidity is ${fixedData.Humidity}%`);
          setAlertsSent((prev) => ({ ...prev, highHumidity: true }));
          
        } else if (fixedData.Humidity <= 70 && alertsSent.highHumidity) {
          setAlertsSent((prev) => ({ ...prev, highHumidity: false }));
        }

        if (fixedData.CO2 > 800 && !alertsSent.highCO2) {
          alert(`⚠️ High CO2 Level Alert! CO2 Level is ${fixedData.CO2} ppm`);
          setAlertsSent((prev) => ({ ...prev, highCO2: true }));
         
        } else if (fixedData.CO2 <= 800 && alertsSent.highCO2) {
          setAlertsSent((prev) => ({ ...prev, highCO2: false }));
        }
      } catch (error) {
        console.error("Error parsing sensor data:", error);
      }
    };

    eventSource.onerror = () => {
      console.error("Error connecting to sensor data stream.");
      eventSource.close();
    };

   
    return () => {
      eventSource.close();
    };
  }, [alertsSent]);

  return (
    <div>
      <h2>Real-time Sensor Data</h2>
      {data ? (
        <table border="1">
          <thead>
            <tr>
              <th>CO2 Level (ppm)</th>
              <th>Temperature (°C)</th>
              <th>Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              style={{
                color:
                  data.Temperature > 35 || data.Humidity > 60 || data.CO2 > 800
                    ? "red"
                    : "black",
                fontWeight: "bold",
              }}
            >
              <td>{data.CO2}</td>
              <td>{data.Temperature}</td>
              <td>{data.Humidity}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Waiting for sensor data...</p>
      )}
    </div>
  );
};

export default SensorData;
