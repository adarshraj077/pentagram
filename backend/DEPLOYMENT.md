# mern-project

The frontend and backend are deployed as separate projects. Set the frontend
project's Vercel Root Directory to `frontend/`, and the backend project's Root
Directory to `backend/`.

## Vercel environment variables

Backend:

- `URL`: MongoDB connection string
- `SECRET`: JWT signing secret
- `SALT`: bcrypt salt rounds
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `CLIENT_URL`: deployed frontend URL

Frontend:

- `VITE_API_URL`: deployed backend URL followed by `/api`

Vercel Functions handle the backend HTTP API. The Socket.IO server still needs
a persistent Node host; realtime messaging will not work when that server is
deployed as a Vercel Function.

To install backend dependencies:

```bash
bun install
```

To run the backend:

```bash
bun run index.js
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
