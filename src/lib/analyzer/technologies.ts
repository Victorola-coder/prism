export interface DetectionRule {
  name: string
  category: string
  icon?: string
  detection: {
    html?: RegExp
    headers?: Record<string, RegExp>
    url?: RegExp
    meta?: Record<string, RegExp>
    script?: RegExp
    css?: RegExp
    window?: RegExp
  }
  version?: RegExp
}

export const DETECTION_RULES: DetectionRule[] = [
  // --- Frameworks ---
  {
    name: "Next.js",
    category: "Framework",
    icon: "nextjs",
    detection: {
      meta: { generator: /Next\.js/i },
      script: /\/_next\/static\//i,
      headers: { "x-powered-by": /Next\.js/i },
    },
    version: /Next\.js\s*v?(\d+\.\d+\.\d+)/i,
  },
  {
    name: "React",
    category: "Library",
    icon: "react",
    detection: {
      script: /\/react(?:\.min)?\.js/i,
      window: /\.createElement\s*=|reactprod|reactdevelopment/i,
      html: /data-reactroot|data-reactid/i,
    },
    version: /React\s*v?(\d+\.\d+\.\d+)/i,
  },
  {
    name: "Vue.js",
    category: "Framework",
    icon: "vue",
    detection: {
      script: /\/vue(?:\.min)?\.js/i,
      html: /data-v-/,
      window: /\.__vue__/i,
    },
    version: /Vue\.js\s*v?(\d+\.\d+\.\d+)/i,
  },
  {
    name: "Angular",
    category: "Framework",
    icon: "angular",
    detection: {
      script: /\/angular(?:\.min)?\.js/i,
      html: /ng-version|ng-app|ng-controller/i,
      window: /ngVersion/i,
    },
    version: /Angular\s*v?(\d+\.\d+\.\d+)/i,
  },
  {
    name: "Svelte",
    category: "Framework",
    icon: "svelte",
    detection: {
      html: /data-svelte/i,
      script: /\/svelte(?:\.min)?\.js/i,
      window: /__svelte/i,
    },
  },
  {
    name: "Nuxt.js",
    category: "Framework",
    icon: "nuxt",
    detection: {
      meta: { generator: /Nuxt/i },
      script: /\/_nuxt\//i,
    },
    version: /Nuxt\s*v?(\d+\.\d+\.\d+)/i,
  },
  {
    name: "Gatsby",
    category: "Framework",
    icon: "gatsby",
    detection: {
      script: /\/gatsby/i,
      meta: { generator: /Gatsby/i },
    },
    version: /Gatsby\s*v?(\d+\.\d+\.\d+)/i,
  },
  {
    name: "Remix",
    category: "Framework",
    icon: "remix",
    detection: {
      script: /\/remix(?:\.min)?\.js/i,
      headers: { "x-remix": /./i },
    },
  },
  {
    name: "Astro",
    category: "Framework",
    icon: "astro",
    detection: {
      meta: { generator: /Astro/i },
    },
    version: /Astro\s*v?(\d+\.\d+\.\d+)/i,
  },

  // --- CSS ---
  {
    name: "Tailwind CSS",
    category: "CSS Framework",
    icon: "tailwind",
    detection: {
      html: /class="[^"]*[a-z]:[a-z]+/,
      css: /\.tw-|tailwind/,
      meta: { generator: /tailwind/i },
    },
    version: /Tailwind\s*(?:CSS\s*)?v?(\d+\.\d+\.\d+)/i,
  },
  {
    name: "Bootstrap",
    category: "CSS Framework",
    icon: "bootstrap",
    detection: {
      script: /\/bootstrap(?:\.min)?\.(?:js|css)/i,
      html: /class="[^"]*(?:container|col-|row|navbar|btn|card|modal)[^"]*"/,
    },
    version: /Bootstrap\s*v?(\d+\.\d+\.\d+)/i,
  },
  {
    name: "Material UI",
    category: "CSS Framework",
    icon: "mui",
    detection: {
      css: /\.Mui[a-z]/i,
      script: /\/@mui\//i,
    },
  },
  {
    name: "Chakra UI",
    category: "CSS Framework",
    icon: "chakra",
    detection: {
      html: /class="[^"]*css-[a-z0-9]+/i,
      script: /\/@chakra-ui\//i,
    },
  },
  {
    name: "Styled Components",
    category: "CSS Framework",
    icon: "styled",
    detection: {
      html: /class="[^"]*sc-[a-z]+/i,
      script: /styled-components/i,
    },
  },
  {
    name: "CSS Modules",
    category: "CSS",
    icon: "css",
    detection: {
      html: /class="[a-zA-Z]+_[a-zA-Z0-9]+__[a-zA-Z0-9]+/,
    },
  },

  // --- Build Tools ---
  {
    name: "Vite",
    category: "Build Tool",
    icon: "vite",
    detection: {
      script: /\/@vite\//i,
      headers: { "x-vite": /./i },
    },
  },
  {
    name: "Webpack",
    category: "Build Tool",
    icon: "webpack",
    detection: {
      script: /\/__webpack_/i,
      html: /src="[^"]*\/bundle\.\w+\.js/i,
    },
    version: /webpack\s*v?(\d+\.\d+\.\d+)/i,
  },
  {
    name: "ESBuild",
    category: "Build Tool",
    icon: "esbuild",
    detection: {
      script: /esbuild/i,
    },
  },
  {
    name: "Turbopack",
    category: "Build Tool",
    icon: "turbopack",
    detection: {
      headers: { "x-turbopack": /./i },
      script: /turbopack/i,
    },
  },

  // --- Languages ---
  {
    name: "TypeScript",
    category: "Language",
    icon: "typescript",
    detection: {
      script: /\.tsx?["'\s]/i,
    },
  },

  // --- Analytics ---
  {
    name: "Google Analytics",
    category: "Analytics",
    icon: "ga",
    detection: {
      script: /googletagmanager\.com\/gtag\/js|google-analytics\.com\/analytics\.js|gtag\(/i,
      window: /google_tag_manager|gaPlugin/i,
    },
  },
  {
    name: "Google Tag Manager",
    category: "Analytics",
    icon: "gtm",
    detection: {
      script: /googletagmanager\.com\/gtm\.js/i,
    },
  },
  {
    name: "Mixpanel",
    category: "Analytics",
    icon: "mixpanel",
    detection: {
      script: /cdn\.mxpnl\.com/i,
      window: /mixpanel/i,
    },
  },
  {
    name: "Hotjar",
    category: "Analytics",
    icon: "hotjar",
    detection: {
      script: /static\.hotjar\.com/i,
    },
  },
  {
    name: "Segment",
    category: "Analytics",
    icon: "segment",
    detection: {
      script: /cdn\.segment\.com/i,
      window: /analytics\.load/i,
    },
  },
  {
    name: "Amplitude",
    category: "Analytics",
    icon: "amplitude",
    detection: {
      script: /cdn\.amplitude\.com/i,
      window: /amplitude\.getInstance/i,
    },
  },
  {
    name: "Plausible",
    category: "Analytics",
    icon: "plausible",
    detection: {
      script: /plausible\.io\/js\/script\.js/i,
    },
  },
  {
    name: "Fathom",
    category: "Analytics",
    icon: "fathom",
    detection: {
      script: /cdn\.usefathom\.com/i,
    },
  },

  // --- CDN ---
  {
    name: "Cloudflare",
    category: "CDN",
    icon: "cloudflare",
    detection: {
      headers: { server: /cloudflare/i, "cf-ray": /./i },
    },
  },
  {
    name: "Fastly",
    category: "CDN",
    icon: "fastly",
    detection: {
      headers: { "x-fastly-request-id": /./i, server: /fastly/i },
    },
  },
  {
    name: "Akamai",
    category: "CDN",
    icon: "akamai",
    detection: {
      headers: { server: /akamai/i },
    },
  },
  {
    name: "CloudFront",
    category: "CDN",
    icon: "cloudfront",
    detection: {
      headers: { "x-amz-cf-id": /./i, server: /cloudfront/i },
    },
  },
  {
    name: "Netlify",
    category: "CDN",
    icon: "netlify",
    detection: {
      headers: { server: /netlify/i },
    },
  },
  {
    name: "Vercel",
    category: "Hosting",
    icon: "vercel",
    detection: {
      headers: { "x-vercel-id": /./i, "x-vercel-cache": /./i },
    },
  },

  // --- Hosting ---
  {
    name: "GitHub Pages",
    category: "Hosting",
    icon: "github",
    detection: {
      headers: { server: /github\.com/i },
    },
  },
  {
    name: "Heroku",
    category: "Hosting",
    icon: "heroku",
    detection: {
      headers: { server: /heroku/i },
    },
  },
  {
    name: "AWS EC2",
    category: "Hosting",
    icon: "aws",
    detection: {
      headers: { server: /ec2/i },
    },
  },
  {
    name: "Firebase",
    category: "Hosting",
    icon: "firebase",
    detection: {
      headers: { "x-firebase": /./i },
      script: /firebase\.io/i,
    },
  },
  {
    name: "DigitalOcean",
    category: "Hosting",
    icon: "do",
    detection: {
      headers: { server: /digitalocean/i },
    },
  },
  {
    name: "Railway",
    category: "Hosting",
    icon: "railway",
    detection: {
      headers: { server: /railway/i },
    },
  },

  // --- WordPress ---
  {
    name: "WordPress",
    category: "CMS",
    icon: "wp",
    detection: {
      meta: { generator: /WordPress/i },
      script: /\/wp-content\//i,
      html: /wp-block|wp-includes/i,
      url: /\/wp-content\/|\/wp-admin\//i,
    },
    version: /WordPress\s*v?(\d+\.\d+\.?\d*)/i,
  },
  {
    name: "Shopify",
    category: "CMS",
    icon: "shopify",
    detection: {
      script: /\/cdn\.shopify\.com\//i,
      html: /shopify|shopify-section/i,
    },
  },
  {
    name: "Squarespace",
    category: "CMS",
    icon: "squarespace",
    detection: {
      script: /static\d*\.squarespace\.com/i,
      meta: { generator: /Squarespace/i },
    },
  },
  {
    name: "Wix",
    category: "CMS",
    icon: "wix",
    detection: {
      script: /\/wix\.com\//i,
      meta: { generator: /Wix/i },
    },
  },
  {
    name: "Webflow",
    category: "CMS",
    icon: "webflow",
    detection: {
      script: /webflow\.js/i,
      meta: { generator: /Webflow/i },
    },
  },

  // --- Fonts ---
  {
    name: "Google Fonts",
    category: "Font Service",
    icon: "google-fonts",
    detection: {
      script: /fonts\.googleapis\.com/i,
      css: /fonts\.googleapis\.com/i,
    },
  },
  {
    name: "Adobe Fonts",
    category: "Font Service",
    icon: "adobe-fonts",
    detection: {
      script: /use\.typekit\.net/i,
      css: /use\.typekit\.net/i,
    },
  },
  {
    name: "Font Awesome",
    category: "Icon Library",
    icon: "fontawesome",
    detection: {
      script: /font-?awesome/i,
      css: /font-?awesome/i,
      html: /class="[^"]*fa(?:s|r|l|b|d)?\s/,
    },
  },
  {
    name: "Lucide Icons",
    category: "Icon Library",
    icon: "lucide",
    detection: {
      html: /class="[^"]*lucide-/i,
      script: /lucide-/i,
    },
  },

  // --- Design ---
  {
    name: "Framer Motion",
    category: "Animation Library",
    icon: "framer",
    detection: {
      script: /framer-motion/i,
      window: /__framerMotion/i,
    },
  },
  {
    name: "GSAP",
    category: "Animation Library",
    icon: "gsap",
    detection: {
      script: /gsap/i,
      window: /gsap|TimelineLite|TweenLite/i,
    },
  },
  {
    name: "Lenis",
    category: "Animation Library",
    icon: "lenis",
    detection: {
      script: /lenis/i,
    },
  },
  {
    name: "Three.js",
    category: "3D Library",
    icon: "threejs",
    detection: {
      script: /three(?:\.min)?\.js/i,
      window: /THREE=/i,
    },
  },

  // --- Backend Frameworks ---
  {
    name: "Express",
    category: "Backend Framework",
    icon: "express",
    detection: {
      headers: { "x-powered-by": /Express/i },
    },
  },
  {
    name: "Next.js API Routes",
    category: "Backend Framework",
    icon: "nextjs",
    detection: {
      headers: { "x-nextjs": /./i },
    },
  },
  {
    name: "tRPC",
    category: "Backend Framework",
    icon: "trpc",
    detection: {
      headers: { "x-trpc": /./i },
      html: /\/_trpc\//i,
    },
  },
  {
    name: "GraphQL",
    category: "Backend Framework",
    icon: "graphql",
    detection: {
      url: /\/graphql/i,
      html: /<link[^>]+href="[^"]*\/graphql/i,
    },
  },
  {
    name: "Hasura",
    category: "Backend Framework",
    icon: "hasura",
    detection: {
      headers: { "x-hasura": /./i },
    },
  },
  {
    name: "Supabase",
    category: "Backend",
    icon: "supabase",
    detection: {
      script: /supabase/i,
      window: /supabase/i,
    },
  },
  {
    name: "Django",
    category: "Backend Framework",
    icon: "django",
    detection: {
      headers: { server: /WSGIServer|gunicorn/i, "x-frame-options": /DENY|SAMEORIGIN/i },
      html: /csrfmiddlewaretoken/i,
    },
  },
  {
    name: "Ruby on Rails",
    category: "Backend Framework",
    icon: "rails",
    detection: {
      headers: { "x-powered-by": /Phusion|Passenger|Rails/i, server: /Passenger/i },
      html: /csrf-param|data-remote="true"/i,
    },
  },
  {
    name: "Laravel",
    category: "Backend Framework",
    icon: "laravel",
    detection: {
      headers: { "x-powered-by": /Laravel/i },
      html: /__livewire|csrf-token/i,
    },
  },
  {
    name: "Spring Boot",
    category: "Backend Framework",
    icon: "spring",
    detection: {
      headers: { "x-application-context": /./i },
    },
  },
  {
    name: "Flask",
    category: "Backend Framework",
    icon: "flask",
    detection: {
      headers: { server: /Werkzeug/i },
    },
  },
  {
    name: "FastAPI",
    category: "Backend Framework",
    icon: "fastapi",
    detection: {
      headers: { server: /uvicorn/i },
    },
  },

  // --- API & Data ---
  {
    name: "REST API",
    category: "API",
    icon: "api",
    detection: {
      headers: { "content-type": /application\/json/i },
    },
  },
  {
    name: "Prisma",
    category: "ORM",
    icon: "prisma",
    detection: {
      script: /@prisma\/client/i,
    },
  },
  {
    name: "PostgreSQL",
    category: "Database",
    icon: "postgres",
    detection: {
      headers: { server: /postgres/i },
    },
  },
  {
    name: "Redis",
    category: "Database",
    icon: "redis",
    detection: {
      headers: { server: /redis/i },
    },
  },
  {
    name: "MongoDB",
    category: "Database",
    icon: "mongodb",
    detection: {
      headers: { server: /mongodb/i },
    },
  },
  {
    name: "MySQL",
    category: "Database",
    icon: "mysql",
    detection: {
      headers: { server: /mysql/i },
    },
  },

  // --- Infrastructure ---
  {
    name: "Docker",
    category: "Infrastructure",
    icon: "docker",
    detection: {
      headers: { server: /docker/i },
    },
  },
  {
    name: "Nginx",
    category: "Infrastructure",
    icon: "nginx",
    detection: {
      headers: { server: /nginx/i },
    },
  },
  {
    name: "Apache",
    category: "Infrastructure",
    icon: "apache",
    detection: {
      headers: { server: /Apache/i },
    },
  },
  {
    name: "Sentry",
    category: "Monitoring",
    icon: "sentry",
    detection: {
      script: /sentry\.(?:min\.)?js|@sentry\//i,
      window: /Sentry\s*\(/i,
    },
  },
  {
    name: "Datadog",
    category: "Monitoring",
    icon: "datadog",
    detection: {
      script: /datadog-rum/i,
      window: /DD_RUM/i,
    },
  },
  {
    name: "New Relic",
    category: "Monitoring",
    icon: "newrelic",
    detection: {
      script: /newrelic/i,
      window: /newrelic/i,
    },
  },
  {
    name: "LogRocket",
    category: "Monitoring",
    icon: "logrocket",
    detection: {
      script: /logrocket/i,
      window: /LogRocket/i,
    },
  },
  {
    name: "PostHog",
    category: "Analytics",
    icon: "posthog",
    detection: {
      script: /posthog/i,
      window: /posthog/i,
    },
  },
  {
    name: "Heap",
    category: "Analytics",
    icon: "heap",
    detection: {
      script: /heapanalytics/i,
      window: /heap\.load/i,
    },
  },
  {
    name: "FullStory",
    category: "Analytics",
    icon: "fullstory",
    detection: {
      script: /fullstory\.com/i,
      window: /FS\.restart|_fs_/i,
    },
  },
  {
    name: "VWO",
    category: "Analytics",
    icon: "vwo",
    detection: {
      script: /vwo\.com/i,
      window: /_vwo_code/i,
    },
  },
  {
    name: "LaunchDarkly",
    category: "Feature Flags",
    icon: "launchdarkly",
    detection: {
      script: /launchdarkly/i,
      window: /LDClient/i,
    },
  },
  {
    name: "Kubernetes",
    category: "Infrastructure",
    icon: "k8s",
    detection: {
      headers: { server: /kube|eks/i },
    },
  },
  {
    name: "Clerk",
    category: "Auth",
    icon: "clerk",
    detection: {
      script: /\/clerk\./i,
    },
  },
  {
    name: "Redux",
    category: "State Management",
    icon: "redux",
    detection: {
      script: /\/redux(?:\.min)?\.js/i,
      window: /__REDUX_DEVTOOLS_EXTENSION__/i,
    },
  },
  {
    name: "Zustand",
    category: "State Management",
    icon: "zustand",
    detection: {
      script: /zustand/i,
    },
  },
  {
    name: "Pinia",
    category: "State Management",
    icon: "pinia",
    detection: {
      script: /pinia/i,
    },
  },

  // --- JavaScript Libraries ---
  {
    name: "jQuery",
    category: "Library",
    icon: "jquery",
    detection: {
      script: /\/jquery(?:\.min)?\.js/i,
      window: /jQuery\s*\(/i,
    },
    version: /jQuery\s*v?(\d+\.\d+\.\d+)/i,
  },
  {
    name: "Alpine.js",
    category: "Library",
    icon: "alpine",
    detection: {
      script: /\/alpine(?:\.min)?\.js/i,
      html: /x-data|x-bind|x-on/i,
    },
  },
  {
    name: "HTMX",
    category: "Library",
    icon: "htmx",
    detection: {
      script: /\/htmx(?:\.min)?\.js/i,
      html: /hx-get|hx-post|hx-trigger/i,
    },
  },
  {
    name: "Turbo",
    category: "Library",
    icon: "turbo",
    detection: {
      script: /\/turbo(?:\.min)?\.js/i,
    },
  },

  // --- Auth ---
  {
    name: "Auth0",
    category: "Auth",
    icon: "auth0",
    detection: {
      script: /\/auth0\./i,
    },
  },
  {
    name: "Firebase Auth",
    category: "Auth",
    icon: "firebase",
    detection: {
      script: /firebase-auth/i,
    },
  },
  {
    name: "NextAuth.js",
    category: "Auth",
    icon: "nextauth",
    detection: {
      script: /next-auth/i,
    },
  },

  // --- Payments ---
  {
    name: "Stripe",
    category: "Payment",
    icon: "stripe",
    detection: {
      script: /\/stripe\.com\/v3\//i,
      window: /Stripe\s*\(/i,
    },
  },

  // --- SEO ---
  {
    name: "Open Graph",
    category: "SEO",
    icon: "opengraph",
    detection: {
      html: /<meta\s+property="og:/i,
    },
  },
  {
    name: "Twitter Cards",
    category: "SEO",
    icon: "twitter",
    detection: {
      html: /<meta\s+name="twitter:/i,
    },
  },
  {
    name: "JSON-LD",
    category: "SEO",
    icon: "jsonld",
    detection: {
      html: /<script\s+type="application\/ld\+json">/i,
    },
  },
  {
    name: "Sitemap",
    category: "SEO",
    icon: "sitemap",
    detection: {
      url: /\/sitemap\.xml/i,
    },
  },
  {
    name: "RSS",
    category: "SEO",
    icon: "rss",
    detection: {
      html: /<link\s+[^>]*type="application\/rss\+xml"/i,
    },
  },
  {
    name: "Prism.js",
    category: "Library",
    icon: "prism",
    detection: {
      script: /\/prism(?:\.min)?\.js/i,
      css: /\/prism(?:\.min)?\.css/i,
      html: /class="[^"]*language-[a-z]+/i,
    },
  },
]

export const CATEGORY_ORDER: Record<string, number> = {
  Framework: 1,
  Library: 2,
  "Backend Framework": 3,
  Language: 4,
  "CSS Framework": 5,
  CSS: 6,
  "Build Tool": 7,
  CMS: 8,
  ORM: 9,
  Database: 10,
  API: 11,
  Analytics: 12,
  Monitoring: 13,
  Hosting: 14,
  CDN: 15,
  Infrastructure: 16,
  "Feature Flags": 17,
  "Font Service": 18,
  "Icon Library": 19,
  "Animation Library": 20,
  "State Management": 21,
  "3D Library": 22,
  Auth: 23,
  Payment: 24,
  SEO: 25,
  Backend: 26,
}

export const ICON_MAP: Record<string, string> = {
  react: "⚛️",
  nextjs: "▲",
  vue: "💚",
  angular: "🅰️",
  svelte: "🧡",
  nuxt: "💚",
  tailwind: "🌊",
  bootstrap: "🅱️",
  typescript: "📘",
  vercel: "▲",
  cloudflare: "☁️",
  stripe: "💳",
  wordpress: "🔵",
  shopify: "🛍️",
  gatsby: "🔥",
  vite: "⚡",
  webpack: "📦",
  gsap: "🎯",
}

export function detectTechnologies(html: string, headers: Record<string, string>): TechnologyMatch[] {
  const matches: TechnologyMatch[] = []

  for (const rule of DETECTION_RULES) {
    let score = 0
    let version: string | undefined

    if (rule.detection.html && rule.detection.html.test(html)) {
      score += 40
    }

    if (rule.detection.script && rule.detection.script.test(html)) {
      score += 35
    }

    if (rule.detection.css && rule.detection.css.test(html)) {
      score += 30
    }

    if (rule.detection.meta) {
      for (const [, pattern] of Object.entries(rule.detection.meta)) {
        if (pattern.test(html)) {
          score += 30
        }
      }
    }

    if (rule.detection.window && rule.detection.window.test(html)) {
      score += 25
    }

    if (rule.detection.url && rule.detection.url.test(html)) {
      score += 20
    }

    if (rule.detection.headers) {
      for (const [header, pattern] of Object.entries(rule.detection.headers)) {
        const value = headers[header.toLowerCase()]
        if (value && pattern.test(value)) {
          score += 40
        }
      }
    }

    if (rule.detection.html && rule.detection.html.test(html)) {
      score += 30
    }

    if (score > 0) {
      if (rule.version) {
        for (const [, pattern] of Object.entries(rule.detection)) {
          if (pattern instanceof RegExp) {
            const match = pattern.exec(html)
            if (match) {
              const versionMatch = match[0].match(rule.version)
              if (versionMatch?.[1]) {
                version = versionMatch[1]
                break
              }
            }
          }
        }
      }

      const confidence = Math.min(score, 99)
      matches.push({
        name: rule.name,
        category: rule.category,
        icon: rule.icon,
        confidence,
        version,
      })
    }
  }

  return matches.sort((a, b) => b.confidence - a.confidence)
}

export interface TechnologyMatch {
  name: string
  category: string
  icon?: string
  confidence: number
  version?: string
}
