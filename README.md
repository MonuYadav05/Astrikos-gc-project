# 🚒 Emergency Response Simulation (3D Map Viewer)

A 3D emergency response visualization using CesiumJS that displays firetrucks and ambulances navigating through a mapped environment with realistic paths and animations.

---

## 📸 Preview

![image](https://github.com/user-attachments/assets/05d4c1e6-aa31-4613-a7e1-d50b825f56c3)
![image](https://github.com/user-attachments/assets/3526f397-700e-42a0-ae52-ede9b0c398e0)
![image](https://github.com/user-attachments/assets/21419bcf-ecae-49af-898d-d12ae6e29add)


*Firetruck and ambulance simulation using CesiumJS*

---

## 📦 Features

- 3D vehicle models (FireTruck, Ambulance) with animation and orientation
- Real-time path animation using `SampledPositionProperty`
- Label graphics with styled backgrounds
- Model rotation and camera tracking
- Customizable paths and simulation timing

---

## 🛠️ Installation

Clone the repository and install the dependencies:
##🔧 Setup Instructions
Install Node.js (>= 16.x): https://nodejs.org

```bash
git clone https://github.com/MonuYadav05/Astrikos-gc-project
cd Astrikos-gc-project
npm install
npm run dev
Then open your browser at: http://localhost:5173
```
## 📁 Project Structure

/ ├── public/ │ ├── FireTruck.glb # 3D model used in Cesium │ └── Ambulance.glb ├── src/ │ ├── App.jsx # Main React component │ ├── components/ │ │ └── MapViewer.jsx # CesiumJS viewer setup │ └── data/ │ └── paths.js # Coordinates for firetruck and ambulance ├── README.md ├── vite.config.js └── package.json


## 🧱 Architecture

This project uses **React + Vite** for the frontend and **CesiumJS** for 3D rendering.

### CesiumJS handles:

- 3D globe rendering
- Entity animation with `SampledPositionProperty`
- Custom models and labels

### React handles:

- Component structure
- State management

### Optional Enhancements:

- Camera tracking
- Real-time data feeds via WebSocket or REST API

---

## 🔗 Dependencies

- [`cesium`](https://www.npmjs.com/package/cesium)
- [`resium`](https://github.com/reearth/resium) – React wrapper for Cesium
- `react`, `vite`, `three` (bundled with Cesium)
