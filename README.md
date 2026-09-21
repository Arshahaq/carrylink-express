# CarryLink Express

# AIRBRIDGE — AI-Powered Secure International Traveler Delivery Platform

Build a complete, polished, professional web application called **AIRBRIDGE**.

AIRBRIDGE is a secure international delivery marketplace that connects people who need to transport eligible, time-sensitive items internationally with verified travelers who are already flying to the destination.

The concept is similar to a two-sided marketplace such as Uber/Ola, but instead of matching passengers with drivers, AIRBRIDGE matches:

**SENDERS ↔ VERIFIED TRAVELERS ↔ RECIPIENTS**

A sender can create a transport request for an eligible item. The system finds compatible verified travelers who are already traveling on the required route. A traveler can accept the request, complete a secure handover, carry the item during their journey, and hand it over to the recipient using OTP/QR verification.

IMPORTANT:
This is a prototype/demo application. Do NOT claim that the system has actual customs clearance, airline approval, government identity verification, insurance, escrow, or real-world regulatory approval unless a real integration exists. Clearly structure these as simulated/demo verification services that can later be replaced with real APIs.

The application must be extremely polished, professional, clean, understandable and presentation-ready for a Smart India Hackathon demonstration.

DO NOT use a dark theme.

Use a modern LIGHT interface with:

* White backgrounds
* Very light gray sections
* Deep navy/blue primary color
* Blue accent colors
* Green for successful/verified states
* Amber for warnings
* Red only for dangerous/rejected/error states
* Soft shadows
* Rounded cards
* Excellent spacing
* Clear typography
* Professional icons
* Subtle animations
* Strong visual hierarchy

Avoid:

* Excessive gradients
* Neon colors
* Dark backgrounds
* Overly complicated dashboards
* Too many cards on one screen
* Random decorative elements
* Fake futuristic AI graphics
* Excessive animations

The application should feel like a combination of:

* A modern fintech product
* A professional logistics platform
* A secure travel platform
* A polished SaaS dashboard

The interface must be understandable to a first-time user within seconds.

---

# 1. TECHNOLOGY

Use:

* React
* TypeScript
* Vite or the Lovable-supported React setup
* Tailwind CSS
* shadcn/ui where appropriate
* React Router
* Lucide icons
* Recharts for analytics
* Leaflet/OpenStreetMap for maps where useful

Structure the application cleanly so it can later be connected to:

* Supabase
* Real authentication
* Real database
* Real flight APIs
* Real payment provider
* Real identity verification provider
* Real notification services

Do not hard-code the entire UI into one giant component.

Create reusable components and services.

Use a clear structure similar to:

src/
components/
pages/
layouts/
services/
data/
hooks/
types/
utils/

Create realistic mock service functions so that the prototype behaves like a real application.

For example:

authService
shipmentService
travelerService
matchingService
verificationService
paymentService
notificationService
adminService

These can initially use local/mock data and localStorage.

---

# 2. VERY IMPORTANT — EVERYTHING MUST ACTUALLY WORK

Do not create dead buttons.

Every important button should perform an action.

Examples:

* Login works
* Logout works
* Mode selection works
* Create shipment works
* Category selection works
* Eligibility checking works
* Search travelers works
* Matching works
* Accept request works
* Reject request works
* Chat opens
* Notifications work
* Tracking updates work
* QR/OTP verification works
* Package handover works
* Delivery confirmation works
* Profile editing works
* Traveler availability works
* Dashboard statistics update
* Admin actions work
* Shipment status changes persist
* Filters work
* Search works
* Navigation works
* Back buttons work
* Mobile responsive navigation works

Use localStorage or a centralized mock state so actions persist while navigating between pages.

---

# 3. LANDING PAGE

Route:

/

Create a beautiful professional landing page.

Header:

AIRBRIDGE logo

Navigation:

* How It Works
* Safety
* For Travelers
* For Senders
* About

Buttons:

* Login
* Get Started

Hero:

Headline:

**Send What Matters. Travel What Matters.**

Subheadline:

**AIRBRIDGE connects people who need to move eligible items internationally with verified travelers already flying to their destination.**

Primary CTA:

**Send an Item**

Secondary CTA:

**Become a Traveler**

Add a clean visual showing:

Sender
↓
AIRBRIDGE
↓
Verified Traveler
↓
International Flight
↓
Recipient

Do NOT use a generic stock-photo-heavy hero.

Use clean illustrations/icons or a subtle world map.

Add a route search-style visual:

Bengaluru → Dubai
Bengaluru → London
Mumbai → Singapore

Show:

✓ Identity verification
✓ Flight verification
✓ Item eligibility checks
✓ Secure handover
✓ OTP delivery confirmation

---

# 4. HOW IT WORKS

Create a clear 4-step section.

### 01 — Describe Your Item

Choose the category and provide item details.

### 02 — Find a Verified Traveler

AIRBRIDGE finds travelers flying along your route.

### 03 — Secure Handover

Both parties verify the package using QR/OTP.

### 04 — Confirm Delivery

Recipient confirms delivery and the shipment is completed.

---

# 5. SAFETY SECTION

Create a dedicated section:

## Built Around Trust

Cards:

### Identity Verification

Users go through demo identity verification before participating.

### Flight Verification

Traveler's flight information is verified in the prototype.

### Item Eligibility

The system checks item category, weight, value, battery information and destination.

### Secure Handover

QR code + OTP + timestamp are recorded.

### Chain of Custody

Every important package event is recorded.

### Risk Detection

Suspicious shipments can be flagged for review.

---

# 6. LOGIN PAGE

Route:

/login

Create a professional single login page.

DO NOT create separate login pages for Sender and Traveler.

There should be ONE login system.

Demo credentials should be displayed clearly on the page.

Create two demo accounts:

### Demo User 1 — Sender/Traveler

Email:
[sender@airbridge.demo](mailto:sender@airbridge.demo)

Password:
Demo@123

### Demo User 2 — Traveler/Sender

Email:
[traveler@airbridge.demo](mailto:traveler@airbridge.demo)

Password:
Demo@123

Both users should be able to use BOTH sides of the platform.

After login, DO NOT immediately force the user into only one role.

Instead show a role/mode selection screen.

---

# 7. POST-LOGIN MODE SELECTION

Route:

/select-mode

Title:

## How would you like to use AIRBRIDGE?

Two large professional cards:

### 📦 I Want to Transport an Item

Description:

**Send an eligible item to another country through a verified traveler.**

Button:

**Transport an Item**

Features:

* Find matching travelers
* Track shipment
* Secure handover
* Delivery confirmation

---

### ✈️ I Want to Travel & Carry

Description:

**Share your upcoming international journey and carry eligible items for other users.**

Button:

**Become a Traveler**

Features:

* Add upcoming flight
* Set carrying capacity
* Review matched requests
* Earn a service reward

Also include:

**You can switch modes anytime from your profile.**

This is VERY IMPORTANT.

The same account can be both:

* Sender
* Traveler

---

# 8. SENDER DASHBOARD

Route:

/sender/dashboard

Professional dashboard.

Header:

Good evening, Shahan

Show:

### Active Shipments

2

### Delivered

8

### Awaiting Match

1

### Verification Required

1

Main CTA:

**+ Create New Shipment**

Recent shipments:

Example:

📦 University Documents
Bengaluru → Dubai
Status: Traveler Matched

📱 Smartphone
Bengaluru → London
Status: Verification Required

Each shipment opens its detail page.

---

# 9. CREATE SHIPMENT

Route:

/sender/create

This is one of the most important pages.

Make it a multi-step wizard with a progress indicator.

Steps:

1. Item
2. Details
3. Route
4. Eligibility
5. Traveler Match
6. Review
7. Confirm

Do NOT put everything on one giant page.

---

# 10. STEP 1 — ITEM CATEGORY

Title:

## What are you sending?

Show beautiful category cards.

Categories:

### 📄 Documents

* Certificates
* University documents
* Business documents
* Legal documents
* Personal documents
* Other documents

### 💻 Electronics

* Smartphone
* Laptop
* Tablet
* Camera
* Smartwatch
* Accessories
* Other electronics

### 👕 Personal Items

* Clothes
* Books
* Gifts
* Toys
* Accessories
* Small personal belongings

### 💊 Medicines

* Prescription medicine
* Non-prescription medicine
* Medical supplies

### 🍫 Food

* Packaged food
* Snacks
* Dry food
* Other food

### 🏢 Business

* Product samples
* Business documents
* Small equipment
* Other business items

### 📦 Other

* Requires manual verification

The user MUST select a category before continuing.

---

# 11. ITEM DETAILS

After category selection show dynamic fields.

Common fields:

Item name
Quantity
Approximate weight
Dimensions
Approximate value
New/Used
Purpose

For electronics:

Does it contain a battery?

Yes / No

Battery type

For medicine:

Prescription required?

Yes / No

Upload supporting document

For food:

Is it sealed?

Yes / No

For documents:

Document type

Sensitive information?

Yes / No

For business:

Commercial or personal?

Commercial quantity?

The UI should dynamically change depending on the selected category.

---

# 12. ROUTE

Route fields:

From:
Bengaluru, India

To:
Dubai, UAE

Departure deadline:

Date

Delivery urgency:

Standard
Urgent

Pickup preference:

Designated location
Airport
Other approved location

Delivery preference:

Designated location
Airport

Show a visual route map.

---

# 13. AI / ELIGIBILITY CHECK

Create a realistic working demo eligibility engine.

When the user clicks:

**Check Eligibility**

show a short animated checking sequence:

✓ Checking category
✓ Checking item details
✓ Checking weight
✓ Checking battery information
✓ Checking destination requirements
✓ Checking transport restrictions

Then show one of three outcomes.

### GREEN

**Eligible for matching**

"This item passes the prototype's initial eligibility checks. Final transport remains subject to applicable airline, airport, customs and legal requirements."

### AMBER

**Additional Verification Required**

"Additional information or documentation is required before this shipment can be matched."

### RED

**Unable to Proceed**

"The item cannot be accepted under the platform's current rules."

Never provide instructions for circumventing restrictions.

---

# 14. MATCHING ENGINE

After eligibility approval, show:

## Finding Compatible Travelers

Create a professional matching animation.

Then display traveler cards.

Example:

### Rahul S.

✓ Identity Verified
✓ Flight Verified

Bengaluru → Dubai
25 Sep · 10:25 PM

Available capacity:
2.0 kg

Completed transfers:
14

Rating:
4.8

Compatibility:
96%

Button:

**View Match**

Second traveler:

### Ahmed K.

✓ Identity Verified
✓ Flight Verified

Bengaluru → Dubai
26 Sep · 8:40 PM

Capacity:
3.5 kg

Compatibility:
91%

Button:

**View Match**

Do not expose private personal information.

---

# 15. MATCH DETAILS

Route:

/sender/matches/:id

Show:

Traveler profile
Verification status
Flight
Route
Departure
Estimated arrival
Available capacity
Completed transfers
Rating
Compatibility factors

Show a breakdown:

Route compatibility ✓
Weight compatibility ✓
Schedule compatibility ✓
Category eligibility ✓
Verification ✓

Button:

**Request Handover**

---

# 16. TRAVELER DASHBOARD

Route:

/traveler/dashboard

Dashboard cards:

Upcoming Flight
Available Requests
Active Deliveries
Completed Transfers
Estimated Rewards

Example:

### Upcoming Flight

Bengaluru → Dubai
25 Sep
EK565

Status:

✓ Flight Verified

Main CTA:

**Manage My Flights**

---

# 17. ADD FLIGHT

Route:

/traveler/add-flight

Fields:

Departure airport
Destination airport
Flight number
Travel date
Departure time
Arrival time
Available capacity
Preferred item categories
Maximum item value
Pickup preference
Delivery preference

Button:

**Verify Flight**

Then show:

✓ Flight information verified

Store the flight in mock state.

---

# 18. TRAVELER REQUESTS

Route:

/traveler/requests

Show available compatible shipment requests.

Example:

### University Documents

Bengaluru → Dubai

Weight:
0.3 kg

Category:
Documents

Required by:
26 Sep

Reward:
₹850

Status:
Eligible

Button:

**View Request**

---

# 19. REQUEST DETAIL

Route:

/traveler/requests/:id

Show:

Item category
Item description
Weight
Approximate value
Route
Required delivery date
Sender verification
Eligibility status
Handover method
Reward

IMPORTANT:

Do not reveal unnecessary sender information.

Buttons:

**Accept Request**

**Decline**

If accepted:

Show confirmation modal:

"By accepting, you confirm that you will independently inspect the package at handover and will not carry any item that does not match its declaration."

Then:

**Confirm Acceptance**

---

# 20. SHIPMENT DETAIL PAGE

Route:

/shipments/:id

This should be one of the most polished pages.

Header:

Shipment
AB-IND-DXB-7F29

Status:

**In Transit**

Timeline:

✓ Shipment Created
✓ Eligibility Checked
✓ Traveler Matched
✓ Handover Completed
● In Transit
○ Destination Arrival
○ Recipient Verification
○ Delivered

Show:

From
Bengaluru

To
Dubai

Item
University Documents

Weight
0.3 kg

Traveler
Rahul S.
✓ Verified

Flight
EK565

---

# 21. DIGITAL CHAIN OF CUSTODY

On shipment detail page show:

### Chain of Custody

Created
21 Sep · 18:32

Eligibility verified
21 Sep · 18:34

Traveler accepted
21 Sep · 18:41

Package handed over
21 Sep · 20:15

Traveler departed
25 Sep · 22:25

Each event should have:

* timestamp
* status
* verification method

---

# 22. HANDOVER PAGE

Route:

/shipments/:id/handover

Show:

## Secure Package Handover

Step 1:

Compare package details.

Step 2:

Scan package QR.

Step 3:

Enter sender/traveler OTP.

Step 4:

Confirm package condition.

Step 5:

Capture demo package photo.

Then:

**Confirm Handover**

After confirmation:

Shipment status becomes:

**In Transit**

The dashboard should update automatically.

---

# 23. RECIPIENT DELIVERY

Route:

/shipments/:id/delivery

Show:

## Confirm Delivery

Recipient enters:

6-digit OTP

Then:

QR verification

Then:

Package condition:

Good
Damaged
Seal broken

Then:

**Confirm Delivery**

On success:

🎉

**Shipment Delivered**

Timeline updates.

---

# 24. SECURE CHAT

Route:

/messages

Create a professional in-platform messaging interface.

Users can communicate about:

* Handover location
* Timing
* Shipment details

Do not expose phone numbers automatically.

Add:

Report User
Block User

Add warning if users type phrases such as:

"Don't declare this"

"Open the package"

"Carry something else"

"Don't tell customs"

This can be simulated with a simple keyword/risk detector.

If triggered:

⚠️

**Potential policy violation detected**

"Please keep all shipment details accurate and follow applicable transport requirements."

---

# 25. NOTIFICATIONS

Create notification center.

Examples:

✓ Flight verified
✓ Traveler accepted your shipment
⚠️ Additional verification required
📦 Handover scheduled
✈️ Traveler departed
📍 Shipment arrived
🔐 Delivery OTP generated

Notifications should be interactive and open the relevant page.

---

# 26. PROFILE

Route:

/profile

Show:

Profile photo
Name
Email
Phone
Verification status

### Identity

✓ Email verified
✓ Phone verified
✓ Identity verification — Demo Verified

### Activity

Completed shipments
Completed transfers
Ratings

### Modes

☑ Sender
☑ Traveler

Button:

**Switch Mode**

---

# 27. SECURITY CENTER

Route:

/security

This should be a dedicated professional page.

Sections:

### Identity Security

✓ Account verified

### Shipment Security

✓ Item eligibility checks
✓ Package ID
✓ QR verification
✓ OTP verification

### Traveler Security

✓ Flight verification

### Communication Security

✓ In-app messaging
✓ Report/block

### Risk Detection

✓ Suspicious activity monitoring

Add a security score visualization, but label it clearly as a DEMO score.

---

# 28. ADMIN DASHBOARD

Create a hidden/demo admin account:

Email:
[admin@airbridge.demo](mailto:admin@airbridge.demo)

Password:
Admin@123

Route:

/admin

Admin dashboard should be visually different but still light and professional.

Top statistics:

Total Users
Active Travelers
Active Shipments
Completed Deliveries
Pending Verification
Flagged Shipments

---

# 29. ADMIN MAP

Route:

/admin/map

Use Leaflet.

Show demo international routes:

Bengaluru → Dubai
Bengaluru → London
Mumbai → Singapore
Delhi → Toronto

Use markers for:

Travelers
Active shipments
Airports

Clicking a marker opens details.

Do not fake real-time GPS.

Clearly label demo locations as simulated data.

---

# 30. ADMIN SHIPMENT MANAGEMENT

Route:

/admin/shipments

Table:

Shipment ID
Sender
Traveler
Route
Category
Status
Risk
Created
Action

Filters:

All
Pending
Matched
In Transit
Delivered
Flagged
Verification Required

Search must work.

Clicking a row opens shipment details.

---

# 31. ADMIN VERIFICATION CENTER

Route:

/admin/verification

Show shipments requiring review.

Example:

### Shipment AB-IND-DXB-8A21

Category:
Medicine

Status:

⚠️ Verification Required

Reason:

Supporting documentation required.

Actions:

Review
Approve
Reject
Request Information

All actions should update mock state.

---

# 32. ADMIN RISK CENTER

Route:

/admin/risk

Show:

Flagged shipments
Suspicious accounts
Repeated cancellations
Policy violations

Example:

🚨 Shipment AB-IND-LHR-22F1

Reason:
Item description changed twice.

Risk:
Medium

Actions:

Review
Freeze Shipment
Clear Flag

---

# 33. ADMIN USER MANAGEMENT

Route:

/admin/users

Show:

User
Verification
Role
Completed transfers
Rating
Status

Actions:

View
Suspend
Reactivate

Use confirmation dialogs.

---

# 34. ANALYTICS

Route:

/admin/analytics

Use Recharts.

Show:

Shipments by category
Popular routes
Completed deliveries
Pending verification
Traveler participation
Monthly shipment volume

Use clean professional charts.

---

# 35. DEMO DATA

Pre-populate the application with realistic data.

Users:

1. Shahan Haq
2. Rahul Sharma
3. Ahmed Khan
4. Priya Nair
5. Daniel Thomas

Travelers:

Bengaluru → Dubai
Bengaluru → London
Mumbai → Singapore
Delhi → Toronto

Shipments:

University documents
Smartphone
Business documents
Books
Personal items

Include different statuses:

Pending
Verification Required
Matched
Handover Pending
In Transit
Delivered
Flagged

---

# 36. GLOBAL SEARCH

Add a search feature to dashboards.

Search:

Shipment ID
Route
Traveler
Sender
Category

Results should navigate to the relevant page.

---

# 37. RESPONSIVE DESIGN

The entire application must work on:

Desktop
Laptop
Tablet
Mobile

Desktop should have:

Left sidebar navigation

Mobile should have:

Bottom navigation or compact menu

Do not allow horizontal scrolling.

---

# 38. SIDEBAR

Sender mode:

Overview
Create Shipment
My Shipments
Matches
Messages
Notifications
Security
Profile

Traveler mode:

Overview
My Flights
Requests
Active Deliveries
Completed
Messages
Notifications
Security
Profile

Admin mode:

Overview
Live Map
Shipments
Verification
Risk Center
Users
Analytics

At the top/bottom of sidebar show:

### Mode

📦 Sender

or

✈️ Traveler

Clicking it should allow switching modes.

---

# 39. ROUTING

Implement real React Router routes.

Required routes:

/
/login
/select-mode

Sender:

/sender/dashboard
/sender/create
/sender/matches
/sender/shipments
/sender/shipments/:id

Traveler:

/traveler/dashboard
/traveler/add-flight
/traveler/flights
/traveler/requests
/traveler/requests/:id
/traveler/deliveries

Shared:

/shipments/:id
/shipments/:id/handover
/shipments/:id/delivery
/messages
/notifications
/profile
/security

Admin:

/admin
/admin/map
/admin/shipments
/admin/verification
/admin/risk
/admin/users
/admin/analytics

Create a proper 404 page.

Protected routes should redirect unauthenticated users to /login.

---

# 40. STATE MANAGEMENT

Create a centralized mock application state.

Persist important changes to localStorage.

Persist:

* Logged-in user
* Current mode
* Shipments
* Traveler flights
* Matches
* Shipment statuses
* Notifications
* Messages
* Verification states
* Admin actions

Refreshing the browser should NOT completely reset the demo state.

---

# 41. IMPORTANT DEMO FLOW

The entire project must support this exact presentation flow:

### Demo 1 — Sender

Login:

[sender@airbridge.demo](mailto:sender@airbridge.demo)
Demo@123

Select:

**Transport an Item**

Create shipment:

Category:
Documents

Item:
University Certificate

Weight:
0.3 kg

Route:
Bengaluru → Dubai

Click:

Check Eligibility

Result:

✓ Eligible

Then:

Find Travelers

Show:

Rahul Sharma

Flight:
Bengaluru → Dubai

Accept/request traveler.

Shipment becomes:

**Traveler Matched**

---

### Demo 2 — Traveler

Logout.

Login:

[traveler@airbridge.demo](mailto:traveler@airbridge.demo)
Demo@123

Select:

**Become a Traveler**

Add flight:

Bengaluru → Dubai

Flight:
EK565

Capacity:
2 kg

Show compatible request:

University Certificate

Accept it.

Shipment becomes:

**Handover Pending**

---

### Demo 3 — Handover

Open shipment.

Click:

Secure Handover

Show QR/OTP process.

Confirm.

Shipment becomes:

**In Transit**

---

### Demo 4 — Delivery

Open shipment.

Click:

Confirm Delivery

Enter demo OTP:

482913

Confirm.

Shipment becomes:

**Delivered**

Dashboard statistics should update.

---

### Demo 5 — Admin

Login:

[admin@airbridge.demo](mailto:admin@airbridge.demo)
Admin@123

Show:

Admin Dashboard

Open:

Verification Center

Open a flagged shipment.

Freeze shipment.

Return to dashboard.

Show the updated status.

---

# 42. UI QUALITY REQUIREMENTS

This is extremely important.

The application should NOT look like a generic AI-generated dashboard.

Use:

* Consistent 8px spacing system
* Maximum content width
* Professional typography
* Clear hierarchy
* Consistent card radius
* Consistent button styles
* Subtle shadows
* Proper hover states
* Skeleton loading states
* Empty states
* Error states
* Success states
* Confirmation modals
* Toast notifications
* Tooltips where useful

Use animations sparingly.

Example:

When shipment is successfully created:

Show a subtle success animation.

When matching travelers:

Show a short professional loading animation.

Do not use excessive bouncing elements.

---

# 43. ACCESSIBILITY

Use:

* Semantic HTML
* Proper labels
* Keyboard navigation
* Good color contrast
* Accessible buttons
* Accessible form validation
* Clear error messages

Do not rely only on color to communicate status.

For example:

✓ Verified
⚠ Needs Review
✕ Rejected

---

# 44. SECURITY UX

Never display sensitive information unnecessarily.

Do not display:

* Full passport number
* Full government ID
* Password
* Private addresses

Use masked values where appropriate.

Example:

Passport:
********4821

Phone:
******7821

---

# 45. ERROR HANDLING

Every form should have validation.

Examples:

Weight cannot be negative.

Value cannot be negative.

Destination cannot equal origin.

Flight date cannot be in the past.

Required fields must be completed.

If an item needs verification:

Do not allow the user to proceed to traveler matching until the required step is completed.

Show clear errors.

---

# 46. IMPORTANT PRODUCT PRINCIPLE

AIRBRIDGE is NOT simply a courier marketplace.

Its differentiation is:

### 1. AI-assisted item eligibility

### 2. Verified traveler matching

### 3. Flight verification

### 4. Secure chain of custody

### 5. QR + OTP handover

### 6. Risk detection

### 7. Transparent shipment tracking

Make these features visible throughout the application.

---

# 47. AI FEATURES FOR THE PROTOTYPE

Create mock AI services that behave realistically.

### AI Eligibility Assistant

Input:

Category
Item
Weight
Battery
Destination
Value

Output:

Eligibility status
Reason
Required documents

### Smart Matching Engine

Calculate a demo compatibility score using:

Route = 30%
Schedule = 20%
Capacity = 20%
Category = 10%
Verification = 10%
Urgency = 10%

Display the score as:

"96% Compatible"

Do not call this a real-world risk guarantee.

### Risk Detection

Use mock rules to detect:

* suspicious description changes
* prohibited-category attempts
* unusual cancellation patterns
* suspicious messages

Return:

Low
Medium
High

---

# 48. DEMO MODE INDICATORS

Because this is a prototype, use subtle labels where necessary:

**Demo Verification**

**Simulated Flight Verification**

**Demo Payment**

**Simulated Location**

Do not make the user think these are actual government/airline integrations.

---

# 49. NO FAKE REAL-TIME CLAIMS

Do not claim:

"Live flight tracking"

unless an actual API is connected.

Instead:

"Demo flight status"

Do not claim:

"Government verified"

unless a real government verification service is connected.

Instead:

"Demo identity verified"

Do not claim:

"Guaranteed customs clearance."

Instead:

"Subject to applicable customs and transport requirements."

---

# 50. FINAL POLISH

Before considering the project complete, check:

* Every route works
* Every button works
* No dead links
* No console errors
* No TypeScript errors
* No broken images
* No overflowing text
* No horizontal scrolling
* Forms validate
* Login works
* Logout works
* Mode switching works
* Sender workflow works
* Traveler workflow works
* Admin workflow works
* Shipment status changes work
* Notifications work
* Mock chat works
* Matching works
* QR/OTP workflow works
* LocalStorage persistence works
* Mobile layout works

Build the application as a coherent product, not a collection of disconnected screens.

The final result should look like a serious startup/product prototype suitable for a **Smart India Hackathon presentation and live demo**.

Most importantly:

**KEEP THE INTERFACE SIMPLE.**

The user should always know:

1. What am I doing?
2. What step am I on?
3. What do I need to do next?
4. Is my shipment safe?
5. What is its current status?

Use clear CTAs and avoid overwhelming users with unnecessary information.

Start by implementing the complete application architecture, routing, mock state/services and core workflows, then polish every page visually.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7256814a-2a81-449c-b557-c6c1469db2b7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
