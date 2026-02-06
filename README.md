# KostKoin v3 - Kost Per Jam di Banten

## Quick Start

1. **Setup Database**
   ```bash
   # Jalankan SQL di Supabase SQL Editor
   supabase/schema.sql
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env dengan Supabase credentials
   ```

3. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

4. **Deploy**
   ```bash
   vercel
   ```

## Features
- Dual Role System (Penyewa & Pemilik)
- Real-time booking
- QR Code access
- Map-based search (Leaflet + OSM)
- PWA support
