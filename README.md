
# 🚌 LiveBus Next

Real-time bus departure info using Next.js and Open Data Transport API.

---

## 🚀 Getting Started

### Install and Run

```bash
# 1. Clone the repository
git clone https://github.com/kalimanis/livebus-next.git
cd livebus-next

# 2. Install dependencies
yarn install
# or
npm install

# 3. Start the development server
yarn dev
# or
npm run dev
```

Then open your browser and navigate to:

http://localhost:3000

---

## 📦 Usage

- The app fetches live bus departure data from [transport.opendata.ch](https://transport.opendata.ch/).
- When you open the page, it shows:
  - Bus number
  - Departure direction
  - Time left (countdown)
  - Exact departure time (Zurich timezone)
- Countdown timers update automatically every second.
- No backend database is required — data comes directly from the open API.

---

## 🔧 Requirements

- Node.js v18 or higher
- Yarn or npm installed
- Internet connection to reach the Swiss transport API

---

## 🗺️ How it Works

- On load, the frontend calls `/api/bus`.
- The backend (`route.ts`) fetches bus connections from transport.opendata.ch.
- The frontend displays the data and manages local countdown timers.

---

✅ Done!