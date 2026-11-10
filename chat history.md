# Nutsumo Marketplace — Conversation & Development History

**Project:** Nutsumo (LocalHomeFix) Service Marketplace  
**Workspace:** `nutsumo-frontend`  
**Date:** November 10, 2026  
**Objective:** End-to-End Escrow & Booking Lifecycle Sync (Large-Scale Enterprise Marketplace Architecture)

---

## 📌 Conversation Transcript

### 💬 Turn 1
**User:**
> tmr ki amr ei project er requirement goal mone ache?

**Assistant:**
> হ্যাঁ, **Nutsumo** (LocalHomeFix) প্রজেক্টের রিকোয়ারমেন্ট এবং গোল আমার খুব ভালোভাবেই মনে আছে। 
> 
> নিচে মূল বিষয়গুলোর একটি সংক্ষেপ তুলে ধরছি:
> 
> ---
> 
> ### ১. প্ল্যাটফর্মের মূল লক্ষ্য (Core Goal)
> Nutsumo হলো একটি **On-Demand Local Home Services Marketplace** (যেমন: TaskRabbit, Thumbtack বা Upwork-এর মতো মডেল)। এখানে মূলত ৩টি রোল রয়েছে:
> 1. **Customer (Homeowner / Client):** কাজের রিকোয়ারমেন্ট দিয়ে Job Post করে, প্রোপোজাল/কোটেশন পর্যালোচনা করে এবং কাজ শেষে রিভিউ দেয়।
> 2. **Artisan / Pro (Service Provider):** নিজের প্রোফাইল, সার্ভিস ও পোর্টফোলিও সাজিয়ে জবে কোটেশন/বিড সাবমিট করে এবং কাজ সম্পন্ন করে প্রুফ জমা দেয়।
> 3. **Admin:** প্ল্যাটফর্ম ম্যানেজমেন্ট, প্রো ভেরিফিকেশন, ডিসপিউট হ্যান্ডলিং এবং এসক্রো পে-আউট অনুমোদন করে।
> 
> ---
> 
> ### ২. এন্ড-টু-এন্ড এসক্রো ও বুকিং লাইফসাইকেল (Escrow Payment Workflow)
> প্ল্যাটফর্মের সবচেয়ে গুরুত্বপূর্ণ কোর ফিচার হলো **নিরাপদ ৮-ধাপের এসক্রো মডেল**:
> 
> 1. **Job Posting:** কাস্টমার ক্যাটাগরি, সার্ভিস, লোকেশন/পোস্টকোড ও বাজেট দিয়ে জব পোস্ট করে (`status: OPEN`)।
> 2. **Quotation Submission:** ভেরিফাইড আর্টিসান জবে ফিক্সড/আওয়ারলি রেটে প্রস্তাব পাঠায় (`status: PENDING`)।
> 3. **Acceptance & Booking:** কাস্টমার কোটেশন এক্সেপ্ট করলে বুকিং তৈরি হয় (`AWAITING_PAYMENT`)।
> 4. **Stripe Escrow Payment:** কাস্টমার ফুল অ্যামাউন্ট পেমেন্ট করে। পেমেন্ট প্ল্যাটফর্মের এসক্রোতে জমা থাকে (`paymentStatus: ESCROW_HELD`, `status: CONFIRMED`)।
> 5. **Start & Delivery:** আর্টিসান কাজ শুরু করে (`IN_PROGRESS`) এবং সম্পন্ন হলে প্রুফ ছবি ও ডেলিভারি নোটসহ সাবমিট করে (`DELIVERED`)।
> 6. **Customer Inspection:** 
>    - কাজ ঠিক থাকলে কাস্টমার অনুমোদন ও রিভিউ দেয় (`COMPLETED`)।
>    - কোনো সমস্যা থাকলে রিভিশন চাইতে পারে (`REVISION_REQUESTED`) বা ডিসপিউট করতে পারে (`DISPUTED`)।
> 7. **Admin Approval:** অ্যাডমিন বুকিং রিভিউ করে পে-আউট অ্যাপ্রুভ করে (`APPROVED`)।
> 8. **Payout Release:** প্ল্যাটফর্ম কমিশন (১০%) কেটে বাকি নেট টাকা আর্টিসানের অ্যাকাউন্টে রিলিজ করা হয় (`payoutStatus: RELEASED`)।
> 
> ---
> 
> ### ৩. বর্তমান ফ্রন্টএন্ড আর্কিটেকচার ও ডিজাইন সিস্টেম
> - **ফ্রন্টএন্ড স্ট্যাক:** Next.js (App Router), TypeScript, Tailwind CSS, Ant Design (কাস্টম থিম)।
> - **ডিজাইন টোকেনস (LocalHomeFix / Plumby):** 
>   - Primary: `#0D56D6`
>   - Secondary/Hover: `#00A1DE`
>   - Typography: Rubik (Headings / Buttons) ও Archivo (Body copy)।
> - **ড্যাশবোর্ড ও রুটস:**
>   - কাস্টমার পোর্টাল: `(user-dashboard)/account/...` (Post Job, Job Details, Quotes, Bookings)
>   - আর্টিসান পোর্টাল: `(agent-dashboard)/pro/...` (Job Feeds, Quotes, Portfolio, Analytics, Transactions)
>   - পাবলিক সাইট: `(website)/...` (Browse Jobs, Browse Pros, How it Works, Services)
> 
> ---
> 
> আপনি বর্তমানে ঠিক কোন অংশটি নিয়ে কাজ করতে চান বা কোন ফিচারে নতুন কিছু আপডেট/ফিক্স করতে হবে বলুন, আমি শুরু করে দিচ্ছি!

---

### 💬 Turn 2
**User:**
> ami amr job create booking theke complete kora porjnto ami notun kore onk kicu update korechi backend a.
> 
> ami chaitechi amr ei project ekdm large scale job marketplace er moto kore banate, sb functionality jate ekdm large scale product er moto hoy jate premium experience pay sb user
> 
> ami tmk notun guideline ta abr dicchi, valo kore dekho, r kothay kothay update kora lagbe dekho, jate ei project ekta large scale er product hoy
> 
> @[c:\Users\yead1\Desktop\yead-projects\nutsumo\nutsumo-backend\job_to_booking_workflow_guide.txt]

**Assistant:**
> আমি আপনার দেওয়া নতুন ব্যাকএন্ড গাইডলাইন (`job_to_booking_workflow_guide.txt`) এবং আপনার ফ্রন্টএন্ডের বর্তমান কোডবেস পুঙ্খানুপুঙ্খভাবে পর্যালোচনা করেছি। 
> 
> আপনার ব্যাকএন্ডে **৮-ধাপের কমপ্লিট এসক্রো লাইফসাইকেল**, **রিভিশন**, **ডিসপিউট**, **১০% প্ল্যাটফর্ম ফি**, এবং **ডেডিকেটেড রিভিউ ও আর্টিসান রিপ্লাই সিস্টেম** অত্যন্ত চমৎকার ও স্কেলেবলভাবে তৈরি করা হয়েছে। 
> 
> তবে ফ্রন্টএন্ডকে **Upwork, Fiverr বা TaskRabbit**-এর মতো একটি প্রিমিয়াম, নির্ভরযোগ্য এবং লার্জ-স্কেল মার্কেটপ্লেসে রূপান্তর করতে হলে ফ্রন্টএন্ডের বেশ কয়েকটি কোর জায়গায় গুরুত্বপূর্ণ আপডেট প্রয়োজন। নিচে বিস্তারিত গ্যাপ অ্যানালাইসিস এবং প্রিমিয়াম আর্কিটেকচার রোডম্যাপ তুলে ধরছি:
> 
> ---
> 
> ## 🔍 ফ্রন্টএন্ড গ্যাপ অ্যানালাইসিস (Current vs New Backend)
> 
> ### ১. API Actions & Data Types লেয়ার
> * **মিসিং স্ট্যাটাস ও ফিল্ডস (`bookingActions.ts`):** `BookingStatus`-এ নতুন স্ট্যাটাস `'REVISION_REQUESTED'` এবং `'DISPUTED'` নেই। এছাড়া `revisionNotes`, `revisionCount`, `disputeReason`, `disputedBy`, `disputedAt`, `review` ফিল্ডগুলো `IBookingItem` ইন্টারফেসে মিসিং।
> * **মিসিং অ্যাকশন ফাংশন:**
>   - `requestBookingRevisionAction`: কাস্টমার যখন ডেলিভার করা কাজে পরিবর্তন বা রিভিশন চাইবে (`PATCH /booking/:id/request-revision`)।
>   - `disputeBookingAction`: কোনো সমস্যা হলে কাস্টমার বা আর্টিসান অ্যাডমিনের সহায়তা নিতে ডিসপিউট তুলবে (`PATCH /booking/:id/dispute`)।
> * **ডেলিভারি প্রুফ আপলোড সীমাবদ্ধতা:** বর্তমানে `deliverBookingWorkAction`-এ শুধু ইমেজ URL পাঠানো হচ্ছে। অথচ ব্যাকএন্ডে সরাসরি ফাইল আপলোড (`multipart/form-data`) সাপোর্ট করে। লার্জ স্কেল অ্যাপে আর্টিসান সরাসরি মোবাইল বা ক্যামেরা থেকে প্রুফ ছবি আপলোড করবে।
> * **রিভিউ অ্যাকশন লেয়ার অনুপস্থিত (`reviewActions.ts`):** ব্যাকএন্ডের ডেডিকেটেড রিভিউ মডিউলের জন্য ফ্রন্টএন্ডে এখনো কোনো সার্ভার অ্যাকশন ফাইল তৈরি করা হয়নি (`createReview`, `getArtisanReviews`, `getMyReviews`, `replyToReview`, `getBookingReview`)।
> 
> ---
> 
> ### ২. কাস্টমার ড্যাশবোর্ড ও বুকিং এক্সপেরিয়েন্স (`(user-dashboard)`)
> * **রিভিশন ও ডিসপিউট হ্যান্ডলিং নেই (`CustomerEscrowActionCard.tsx`):** আর্টিসান কাজ ডেলিভার (`DELIVERED`) করলে কাস্টমারের সামনে শুধু *Confirm Completion* অপশন আছে। যদি কাজ সন্তোষজনক না হয়, তবে:
>   - কাস্টমারের **"Request Revision"** করার মডাল ও ফ্লো থাকতে হবে।
>   - গুরুতর সমস্যার জন্য **"Open Dispute / Contact Mediation"** অপশন থাকতে হবে।
> * **মাল্টি-ক্রাইটেরিয়া প্রিমিয়াম রিভিউ (`ConfirmCompletionModal.tsx`):**
>   - সাধারণ ১-৫ স্টারের বদলে Upwork-এর মতো ডিটেইলড রেটিং: **Overall Rating**, **Quality of Work**, **Communication**, এবং **Timeliness** রেটিং নেওয়ার সুবিধা।
> * **লাইভ এসক্রো টাইমলাইন:** `AWAITING_PAYMENT` ➔ `ESCROW_HELD (Protected)` ➔ `IN_PROGRESS` ➔ `DELIVERED` ➔ `COMPLETED / RELEASED`-এর একটি ক্লিয়ার ভিজ্যুয়াল প্রগ্রেস বার।
> 
> ---
> 
> ### ৩. আর্টিসান ড্যাশবোর্ড ও ডেলিভারি এক্সপেরিয়েন্স (`(agent-dashboard)`)
> * **প্রোপোজাল ফর্মে স্বচ্ছ ফাইন্যান্সিয়াল ব্রেকডাউন (`ArtisanJobDetailView.tsx`):**
>   - ব্যাকএন্ড অনুযায়ী প্ল্যাটফর্ম ১০% কমিশন নেয়। ফর্মে আর্টিসান যখন রেট লিখবে (যেমন: GH₵ 150), নিচে রিয়েলটাইমে ব্রেকডাউন দেখাবে: 
>     * *Proposed Amount:* GH₵ 150
>     * *Platform Commission (10%):* -GH₵ 15
>     * *Net Payout to You:* GH₵ 135
>   - *নোট:* কোডে থাকা কনফ্লিক্টিং *"0% Commission Guarantee"* টেক্সটটি আপডেট করে রিয়েল ট্রান্সপারেন্ট এসক্রো পলিসি বসাতে হবে।
> * **ডেলিভারি ওয়ার্ক মডাল আপগ্রেড (`DeliverWorkModal.tsx`):**
>   - URL পেস্ট করার বদলে ড্র্যাগ-অ্যান্ড-ড্রপ / ব্রাউজ ফাইলস দিয়ে সরাসরি একাধিক কমপ্লিশন প্রুফ ছবি আপলোড।
> * **রিভিশন স্টেট হ্যান্ডলিং:** কাস্টমার যদি রিভিশন চায় (`REVISION_REQUESTED`), আর্টিসান ড্যাশবোর্ডে কাস্টমারের দেওয়া রিভিশন নোটস হাইলাইট হবে এবং "Re-deliver Work" বাটন শো করবে।
> * **মক ডেটা থেকে রিয়েল এপিআই মাইগ্রেশন (`pro/reviews/page.tsx`):**
>   - আর্টিসান রিভিউ পেজে বর্তমানে `@/Mockdata` ব্যবহার হচ্ছে। এটি ব্যাকএন্ডের `GET /api/v1/review/my-reviews`-এর সাথে কানেক্ট করতে হবে এবং আর্টিসানের **"Reply to Client"** ফিচারটি এপিআই দিয়ে সক্রিয় করতে হবে।
> 
> ---
> 
> ### ৪. পাবলিক প্রোফাইল ও ট্রাস্ট এলিমেন্টস (`browse-pros/[id]`)
> * **পাবলিক আর্টিসান পেজে রিয়েল ডেটা ও রেটিং ব্রেকডাউন:**
>   - বর্তমানে এই পেজটিও মক ডেটা নিচ্ছে। এখানে ব্যাকএন্ডের `GET /api/v1/review/artisan/:id` ইন্টিগ্রেট করে ৫-স্টার থেকে ১-স্টারের ডিস্ট্রিবিউশন বার, ভেরিফায়েড ট্যাগ, এবং পূর্ববর্তী কাস্টমার রিভিউ ও রিপ্লাই দেখাতে হবে।
> 
> ---
> 
> ### ৫. ডিজাইন সিস্টেম ও ব্র্যান্ড কনসিস্টেন্সি
> * `DESIGN.md`-এর নিয়ম অনুযায়ী কিছু ফাইলে হার্ডকোডেড পিংক কালার (`#FE375D`) রয়ে গেছে। এগুলোকে আমাদের মূল ডিজাইন টোকেন (`#0D56D6` প্রাইমারি, `#00A1DE` সেকেন্ডারি/হোভার, Rubik + Archivo ফন্ট) দিয়ে ক্লিন করা দরকার।
> 
> ---
> 
> ## 🚀 লার্জ-স্কেল রূপান্তরের ফেজভিত্তিক প্ল্যান (Implementation Roadmap)
> 
> | Phase | ফোকাস | মূল কাজসমূহ |
> |---|---|---|
> | **Phase 1** | **Core API & Types Sync** | ১. `bookingActions.ts`-এ সব নতুন স্ট্যাটাস ও রিভিশন/ডিসপিউট অ্যাকশন যোগ করা。<br>২. ডেডিকেটেড `reviewActions.ts` তৈরি করা (Submit, Get, Reply, Update)। |
> | **Phase 2** | **Customer Escrow & Actions** | ১. `CustomerEscrowActionCard.tsx`-এ রিভিশন ও ডিসপিউট স্টেট ও মডাল যুক্ত করা。<br>২. মাল্টি-লেভেল রিভিউ সিস্টেম (Quality, Communication, Timeliness)।<br>৩. এসক্রো স্ট্যাটাস ট্র্যাকার আরও প্রিমিয়াম করা। |
> | **Phase 3** | **Artisan Delivery & Economics** | ১. `DeliverWorkModal.tsx`-এ সরাসরি ফাইল/ছবি আপলোড সাপোর্ট。<br>২. প্রপোজাল সাবমিশনে ১০% কমিশন ক্যালকুলেটর লাইভ প্রিভিউ。<br>৩. রিভিশন স্টেট ও ডিসপিউট নোটিফিকেশন হ্যান্ডলিং।<br>৪. কালার টোকেন ফিক্স। |
> | **Phase 4** | **Reviews & Public Profiles** | ১. `pro/reviews/page.tsx`-কে রিয়েল এপিআই দিয়ে কানেক্ট করা ও রিপ্লাই সক্রিয় করা。<br>২. `browse-pros/[id]` পাবলিক পেজে রিয়েল রেটিং ডিস্ট্রিবিউশন যুক্ত করা। |

---

### 💬 Turn 3
**User:**
> hae shuru koro phase 1 theke

**Assistant:**
> আপনার সম্পূর্ণ গাইডলাইন এবং আর্কিটেকচার অনুযায়ী **Phase 1 থেকে Phase 4 পর্যন্ত সবগুলো কোর ফিচার ও আপডেট সম্পূর্ণ সফলভাবে বাস্তবায়ন করা হয়েছে**। 
> 
> নিচে বিস্তারিত পরিবর্তনের বিবরণ তুলে ধরা হলো:
> 
> ---
> 
> ### ✅ Phase 1: Core API Actions & Types Sync
> 1. **`bookingActions.ts` আপগ্রেড:**
>    - `BookingStatus`-এ নতুন স্ট্যাটাস যুক্ত করা হয়েছে: `'REVISION_REQUESTED'` এবং `'DISPUTED'`।
>    - `IBookingItem`-এ নতুন ফিল্ডস যুক্ত করা হয়েছে: `revisionNotes`, `revisionCount`, `disputeReason`, `disputedBy`, `disputedAt`, `review`।
>    - নতুন সার্ভার অ্যাকশন যুক্ত করা হয়েছে:
>      - `requestBookingRevisionAction(bookingId, { revisionNotes })`
>      - `disputeBookingAction(bookingId, { reason })`
>    - `deliverBookingWorkAction`-কে আপগ্রেড করা হয়েছে যাতে এটি একই সাথে ফাইল আপলোডের জন্য **`FormData` (multipart)** এবং ফলব্যাক JSON উভয়ই রিসিভ করতে পারে।
> 2. **নতুন `reviewActions.ts` ফাইল তৈরি:**
>    - `createReviewAction`: কাস্টমারের মাল্টি-ক্রাইটেরিয়া রিভিউ সাবমিশন (`POST /api/v1/review`)।
>    - `getMyReviewsAction`: আর্টিসান বা কাস্টমারের রিভিউ ফেচ (`GET /api/v1/review/my-reviews`)।
>    - `getArtisanReviewsAction`: পাবলিক প্রোফাইল ও স্টার সামারি ডিস্ট্রিবিউশন (`GET /api/v1/review/artisan/:artisanId`)।
>    - `replyToReviewAction`: রিভিউতে আর্টিসানের রিপ্লাই সাবমিশন (`PATCH /api/v1/review/:id/reply`)।
>    - `updateReviewAction`: রিভিউ আপডেট (`PATCH /api/v1/review/:id`)।
> 
> ---
> 
> ### ✅ Phase 2: Customer Escrow & Action Modals
> 1. **নতুন `RequestRevisionModal.tsx`:**
>    - ডেলিভার করা কাজে কাস্টমার সন্তুষ্ট না হলে স্পেসিফিক চেঞ্জেস বা অ্যাডজাস্টমেন্টের জন্য রিকোয়ারমেন্ট লিখে আর্টিসানকে রিভিশন পাঠাতে পারবে।
> 2. **নতুন `DisputeBookingModal.tsx`:**
>    - কোনো অনাকাঙ্ক্ষিত পরিস্থিতি তৈরি হলে কাস্টমার প্ল্যাটফর্ম মেডিয়েশনের জন্য আনুষ্ঠানিক ডিসপিউট ওপেন করতে পারবে (যা ফান্ডস সুরক্ষিত রেখে অ্যাডমিন ডেস্ককে নোটিফাই করে)।
> 3. **আপগ্রেডেড `ConfirmCompletionModal.tsx`:**
>    - Upwork/Fiverr-এর মতো **মাল্টি-ক্রাইটেরিয়া রেটিং**: Overall Rating (1–5 Star)-এর পাশাপাশি *Quality of Work*, *Communication*, এবং *Timeliness/Punctuality* রেটিং ও রিভিউ দেওয়ার সুবিধা।
> 4. **আপগ্রেডেড `CustomerEscrowActionCard.tsx`:**
>    - **`DELIVERED` স্টেট:** ৩টি সুস্পষ্ট অপশন—*Inspect & Release Escrow*, *Request Changes*, এবং *Raise Dispute*।
>    - **`REVISION_REQUESTED` স্টেট:** রিভিশন রিকোয়েস্টের বিশদ বিবরণ এবং স্টেটাস অ্যালার্ট।
>    - **`DISPUTED` স্টেট:** ফান্ডস ফ্রিজ নোটিশ ও অ্যাডমিন মেডিয়েশন স্ট্যাটাস।
> 5. **আপগ্রেডেড `BookingEscrowTracker.tsx`:**
>    - ৫-ধাপের এসক্রো পাইপলাইন (Deposit Funded ➔ Scheduled ➔ In Progress ➔ Delivered ➔ Released) সাথে অ্যাক্টিভ রিভিশন ও ডিসপিউট ট্যাগ।
> 
> ---
> 
> ### ✅ Phase 3: Artisan Delivery, Economics & Tokens
> 1. **আপগ্রেডেড `DeliverWorkModal.tsx`:**
>    - শুধুমাত্র ইমেজ URL পেস্ট করার সীমাবদ্ধতা দূর করে সরাসরি ডিভাইস থেকে **একাধিক প্রুফ ফটো ব্রাউজ/ড্র্যাগ-অ্যান্ড-ড্রপ** করার সুবিধা (ফটো প্রিভিউ ও রিমুভ অপশনসহ `FormData` মাধ্যমে ব্যাকএন্ডে সাবমিট হয়)।
> 2. **আপগ্রেডেড `ArtisanJobDetailView.tsx`:**
>    - **রিয়েলটাইম ১০% কমিশন ক্যালকুলেটর:** আর্টিসান বিড অ্যামাউন্ট টাইপ করার সাথে সাথে লাইভ দেখতে পাবে:
>      * *Proposed Bid:* GH₵ 150.00
>      * *Platform Fee (10%):* -GH₵ 15.00
>      * *Estimated Net Payout:* GH₵ 135.00
>    - **রিভিশন ও ডিসপিউট রেসপন্স স্টেট:** কাস্টমার রিভিশন চাইলে সরাসরি অ্যালার্ট এবং "Submit Updated / Revised Delivery" বাটন।
>    - **ডিজাইন টোকেন কনসিস্টেন্সি:** ফাইলে থাকা সমস্ত আনঅফিসিয়াল কালার (`#FE375D`) পরিবর্তন করে `DESIGN.md` অনুযায়ী অফিসিয়াল ব্র্যান্ড টোকেন (`primary`, `primary-hover`, ইত্যাদি) প্রয়োগ করা হয়েছে।
> 
> ---
> 
> ### ✅ Phase 4: Reviews Module & Public Profiles
> 1. **`pro/reviews/page.tsx`:**
>    - মক ডেটার ওপর নির্ভরতা দূর করে সরাসরি ব্যাকএন্ডের `getMyReviewsAction`-এর সাথে ইন্টিগ্রেট করা হয়েছে।
>    - আর্টিসানদের জন্য **"Reply to Client"** বাটনটি সরাসরি `replyToReviewAction`-এর সাথে যুক্ত করে লাইভ করা হয়েছে।
> 2. **`pro-profile-content.tsx` (Public Profile):**
>    - পাবলিক আর্টিসান প্রোফাইলে ব্যাকএন্ডের `getArtisanReviewsAction(pro.id)` ইন্টিগ্রেট করা হয়েছে, যাতে প্ল্যাটফর্মের রিয়েল কাস্টমার রেটিং, রিভিউ ও আর্টিসানের রিপ্লাই প্রদর্শিত হয়।
> 
> ---
> 
> ### 🧪 ভ্যালিডেশন
> * কোডবেসের টাইপ চেকিং রান করা হয়েছে (`npx tsc --noEmit`) এবং **০ কোনো এরর ছাড়া সম্পূর্ণ সফলভাবে কম্পাইল হয়েছে**।

---

### 💬 Turn 4
**User:**
> tmi ki ei chat history ta export korte parba? chat history.md diye

---

## 🛠️ Summary of Files Created & Modified

### 🆕 Files Created:
1. `src/helpers/next-fetch/apiActions/reviewActions.ts`
   - Server actions for review submission, ratings distribution, and artisan replies.
2. `src/components/web-pages/customer-dashboard/booking-details/components/RequestRevisionModal.tsx`
   - Modal dialog for clients to request revisions on delivered work.
3. `src/components/web-pages/customer-dashboard/booking-details/components/DisputeBookingModal.tsx`
   - Formal resolution modal for disputes mediated by admin.
4. `chat history.md`
   - Complete record of the implementation and architecture discussion.

### ✏️ Files Modified:
1. `src/helpers/next-fetch/apiActions/bookingActions.ts`
   - Enums updated (`REVISION_REQUESTED`, `DISPUTED`).
   - Server actions added for revision and dispute.
   - Multipart file upload enabled for work delivery.
2. `src/components/web-pages/customer-dashboard/booking-details/components/CustomerEscrowActionCard.tsx`
   - Handled all 8 states cleanly; added revision, dispute, and completion triggers.
3. `src/components/web-pages/customer-dashboard/booking-details/components/ConfirmCompletionModal.tsx`
   - Added multi-criteria rating breakdown (Quality, Communication, Timeliness, Overall score, Feedback).
4. `src/components/web-pages/customer-dashboard/booking-details/components/BookingEscrowTracker.tsx`
   - Added live revision and dispute state indicators and brand design tokens.
5. `src/components/web-pages/artisan-dashboard/artisan-jobs/components/DeliverWorkModal.tsx`
   - Multi-photo drag & drop file picker sending `FormData` attachments.
6. `src/components/web-pages/artisan-dashboard/artisan-jobs/components/ArtisanJobDetailView.tsx`
   - Live 10% platform commission calculator.
   - Revision requested and dispute handling banners.
   - Replaced all `#FE375D` instances with design tokens (`primary`, `primary-hover`).
7. `src/app/(agent-dashboard)/pro/reviews/page.tsx`
   - Integrated live backend reviews and artisan reply action.
8. `src/components/web-pages/pro-profile-content.tsx`
   - Connected public artisan profiles to live backend reviews.
9. `src/components/web-pages/customer-dashboard/post-job/components/PhotoUploader.tsx`
   - Cleaned up color tokens to official design standards.

---
*Generated by Antigravity AI Assistant.*

