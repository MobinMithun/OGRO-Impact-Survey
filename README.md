# OGRO Impact Survey

A bilingual (Bangla/English) survey application for collecting and analyzing user feedback on the OGRO platform. The application features a comprehensive survey form and an interactive impact dashboard with real-time data visualization.

## 🌟 Features

- **Bilingual Support**: Full Bangla and English language support with instant switching
- **Comprehensive Survey Form**: Multi-section survey covering:
  - User context (role, usage duration, modules used)
  - Satisfaction metrics (Likert scale 1-5)
  - Module-specific impact ratings
  - Before/after comparisons (time spent, error frequency)
  - Trust and preference indicators
  - Open-ended feedback fields
- **Interactive Impact Dashboard**: Real-time analytics with:
  - Overall Satisfaction Score (OSS)
  - Module impact analysis
  - Perception vs Reality alignment
  - Time saved and error reduction metrics
  - Visual charts and graphs (Pie, Bar, Scatter plots)
- **Cloud Database Integration**: Supabase for data persistence with localStorage fallback
- **Beautiful UI/UX**: Modern dark theme with snowfall effect
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (optional - app works with localStorage fallback)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MobinMithun/OGRO-Impact-Survey.git
   cd OGRO-Impact-Survey
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional but recommended)
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   
   > **Note**: If Supabase credentials are not provided, the app will use localStorage as a fallback.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📦 Supabase Setup

For cloud database functionality, follow these steps:

1. **Create a Supabase project** at [https://app.supabase.com](https://app.supabase.com)

2. **Get your API credentials**
   - Go to **Settings** → **API**
   - Copy your **Project URL** and **anon public** key

3. **Create the database table**
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Click **Run** to execute

4. **Set up Row Level Security (RLS)**
   - The schema includes RLS policies for anonymous access
   - Ensure policies are enabled: "Allow anonymous reads" and "Allow anonymous inserts"

5. **Add credentials to `.env`**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

For detailed setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## 🏗️ Project Structure

```
OGRO-Impact-Survey/
├── src/
│   ├── components/          # Reusable components
│   │   └── SnowfallLayer.tsx
│   ├── context/            # React context providers
│   │   └── SurveyContext.tsx
│   ├── data/               # Translation files
│   │   ├── impactCopy.ts   # Dashboard translations
│   │   └── surveyCopy.ts   # Survey form translations
│   ├── lib/                # External service integrations
│   │   └── supabase.ts     # Supabase client configuration
│   ├── pages/              # Main application pages
│   │   ├── SurveyForm.tsx  # Survey form page
│   │   └── ImpactDashboard.tsx  # Analytics dashboard
│   ├── types/              # TypeScript type definitions
│   │   └── survey.ts
│   ├── utils/              # Utility functions
│   │   └── metrics.ts      # Calculation functions
│   ├── App.tsx             # Main app component
│   ├── App.css             # Global styles
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── supabase-schema.sql     # Database schema
└── README.md               # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 📊 Dashboard Metrics

The Impact Dashboard calculates and displays:

1. **Overall Satisfaction Score (OSS)**: Average of satisfaction metrics (0-100%)
2. **Module Impact Scores**: Per-module impact ratings from survey responses
3. **Reality Scores**: Calculated from mock analytics data (time saved, error reduction)
4. **Impact Alignment**: Gap between user perception and measured reality
5. **Time Saved**: Percentage reduction in time spent on tasks
6. **Error Reduction**: Percentage decrease in error frequency

## 🎨 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Supabase** - Backend database (PostgreSQL)
- **Recharts** - Data visualization
- **React Snowfall** - Visual effects

## 🌐 Deployment

### Netlify

**⚠️ Important:** For Supabase to work on Netlify, you MUST set environment variables in the Netlify dashboard.

**Quick Steps:**
1. Deploy to Netlify (via Git or Netlify CLI)
2. Go to **Site settings** → **Environment variables**
3. Add:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
4. **Redeploy** the site (environment variables require a new build)

**Detailed instructions:** See [NETLIFY_SETUP.md](./NETLIFY_SETUP.md) for complete setup guide.

### Other Platforms

The app can be deployed to any static hosting service:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any other static hosting provider

**Important**: Make sure to set environment variables in your hosting platform's configuration.

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | No (uses localStorage if missing) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | No (uses localStorage if missing) |

## 📝 Data Flow

1. **Survey Submission**: User fills out the form → Data saved to localStorage → Attempts to save to Supabase
2. **Data Loading**: On app load → Checks Supabase first → Falls back to localStorage if Supabase is empty/unavailable
3. **Dashboard Display**: Loads responses → Calculates metrics → Displays charts and KPIs

## 🐛 Troubleshooting

### Data not appearing in Supabase (Local Development)

1. Check browser console for error messages
2. Verify `.env` file has correct credentials
3. Ensure RLS policies are set up correctly
4. Check Supabase logs in the dashboard

### Data not appearing in Supabase (Netlify)

1. **Check environment variables are set** in Netlify dashboard
2. **Verify variable names start with `VITE_`** (required for Vite)
3. **Redeploy after adding variables** (they're only included at build time)
4. Check browser console for Supabase configuration logs
5. Look for `🔍 Supabase Configuration Check` in console
6. See [NETLIFY_SETUP.md](./NETLIFY_SETUP.md) for detailed troubleshooting

### Dashboard shows no data

1. Verify data exists in Supabase (check database table)
2. Click the refresh button on the dashboard
3. Check browser console for loading errors
4. Ensure Supabase credentials are correct
5. Check the data source indicator on the dashboard (should show "Data from Supabase" when working)

### Build errors

1. Run `npm install` to ensure all dependencies are installed
2. Check TypeScript errors: `npm run build`
3. Verify all environment variables are set (if using Supabase)

For more troubleshooting tips, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For contributions or issues, please contact the project maintainers.

## 📧 Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for OGRO Platform Impact Analysis**
