# SocialFront

Frontend for managing enquiries, admissions, and follow-ups.

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

### Offline Caching

The client caches recent master data (courses, educations, exams, batches and payment modes)
inside **IndexedDB** using [Dexie](https://dexie.org). Sensitive fields are encrypted via
`crypto-js` before being stored. All cached data is purged on user logout.

## API Endpoints

The app now consumes the following updated API routes:

- `GET /api/record/enquiry?institute_uuid=ID&page=0&limit=20`
- `GET /api/record/admission?institute_uuid=ID`
- `GET /api/record/followup?institute_uuid=ID`

These endpoints return objects of the form:

```json
{ "data": [], "total": 0, "page": 0, "limit": 20 }
```

Other record actions like `POST /api/record` and `PUT /api/record/:id` remain unchanged.
