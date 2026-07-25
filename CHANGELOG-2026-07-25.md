# Changes — 25 July 2026

## Summary

Driver **Complete Delivery** proof upload-এ multiple image support যোগ করা হয়েছে এবং Postman-এর সাথে match করে backend upload ঠিক করা হয়েছে।

---

## 1. Multiple image upload (Driver)

**Files**
- `src/pages/dashboards/driver/assignDeliveris/CompleteProofModal.jsx`
- `src/pages/dashboards/driver/assignDeliveris/AssignedDeliveries.jsx`
- `src/pages/dashboards/driver/assignDeliveris/FinalCompleteModal.jsx`

**Changes**
- Single `photo` → `photos[]` (multiple File + preview)
- UI: Select Multiple Photos, drag & drop, preview grid, remove per image
- Max **10** images, max **5MB** each
- Chrome/Edge `showOpenFilePicker` + fallback file input (`multiple`)
- Sticky header + sticky footer; middle content scrollable

---

## 2. FormData / Multer field fix (critical)

**Problem**
- Frontend `photoUrls` field দিয়ে পাঠাচ্ছিল
- Backend Multer error: `Unexpected field`
- Postman-এ কাজ করত, frontend-এ 500 দিত

**Fix**
- Upload **request** field name: `photo` (same key repeated = array)
- Upload **response** field name: `photoUrls` (URL string array)

```js
// Request
photoFiles.forEach((file) => formData.append('photo', file));

// Response (backend)
photoUrls: ["https://.../photo1.png", "https://.../photo2.png"]
```

---

## 3. Axios multipart / timeout

**Files**
- `src/services/axiosInstance.js`
- `src/services/driverService.js`

**Changes**
- FormData পাঠানোর সময় `Content-Type` manually set করা বন্ধ (browser boundary auto-set করে)
- Proof upload timeout: **10s → 120s** (multiple images-এর জন্য)

---

## 4. Final complete modal

**File**
- `src/pages/dashboards/driver/assignDeliveris/FinalCompleteModal.jsx`

**Changes**
- Single `photoUrl` → `photoUrls[]` list (preview + URL)
- Fallback: পুরনো single `photoUrl` থাকলে সেটাও show করে

---

## 5. Debug / tracking logs

Upload সময় console-এ দেখা যায়:
- Sending payload (`photo` File array)
- Backend full response
- `photoUrls` / `signatureUrl` from response
- Error response body (যদি fail হয়)

---

## How to test

1. Driver login → Assigned Deliveries → Complete
2. Multiple images select / drag & drop
3. Signature দিন → Upload Proof
4. Success হলে next modal-এ `photoUrls` array দেখা যাবে
5. Browser Console-এ response log চেক করুন

---

## Request vs Response cheat sheet

| Direction | Field | Type |
|-----------|--------|------|
| Request (FormData) | `photo` | File[] (same key multiple times) |
| Request (FormData) | `signature` | File |
| Response | `photoUrls` | `string[]` (uploaded URLs) |
| Response | `signatureUrl` | `string` |

---

## Notes

- Contractor `CompleteDeliveryModal.jsx`-এও earlier multiple-upload UI কাজ হয়েছিল (dummy flow); live API এই driver proof upload path-এ connect করা হয়েছে।
- Backend Multer field name যদি পরে `photos` / `photoUrls` এ change হয়, frontend `formData.append(...)` key match করে update করতে হবে।
