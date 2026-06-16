# Dine ePay - Project Details for Blackbook 🎓

You can copy and paste this entire document directly into ChatGPT. Here is the perfect prompt you can use:
> *"I am writing my final year engineering project report (Blackbook). My project is called 'Dine ePay'. Can you use the following project details to generate the Introduction, System Architecture, Features, Methodology, and Conclusion chapters for my Blackbook? Here are the details:"*

---

## 1. Project Title & Overview
**Project Name:** Dine ePay  
**Domain:** Web Application / FinTech / Smart Campus Solution  
**Objective:** To digitize and streamline the campus canteen experience by providing a unified platform where students can view interactive menus, place orders, and make payments using an integrated wallet or QR code system, thereby eliminating long queues and the hassle of physical cash.

## 2. Technology Stack (Implementation details)
- **Frontend Framework:** Next.js 15 (React 19, Server Components, App Router)
- **Styling & UI:** Tailwind CSS v4, Lucide React (Icons)
- **Animations & 3D:** Framer Motion, GSAP (GreenSock), Lenis (Smooth Scrolling), OGL (WebGL)
- **Backend/API:** Next.js Route Handlers (Server-side API)
- **Database & ORM:** PostgreSQL alongside Prisma ORM (`@prisma/client`)
- **Authentication & Security:** JWT (Jose library) and bcryptjs for password hashing.
- **Payment & QR Integrations:** 
  - `html5-qrcode` (For live camera QR scanning)
  - `qrcode` (For dynamic QR generation)
  - `razorpay` (Payment Gateway Integration)

## 3. Core Roles & Actors
The system utilizes a Role-Based Access Control (RBAC) model dividing users into two main entities:
1. **Student (`STUDENT` role):** 
   - Can access the Student Dashboard.
   - Maintains an internal Digital Wallet with a PIN code (Default PIN: 1234).
   - Can scan QR codes to trigger quick transactions.
   - Can browse Interactive 3D menus and place food orders.
2. **Canteen Admin (`CANTEEN` role):** 
   - Has access to the Admin Dashboard.
   - Can add, edit, or remove menu items.
   - Can generate payment QR codes for specific orders/amounts.
   - Can track live orders, transaction statuses (PENDING/PAID/COMPLETED).

## 4. Database Schema (Prisma Data Model)
The system data is structured around three primary tables:
- **User:** Stores `userId`, `password` (hashed), `role`, `walletBalance` (Float), and `walletPin` (String).
- **MenuItem:** Stores `name`, `price`, `category`, `image`, and `available` (Boolean status).
- **Order:** Tracks `totalAmount`, `status` (PENDING/PAID/COMPLETED), `items` (JSON representation of the cart), `paymentId` (Razorpay ID), and `metadata` (for QR details).

## 5. Key Modules & Features
### A. Landing Page & UI
- Deeply interactive landing page featuring Hero, Problem/Solution sections, 3D Premium Food Showcase, and an animated horizontal-scroll Menu Carousel.
- Styled using "Glassmorphism" and immersive dark-mode themes with vibrant orange/red gradients.

### B. Smart QR Payment System
- **QR Generator (`/qr-generator`):** Allows the canteen to generate amounts embedded into QR codes instantly.
- **QR Scanner (`/student/dashboard`):** Opens a real-time camera interface in the browser using `html5-qrcode`. It validates JSON payloads within the QR. 
- Permits PIN-based authentication to deduct funds securely and update server balances.

### C. Digital Campus Wallet
- An embedded wallet initialized with ₹1000 for testing. 
- Allows near-instant transaction processing, avoiding the typical wait times of external UPI/bank gateways, ensuring the lunch queue moves rapidly.

### D. Automated APIs
- Real-time cart calculation and menu synchronization via `/api/menu` and `/api/orders`.
- JWT middleware ensuring protected navigation between the `student` and `admin` routes.

## 6. Real-World Applications & Advantages
- **Faster Checkouts:** Native wallet + QR means payments take >3 seconds.
- **No Change / Cash Issues:** Eliminates the physical handling of low-denomination cash which is a primary pain point in canteens.
- **Better Inventory tracking:** Canteen owners have localized digital ledgers mapping items directly to successful payments.
