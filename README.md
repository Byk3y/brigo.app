# brigo.app - Landing Page & Blog

This is the official landing page and editorial blog for **brigo**, a platform dedicated to digital wellness and breaking free from endless scrolling.

## 🚀 Deployment on Vercel

To deploy this project on Vercel using the **"Import from GitHub"** feature, follow these steps:

### 1. Environment Variables

You **must** configure the following environment variables in your Vercel project settings:

| Name | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key. |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | The password used to access the `/admin` dashboard. |

### 2. Vercel Configuration

Most settings are automatically detected. However, ensure:
- **Framework Preset**: Next.js
- **Root Directory**: `./` (if your project is in the root of the repo)
- **Install Command**: `npm install`
- **Build Command**: `next build`

### 3. Supabase Setup

Ensure your Supabase project remains accessible. If you use Supabase Storage for images, make sure the `blog-images` bucket is **Public**.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://gsap.com/) (GreenSock)
- **Database/Storage**: [Supabase](https://supabase.com/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

- `app/`: Next.js pages and layouts (Landing, Blog, Admin, etc.)
- `components/`: Reusable UI components.
- `lib/`: Utility functions and Supabase client.
- `public/`: Static assets (images, icons).

## 🧑‍💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file with the variables listed above.
3. Start the dev server:
   ```bash
   npm run dev
   ```

---

Built with ❤️ by the brigo team.
