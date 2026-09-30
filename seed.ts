import { db } from "@/db";
import { users, courses, lessons, userCourses, userLessons, projects, achievements, userAchievements } from "./schema";
import { eq, sql } from "drizzle-orm";

export async function seedDatabase() {
  // Check if already seeded
  const existingCourses = await db.select().from(courses).limit(1);
  if (existingCourses.length > 0) {
    return;
  }

  console.log("Seeding ASAD IT ACADEMY database...");

  // 1. Create main user
  const [mainUser] = await db.insert(users).values({
    username: "asadbek_dev",
    name: "Asadbek Karimov",
    email: "asadbek@asad-academy.uz",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Lead Developer & Cyber Academy Student. Passionate about AI, Next.js & Game Engines.",
    title: "Full-Stack Engineer",
    level: 4,
    xp: 1250,
    coins: 450,
    streak: 7,
    language: "RU",
  }).returning();

  // Create additional leaderboard users
  const mockStudents = [
    { username: "rustam_ai", name: "Rustam Aliev", email: "rustam@asad.uz", level: 6, xp: 2450, coins: 890, streak: 14, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", title: "AI & ML Specialist" },
    { username: "malika_web", name: "Malika Yusupova", email: "malika@asad.uz", level: 5, xp: 1980, coins: 670, streak: 12, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", title: "Frontend Architect" },
    { username: "jasur_sec", name: "Jasur Nematov", email: "jasur@asad.uz", level: 5, xp: 1820, coins: 620, streak: 9, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", title: "Cybersecurity Analyst" },
    { username: "diyor_gamedev", name: "Diyor Tursunov", email: "diyor@asad.uz", level: 4, xp: 1410, coins: 490, streak: 8, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", title: "3D Engine Creator" },
    { username: "shakhzoda_ux", name: "Shakhzoda Rahimova", email: "shakhzoda@asad.uz", level: 3, xp: 950, coins: 310, streak: 4, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", title: "UI/UX & Product Designer" },
    { username: "bobur_data", name: "Bobur Mahmudov", email: "bobur@asad.uz", level: 3, xp: 880, coins: 280, streak: 3, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", title: "Data Engineer" },
  ];

  await db.insert(users).values(mockStudents);

  // 2. Create 7 Academy Courses matching the 3D Labs
  const coursesData = [
    {
      slug: "python",
      labId: "python-lab",
      nameEn: "Python Lab: Core & Algorithms",
      nameRu: "Python Lab: Основы и Алгоритмы",
      nameUz: "Python Lab: Asoslar va Algoritmlar",
      category: "Backend & Scripting",
      level: "Beginner",
      xpReward: 600,
      totalLessons: 4,
      estimatedHours: 14,
      icon: "Terminal",
      badgeColor: "from-emerald-500 to-teal-700",
      descriptionEn: "Master modern Python 3, high-performance data structures, automation scripts, and problem solving for backend engineering.",
      descriptionRu: "Освойте современный Python 3, структуры данных, алгоритмы автоматизации и основы серверной разработки.",
      descriptionUz: "Zamonaviy Python 3, ma'lumotlar tuzilmalari, algoritmlar va backend dasturlash asoslarini to'liq o'rganing.",
    },
    {
      slug: "web-dev",
      labId: "web-lab",
      nameEn: "Web Development Lab: Next.js & React",
      nameRu: "Web Dev Lab: Next.js и Fullstack React",
      nameUz: "Web Dev Lab: Next.js va Fullstack React",
      category: "Fullstack Web",
      level: "Intermediate",
      xpReward: 750,
      totalLessons: 4,
      estimatedHours: 18,
      icon: "Globe",
      badgeColor: "from-blue-500 to-cyan-600",
      descriptionEn: "Build modern, fast, fullstack web applications using Next.js 15, React 19, Tailwind CSS, TypeScript, and server actions.",
      descriptionRu: "Создавайте современные полнофункциональные веб-приложения на Next.js 15, React 19, Tailwind CSS и TypeScript.",
      descriptionUz: "Next.js 15, React 19, Tailwind CSS va TypeScript yordamida zamonaviy to'liq funksiyali veb-ilovalarni yarating.",
    },
    {
      slug: "ai",
      labId: "ai-lab",
      nameEn: "AI Lab: Neural Nets & LLMs",
      nameRu: "AI Lab: Нейросети и LLM Инженерия",
      nameUz: "AI Lab: Neyron Tarmoqlar va LLM",
      category: "Artificial Intelligence",
      level: "Advanced",
      xpReward: 900,
      totalLessons: 4,
      estimatedHours: 20,
      icon: "Cpu",
      badgeColor: "from-purple-600 to-pink-600",
      descriptionEn: "Explore transformer models, prompt engineering, RAG architecture, vector databases, and fine-tuning intelligent agents.",
      descriptionRu: "Изучите трансформерные архитектуры, RAG, векторные базы данных, системный промптинг и создание автономных AI-агентов.",
      descriptionUz: "Transformator modellari, RAG arxitekturasi, vektor bazalari va mustaqil AI-agentlar yaratishni o'rganing.",
    },
    {
      slug: "cybersecurity",
      labId: "cyber-lab",
      nameEn: "Cybersecurity Lab: Ethical Hacking",
      nameRu: "Cybersecurity Lab: Этичный Хакинг и Защита",
      nameUz: "Cybersecurity Lab: Etik Xaking va Himoya",
      category: "Security & Ops",
      level: "Intermediate",
      xpReward: 800,
      totalLessons: 4,
      estimatedHours: 16,
      icon: "ShieldCheck",
      badgeColor: "from-red-600 to-rose-700",
      descriptionEn: "Learn penetration testing, cryptography, network defense protocols, vulnerability assessment, and zero-trust security.",
      descriptionRu: "Изучите пентестинг, криптографию, защиту сетевых протоколов, аудит уязвимостей и концепцию Zero Trust.",
      descriptionUz: "Penetration testing, kriptografiya, tarmoq xavfsizligi protokollari va xavfsizlik auditini o'rganing.",
    },
    {
      slug: "game-dev",
      labId: "game-lab",
      nameEn: "Game Dev Lab: 3D Graphics & Physics",
      nameRu: "Game Dev Lab: 3D Графика и Игровой Движок",
      nameUz: "Game Dev Lab: 3D Grafika va O'yin Dvigateli",
      category: "Graphics & Interactive",
      level: "Intermediate",
      xpReward: 850,
      totalLessons: 4,
      estimatedHours: 17,
      icon: "Gamepad2",
      badgeColor: "from-amber-500 to-orange-600",
      descriptionEn: "Create interactive 3D virtual worlds, shaders, physics simulations, camera rigs, and character controllers.",
      descriptionRu: "Создавайте трехмерные интерактивные миры, шейдеры, физические симуляции и контроллеры персонажей в реальном времени.",
      descriptionUz: "Uch o'lchamli interaktiv olamlar, shaderlar, fizik simulyatsiyalar va o'yin boshqaruv tizimlarini quring.",
    },
    {
      slug: "ui-ux",
      labId: "ui-ux-studio",
      nameEn: "UI/UX Studio: Design Systems & Figma",
      nameRu: "UI/UX Studio: Дизайн-Системы и UX Исследования",
      nameUz: "UI/UX Studio: Dizayn Tizimlari va Figma",
      category: "Design & Product",
      level: "Beginner",
      xpReward: 550,
      totalLessons: 4,
      estimatedHours: 12,
      icon: "Palette",
      badgeColor: "from-fuchsia-500 to-purple-700",
      descriptionEn: "Design intuitive interfaces, interactive micro-interactions, responsive layouts, and design tokens.",
      descriptionRu: "Проектируйте интуитивные интерфейсы, дизайн-системы, микроанимации и проводите UX-исследования пользователей.",
      descriptionUz: "Intuitiv interfeyslar, dizayn tizimlari, mikro-animatsiyalar va foydalanuvchi tajribasini (UX) loyihalang.",
    },
    {
      slug: "database",
      labId: "db-lab",
      nameEn: "Database Lab: PostgreSQL & High-Load",
      nameRu: "Database Lab: PostgreSQL и Высокие Нагрузки",
      nameUz: "Database Lab: PostgreSQL va Yuqori Yuklama",
      category: "Data & Storage",
      level: "Intermediate",
      xpReward: 700,
      totalLessons: 4,
      estimatedHours: 15,
      icon: "Database",
      badgeColor: "from-indigo-600 to-blue-800",
      descriptionEn: "Deep dive into relational database indexing, query optimization, transactions (ACID), Drizzle ORM, and replication.",
      descriptionRu: "Глубокое погружение в индексацию PostgreSQL, оптимизацию SQL-запросов, транзакции ACID и Drizzle ORM.",
      descriptionUz: "PostgreSQL indekslash, SQL so'rovlarni optimallashtirish, ACID tranzaksiyalari va Drizzle ORM ni chuqur o'rganing.",
    },
  ];

  const createdCourses = await db.insert(courses).values(coursesData).returning();

  // 3. Create rich lessons for each course
  const lessonsData = [
    // Python Course Lessons
    {
      courseId: createdCourses[0].id,
      orderIndex: 1,
      titleEn: "Python Variables, Types and Control Flow",
      titleRu: "Переменные, Типы данных и Условия в Python",
      titleUz: "Python O'zgaruvchilari, Tiplar va Shartlar",
      summaryEn: "Learn fundamental types: int, float, str, list, dict, and write conditionals.",
      summaryRu: "Изучите базовые типы: числа, строки, списки, словари и ветвление if/else.",
      summaryUz: "Asosiy tiplar: int, float, str, list, dict va if/else shartlarini o'rganing.",
      contentEn: `### Welcome to Python Lab!
In this lesson, you will learn how Python stores information in variables and how logic branches operate.

#### Key Concepts:
1. **Dynamic Typing:** Python automatically detects the variable type.
2. **Lists & Dictionaries:** Powerful built-in data collections.
3. **Conditionals:** \`if\`, \`elif\`, \`else\` blocks for business logic.

\`\`\`python
# Example: Student Grade Classifier
def evaluate_student(name: str, score: int) -> str:
    if score >= 90:
        return f"{name} passed with Distinction! (Grade: A)"
    elif score >= 75:
        return f"{name} passed successfully! (Grade: B)"
    else:
        return f"{name} needs extra practice. (Grade: C)"

print(evaluate_student("Asadbek", 95))
\`\`\`
`,
      contentRu: `### Добро пожаловать в Python Lab!
В этом уроке вы узнаете, как Python работает с переменными, базовыми типами и условиями.

#### Ключевые концепции:
1. **Динамическая типизация:** Python сам определяет тип переменной.
2. **Списки и Словари:** Удобные встроенные коллекции данных.
3. **Ветвление:** Блоки \`if\`, \`elif\`, \`else\` для логики программы.

\`\`\`python
# Пример: Оценка студента
def evaluate_student(name: str, score: int) -> str:
    if score >= 90:
        return f"{name} сдал на Отлично! (Оценка: A)"
    elif score >= 75:
        return f"{name} успешно сдал! (Оценка: B)"
    else:
        return f"{name} нужна доработка. (Оценка: C)"

print(evaluate_student("Asadbek", 95))
\`\`\`
`,
      contentUz: `### Python Lab ga xush kelibsiz!
Ushbu darsda Python o'zgaruvchilari, ma'lumot turlari va mantiqiy shartlar bilan ishlashni o'rganasiz.

\`\`\`python
def evaluate_student(name: str, score: int) -> str:
    if score >= 90:
        return f"{name} A'lo bahoga topshirdi! (Baho: A)"
    elif score >= 75:
        return f"{name} Yaxshi topshirdi! (Baho: B)"
    else:
        return f"{name} yana mashq qilishi kerak. (Baho: C)"

print(evaluate_student("Asadbek", 95))
\`\`\`
`,
      codeSnippet: `def calculate_academy_rank(xp):\n    if xp > 2000:\n        return "Cyber Master"\n    elif xp > 1000:\n        return "Senior Cadet"\n    return "Novice Developer"\n\nprint(calculate_academy_rank(1250))`,
      expectedOutput: `Senior Cadet`,
      xpReward: 50,
      quizData: {
        question: "Which keyword in Python defines a reusable function?",
        options: ["function", "def", "fn", "declare"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[0].id,
      orderIndex: 2,
      titleEn: "Data Structures & List Comprehensions",
      titleRu: "Структуры Данных и Генераторы Списков",
      titleUz: "Ma'lumotlar Tuzilmasi va Ro'yxat Generatorlari",
      summaryEn: "Write elegant, idiomatic Python with list comprehensions, sets, and dict mappings.",
      summaryRu: "Пишите лаконичный код с помощью списковых включений, множеств и словарей.",
      summaryUz: "List comprehension, set va lug'atlar yordamida ixcham kod yozishni o'rganing.",
      contentEn: `### List Comprehensions in Python
List comprehensions provide a concise way to create lists based on existing iterables.

\`\`\`python
scores = [45, 88, 92, 60, 99, 74]
passed = [s for s in scores if s >= 75]
print("Passed scores:", passed)
\`\`\`
`,
      contentRu: `### Генераторы списков (List Comprehensions)
Генераторы списков позволяют создавать новые списки в одну читаемую строку.

\`\`\`python
scores = [45, 88, 92, 60, 99, 74]
passed = [s for s in scores if s >= 75]
print("Сданные баллы:", passed)
\`\`\`
`,
      contentUz: `### Ro'yxat generatorlari
Ro'yxatlarni bir qatorda chiroyli va tez hosil qilish usuli.`,
      codeSnippet: `cadets = ["Asad", "Rustam", "Jasur", "Malika"]\nupper_cadets = [c.upper() for c in cadets]\nprint(upper_cadets)`,
      expectedOutput: `['ASAD', 'RUSTAM', 'JASUR', 'MALIKA']`,
      xpReward: 60,
      quizData: {
        question: "What is the time complexity of dictionary lookup in Python on average?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[0].id,
      orderIndex: 3,
      titleEn: "Object-Oriented Programming & Classes",
      titleRu: "Объектно-Ориентированное Программирование (ООП)",
      titleUz: "Obyektga Yo'naltirilgan Dasturlash (OOP)",
      summaryEn: "Encapsulation, inheritance, magic dunder methods, and dataclasses.",
      summaryRu: "Инкапсуляция, наследование, магические методы и датаклассы.",
      summaryUz: "Inkapsulyatsiya, vorislik va sinflar bilan ishlash.",
      contentEn: `### OOP in Python
Build reusable entities with classes, constructors \`__init__\`, and methods.`,
      contentRu: `### ООП в Python
Создавайте масштабируемые сущности с помощью классов и методов.`,
      contentUz: `### Python da OOP asoslari`,
      codeSnippet: `class AcademyStudent:\n    def __init__(self, name, xp):\n        self.name = name\n        self.xp = xp\n    def add_xp(self, amount):\n        self.xp += amount\n        return self.xp\n\nstudent = AcademyStudent("Asadbek", 1250)\nprint(student.add_xp(150))`,
      expectedOutput: `1400`,
      xpReward: 70,
      quizData: {
        question: "What is the self parameter inside a class method?",
        options: ["Global variable", "Instance reference", "Class constructor name", "Keyword for loops"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[0].id,
      orderIndex: 4,
      titleEn: "Asynchronous Python & APIs",
      titleRu: "Асинхронный Python и Работа с API",
      titleUz: "Asinxron Python va API bilan Ishlash",
      summaryEn: "Asyncio, coroutines, httpx, and building fast API services.",
      summaryRu: "Asyncio, корутины, асинхронные HTTP-запросы и основы FastAPI.",
      summaryUz: "Asyncio, coroutine va API so'rovlar bilan ishlash.",
      contentEn: `### Async Programming
Learn non-blocking I/O with \`async\` and \`await\`.`,
      contentRu: `### Асинхронное Программирование
Асинхронные вызовы ускоряют обработку сотен сетевых запросов.`,
      contentUz: `### Asinxron Dasturlash`,
      codeSnippet: `import asyncio\n\nasync def fetch_status():\n    return "Academy System Online"\n\nprint(asyncio.run(fetch_status()))`,
      expectedOutput: `Academy System Online`,
      xpReward: 80,
      quizData: {
        question: "Which keyword awaits an async coroutine in Python?",
        options: ["wait", "yield", "await", "defer"],
        correctIndex: 2,
      },
    },

    // Web Dev Lab Lessons
    {
      courseId: createdCourses[1].id,
      orderIndex: 1,
      titleEn: "Next.js 15 App Router & Server Components",
      titleRu: "Next.js 15 App Router и Серверные Компоненты",
      titleUz: "Next.js 15 App Router va Server Komponentlar",
      summaryEn: "Understand Server vs Client components, streaming, and layouts.",
      summaryRu: "Разберитесь в RSC, клиентских хуках, стриминге и архитектуре layout.",
      summaryUz: "Server va Client komponentlar, layoutlar arxitekturasini o'rganing.",
      contentEn: `### Next.js 15 App Router
React Server Components (RSC) allow rendering UI directly on the server without sending JS bundles to the client.

#### Highlights:
- Zero bundle size for server-only dependencies.
- Direct database access inside async components.
- Instant initial page loads and superior SEO.
`,
      contentRu: `### Next.js 15 Архитектура
Серверные компоненты React позволяют рендерить UI на сервере без отправки лишнего JS клиенту.

#### Преимущества:
- Прямой доступ к базе данных прямо в компоненте.
- Мгновенная загрузка страниц и идеальное SEO.
- Высокая безопасность секретных ключей.
`,
      contentUz: `### Next.js 15 App Router asoslari`,
      codeSnippet: `export default async function DashboardHeader() {\n  const academyName = "ASAD IT ACADEMY";\n  return <h1>Welcome to {academyName}</h1>;\n}`,
      expectedOutput: `Welcome to ASAD IT ACADEMY`,
      xpReward: 60,
      quizData: {
        question: "Which directive marks a component as interactive client-side in Next.js App Router?",
        options: ["'use client'", "'use react'", "'client-only'", "'use browser'"],
        correctIndex: 0,
      },
    },
    {
      courseId: createdCourses[1].id,
      orderIndex: 2,
      titleEn: "Tailwind CSS Modern Design & Theming",
      titleRu: "Современная верстка на Tailwind CSS и Темы",
      titleUz: "Tailwind CSS Zamonaviy Dizayn va Mavzular",
      summaryEn: "Build glowing cyber aesthetics, responsive grids, and dark modes.",
      summaryRu: "Создавайте неоновые интерфейсы, адаптивные сетки и темные темы.",
      summaryUz: "Zamonaviy cyber interfeyslar va moslashuvchan dizayn yaratish.",
      contentEn: `### Tailwind CSS Utility Mastery
Utility classes help construct rapid, consistent design tokens.`,
      contentRu: `### Мастерство Tailwind CSS
Утилитарные классы позволяют быстро собирать премиальные кибер-интерфейсы.`,
      contentUz: `### Tailwind CSS amaliyoti`,
      codeSnippet: `const badge = "px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl shadow-lg";\nconsole.log(badge);`,
      expectedOutput: `px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl shadow-lg`,
      xpReward: 60,
      quizData: {
        question: "How do you apply a flex container with centering in Tailwind?",
        options: ["display-flex items-center", "flex items-center justify-center", "center-flex", "grid place-center"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[1].id,
      orderIndex: 3,
      titleEn: "State Management, Hooks & Dynamic UI",
      titleRu: "Управление состоянием, Хуки и Динамический UI",
      titleUz: "Holat Boshqaruvi, Hooklar va Dinamik UI",
      summaryEn: "useState, useEffect, useMemo, custom hooks, and reactive store patterns.",
      summaryRu: "Хуки React, оптимизация рендеров и реактивное состояние.",
      summaryUz: "React hooklari va dinamik interfeys boshqaruvi.",
      contentEn: `### Reactive State
Handle user actions, tab switching, and instant UI state updates seamlessly.`,
      contentRu: `### Реактивное состояние
Управляйте переключением вкладок, модальными окнами и действиями пользователя без задержек.`,
      contentUz: `### Reaktiv holat boshqaruvi`,
      codeSnippet: `const [xp, setXp] = [1250, (val) => val];\nconst gainXp = (amount) => xp + amount;\nconsole.log("New XP:", gainXp(100));`,
      expectedOutput: `New XP: 1350`,
      xpReward: 70,
      quizData: {
        question: "Which hook is used to perform side effects like subscriptions or DOM events?",
        options: ["useState", "useMemo", "useEffect", "useCallback"],
        correctIndex: 2,
      },
    },
    {
      courseId: createdCourses[1].id,
      orderIndex: 4,
      titleEn: "Fullstack API Routes & Drizzle Integration",
      titleRu: "Полнофункциональные API и Интеграция Drizzle ORM",
      titleUz: "To'liq Funksiyali API va Drizzle ORM Integratsiyasi",
      summaryEn: "Connect PostgreSQL database, handle JSON requests, validate payloads.",
      summaryRu: "Подключение базы данных PostgreSQL, типизированные запросы и REST API.",
      summaryUz: "PostgreSQL ma'lumotlar bazasi va xavfsiz API yaratish.",
      contentEn: `### Next.js API Routes & Drizzle
Create type-safe database schemas and API endpoints with Next.js Route Handlers.`,
      contentRu: `### Next.js API маршруты и Drizzle ORM
Типобезопасная работа с базой данных PostgreSQL.`,
      contentUz: `### API va Drizzle ORM integratsiyasi`,
      codeSnippet: `const response = { status: "success", code: 200, message: "Course enrolled successfully" };\nconsole.log(response.message);`,
      expectedOutput: `Course enrolled successfully`,
      xpReward: 80,
      quizData: {
        question: "What HTTP method is standard for creating a new resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctIndex: 1,
      },
    },

    // AI Lab Lessons
    {
      courseId: createdCourses[2].id,
      orderIndex: 1,
      titleEn: "Introduction to Large Language Models (LLMs)",
      titleRu: "Введение в Большие Языковые Модели (LLM)",
      titleUz: "Katta Til Modellari (LLM) Kirish",
      summaryEn: "Tokenization, transformer attention mechanism, and prompt engineering principles.",
      summaryRu: "Токенизация, механизм внимания трансформеров и принципы системного промптинга.",
      summaryUz: "Tokenizatsiya, transformer arxitekturasi va prompt muhandisligi.",
      contentEn: `### Artificial Intelligence & LLMs
Large Language Models process sequences of text tokens through multi-head self-attention.`,
      contentRu: `### Искусственный Интеллект и LLM
Современные нейросети используют механизм Self-Attention для понимания контекста запроса.`,
      contentUz: `### Sun'iy Intellekt va LLM`,
      codeSnippet: `prompt = "You are ASAD AI Tutor. Answer concisely."\nrole = "system"\nprint(f"[{role.upper()}] Initialized AI Agent")`,
      expectedOutput: `[SYSTEM] Initialized AI Agent`,
      xpReward: 70,
      quizData: {
        question: "What is the core breakthrough architecture behind GPT models?",
        options: ["RNN", "Transformer", "Genetic Algorithm", "Markov Chain"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[2].id,
      orderIndex: 2,
      titleEn: "Retrieval-Augmented Generation (RAG) & Vector DBs",
      titleRu: "Архитектура RAG и Векторные Базы Данных",
      titleUz: "RAG Arxitekturasi va Vektor Bazalar",
      summaryEn: "Embeddings, cosine similarity, pgvector, and semantic search.",
      summaryRu: "Эмбеддинги, косинусное сходство, векторный поиск и интеграция документации.",
      summaryUz: "Embeddinglar, semantik qidiruv va vektor ma'lumotlar bazalari.",
      contentEn: `### RAG Architecture
RAG allows LLMs to query custom internal databases before generating responses.`,
      contentRu: `### Архитектура RAG
RAG находит релевантный контекст из внутренней базы знаний и передает его в модель.`,
      contentUz: `### RAG arxitekturasi va qidiruv`,
      codeSnippet: `def cosine_sim(a, b):\n    return sum(x*y for x, y in zip(a, b))\n\nprint("Vector Similarity:", round(cosine_sim([0.8, 0.6], [0.8, 0.6]), 2))`,
      expectedOutput: `Vector Similarity: 1.0`,
      xpReward: 80,
      quizData: {
        question: "What does RAG stand for?",
        options: ["Random Agent Generator", "Retrieval-Augmented Generation", "Recursive Algorithm Graph", "Realtime AI Gateway"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[2].id,
      orderIndex: 3,
      titleEn: "Autonomous AI Agents & Tool Calling",
      titleRu: "Автономные AI-Агенты и Function Calling",
      titleUz: "Avtonom AI-Agentlar va Funksiyalar Chaqiruvi",
      summaryEn: "Equip AI agents with executable tools, APIs, and memory loops.",
      summaryRu: "Подключение функций, внешних API и циклов принятия решений к AI.",
      summaryUz: "AI-agentlarga vositalar va API ulash.",
      contentEn: `### Function Calling
Agents can decide when to invoke code tools to fetch real-time data.`,
      contentRu: `### Вызов инструментов AI
Агенты могут выполнять код, обращаться к базе и возвращать проверенные данные.`,
      contentUz: `### AI vositalari va agentlar`,
      codeSnippet: `tools = ["run_code", "search_academy_db", "award_xp"]\nprint("Registered AI Tools:", len(tools))`,
      expectedOutput: `Registered AI Tools: 3`,
      xpReward: 90,
      quizData: {
        question: "Why do AI agents use Tool Calling?",
        options: ["To play games only", "To execute verified real-world actions & data lookups", "To format HTML", "To save RAM"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[2].id,
      orderIndex: 4,
      titleEn: "Fine-Tuning & Model Evaluation",
      titleRu: "Тонкая настройка (Fine-Tuning) и Оценка Моделей",
      titleUz: "Modelni Nozik Sozlash va Baholash",
      summaryEn: "LoRA, PEFT, quantization, and benchmark testing.",
      summaryRu: "Методы LoRA, квантование и тестирование точности нейросетей.",
      summaryUz: "LoRA va model aniqligini tekshirish.",
      contentEn: `### Fine-Tuning Models
Specialize pre-trained foundation models on custom coding datasets.`,
      contentRu: `### Дообучение нейросетей
Адаптируйте открытые модели под узкие задачи программирования.`,
      contentUz: `### Modelni ixtisoslashtirish`,
      codeSnippet: `print("AI Model Fine-Tuned: ASAD-Code-v2.1")`,
      expectedOutput: `AI Model Fine-Tuned: ASAD-Code-v2.1`,
      xpReward: 100,
      quizData: {
        question: "What is LoRA used for?",
        options: ["Full model retraining", "Parameter-Efficient Fine-Tuning", "Image compression", "DNS routing"],
        correctIndex: 1,
      },
    },

    // Cybersecurity Lab Lessons
    {
      courseId: createdCourses[3].id,
      orderIndex: 1,
      titleEn: "Network Protocols & Reconnaissance",
      titleRu: "Сетевые Протоколы и Разведка (Recon)",
      titleUz: "Tarmoq Protokollari va Razvedka",
      summaryEn: "TCP/IP handshakes, port scanning, Wireshark packet analysis.",
      summaryRu: "TCP-рукопожатия, сканирование портов Nmap и анализ пакетов.",
      summaryUz: "TCP/IP protokollari va tarmoq tahlili.",
      contentEn: `### Network Fundamentals
Understanding the 3-way handshake (SYN, SYN-ACK, ACK) and port security.`,
      contentRu: `### Сетевые основы
Изучение 3-этапного рукопожатия TCP и мониторинг подозрительного трафика.`,
      contentUz: `### Tarmoq xavfsizligi asoslari`,
      codeSnippet: `open_ports = [22, 80, 443, 5432]\nprint(f"Audited {len(open_ports)} secure ports")`,
      expectedOutput: `Audited 4 secure ports`,
      xpReward: 70,
      quizData: {
        question: "What is the standard port for HTTPS encrypted traffic?",
        options: ["80", "443", "8080", "22"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[3].id,
      orderIndex: 2,
      titleEn: "Web Vulnerabilities: OWASP Top 10",
      titleRu: "Уязвимости Веб-Приложений: OWASP Top 10",
      titleUz: "Veb Xavfsizlik: OWASP Top 10",
      summaryEn: "SQL Injection, XSS, CSRF, SSRF, and defense mechanisms.",
      summaryRu: "SQL-инъекции, XSS, CSRF и способы их надежного предотвращения.",
      summaryUz: "SQL Injection va XSS hujumlaridan himoyalanish.",
      contentEn: `### OWASP Top 10
Preventing malicious query injections with parameterized queries and prepared statements.`,
      contentRu: `### OWASP Top 10
Используйте параметризованные запросы и санитизацию ввода для защиты данных.`,
      contentUz: `### Veb xavfsizlik va himoya usullari`,
      codeSnippet: `safe_query = "SELECT * FROM users WHERE id = $1"\nprint("Parameterized Query Ready:", safe_query)`,
      expectedOutput: `Parameterized Query Ready: SELECT * FROM users WHERE id = $1`,
      xpReward: 80,
      quizData: {
        question: "Which technique prevents SQL Injection vulnerabilities effectively?",
        options: ["String concatenation", "Parameterized queries / ORM", "Base64 encoding", "HTML escaping"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[3].id,
      orderIndex: 3,
      titleEn: "Cryptography & Zero Trust Architecture",
      titleRu: "Криптография и Концепция Zero Trust",
      titleUz: "Kriptografiya va Zero Trust Arxitekturasi",
      summaryEn: "AES-256, RSA public key encryption, hashing, and token authentication.",
      summaryRu: "Симметричное и асимметричное шифрование, хеширование паролей Argon2.",
      summaryUz: "Shifrlash algoritmlari va xavfsiz autentifikatsiya.",
      contentEn: `### Modern Cryptography
Never store plain text passwords; use salted cryptographic hash functions.`,
      contentRu: `### Современная Криптография
Никогда не храните пароли в открытом виде. Используйте стойкие алгоритмы хеширования.`,
      contentUz: `### Parollarni xavfsiz shifrlash`,
      codeSnippet: `import hashlib\nhash_val = hashlib.sha256(b"ASAD_ACADEMY_SECURE").hexdigest()[:16]\nprint("Cryptographic Hash:", hash_val)`,
      expectedOutput: `Cryptographic Hash: 236814a008ceeb5f`,
      xpReward: 90,
      quizData: {
        question: "What is the core principle of Zero Trust Security?",
        options: ["Trust everyone inside network", "Never trust, always verify", "Only check passwords once", "Disable firewalls"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[3].id,
      orderIndex: 4,
      titleEn: "Incident Response & Ethical Penetration Testing",
      titleRu: "Реагирование на Инциденты и Пентестинг",
      titleUz: "Hodisalarga Javob va Etik Xaking",
      summaryEn: "Threat hunting, SOC workflows, and ethical red-teaming reports.",
      summaryRu: "Поиск угроз, работа SOC-центра и составление отчетов аудита безопасности.",
      summaryUz: "Xavfsizlik auditi va test o'tkazish.",
      contentEn: `### Incident Response
Structured approach to identifying, containing, and eradicating cyber threats.`,
      contentRu: `### Реагирование на Инциденты
Комплексный протокол локализации и устранения кибер-угроз.`,
      contentUz: `### Xavfsizlik hodisalarini bartaraf etish`,
      codeSnippet: `print("Incident Status: Contained and Mitigated")`,
      expectedOutput: `Incident Status: Contained and Mitigated`,
      xpReward: 100,
      quizData: {
        question: "What is the goal of an ethical Red Team?",
        options: ["Destroy production servers", "Simulate adversary attacks to find vulnerabilities", "Send spam emails", "Delete user accounts"],
        correctIndex: 1,
      },
    },

    // Game Dev Lab Lessons
    {
      courseId: createdCourses[4].id,
      orderIndex: 1,
      titleEn: "3D Coordinate Spaces, Cameras & Meshes",
      titleRu: "3D Пространство, Камеры и Полигональные Сетки",
      titleUz: "3D Koordinatalar, Kameralar va Meshlar",
      summaryEn: "Vectors in 3D, perspective projection, scene graphs, and lighting.",
      summaryRu: "Векторы в 3D, перспективные проекции, дерево сцены и источники света.",
      summaryUz: "3D fazo, kamera proyeksiyasi va chiroqlar bilan ishlash.",
      contentEn: `### 3D Graphics Basics
Every 3D object consists of vertices, faces, normals, and materials rendered in a scene.`,
      contentRu: `### Основы 3D Графики
Сцены Three.js объединяют меши, материалы, геометрию и динамическое освещение.`,
      contentUz: `### 3D Grafika asoslari`,
      codeSnippet: `const position = { x: 10, y: 2, z: -15 };\nconsole.log(\`Object located at X:\${position.x} Y:\${position.y} Z:\${position.z}\`);`,
      expectedOutput: `Object located at X:10 Y:2 Z:-15`,
      xpReward: 70,
      quizData: {
        question: "Which component in 3D determines how light bounces off an object?",
        options: ["Mesh", "Material / Shader", "Geometry", "Bounding Box"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[4].id,
      orderIndex: 2,
      titleEn: "Physics Simulation & Collision Detection",
      titleRu: "Физическая Симуляция и Обнаружение Столкновений",
      titleUz: "Fizika Simulyatsiyasi va To'qnashuvlar",
      summaryEn: "Rigid bodies, raycasting, bounding boxes (AABB), and gravity loops.",
      summaryRu: "Твердые тела, рейкастинг, ограничивающие объемы AABB и гравитация.",
      summaryUz: "Qattiq jismlar, raycasting va to'qnashuvlarni hisoblash.",
      contentEn: `### Game Physics
Physics engines calculate velocity, acceleration, gravity, and collision responses each frame.`,
      contentRu: `### Игровая Физика
Физический движок рассчитывает гравитацию и предотвращает прохождение сквозь стены.`,
      contentUz: `### O'yin fizikasi va to'qnashuvlar`,
      codeSnippet: `let velocityY = -9.8;\nlet isGrounded = true;\nif (isGrounded) velocityY = 0;\nconsole.log("Player Velocity Y:", velocityY);`,
      expectedOutput: `Player Velocity Y: 0`,
      xpReward: 80,
      quizData: {
        question: "What is Raycasting primarily used for in 3D games?",
        options: ["Calculating sound volume", "Detecting line-of-sight & mouse clicks on 3D objects", "Saving game files", "Rendering CSS"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[4].id,
      orderIndex: 3,
      titleEn: "GLSL Shaders & Visual Effects",
      titleRu: "Шейдеры GLSL и Визуальные Эффекты",
      titleUz: "GLSL Shaderlar va Vizual Effektlar",
      summaryEn: "Vertex and fragment shaders, glowing holograms, and particle systems.",
      summaryRu: "Вершинные и фрагментные шейдеры, голограммы и системы частиц.",
      summaryUz: "Fragment shaderlar, zarrachalar va neon effektlar.",
      contentEn: `### Shaders & GPU Programming
Custom shaders run parallel code on GPU cores to produce real-time lighting and glows.`,
      contentRu: `### Шейдеры и GPU
Шейдеры выполняются параллельно на тысячах ядер видеокарты для создания неоновых эффектов.`,
      contentUz: `### GPU va Shaderlar`,
      codeSnippet: `console.log("Shader program compiled: Cyberpunk_Glow_v1.glsl");`,
      expectedOutput: `Shader program compiled: Cyberpunk_Glow_v1.glsl`,
      xpReward: 85,
      quizData: {
        question: "Which shader is responsible for calculating pixel colors?",
        options: ["Vertex Shader", "Fragment / Pixel Shader", "Geometry Shader", "Compute Shader"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[4].id,
      orderIndex: 4,
      titleEn: "Interactive Character Controllers & WASD Navigation",
      titleRu: "Контроллер Персонажа и WASD Навигация",
      titleUz: "Qahramon Boshqaruvi va WASD Navigatsiya",
      summaryEn: "Smooth camera damping, pointer lock controls, and world interactions.",
      summaryRu: "Плавное движение камеры, Pointer Lock и триггеры взаимодействия.",
      summaryUz: "WASD klaviatura va sichqoncha orqali 3D dunyoni boshqarish.",
      contentEn: `### First/Third Person Navigation
Combine keyboard event listeners with frame delta-time for smooth, responsive movement.`,
      contentRu: `### Навигация персонажа
Связывайте клавиши WASD с вектором направления движения и временем кадра delta time.`,
      contentUz: `### 3D qahramon boshqaruvi`,
      codeSnippet: `const keys = { w: true, a: false, s: false, d: false };\nconsole.log("Moving Forward:", keys.w);`,
      expectedOutput: `Moving Forward: true`,
      xpReward: 90,
      quizData: {
        question: "Why should movement speeds be multiplied by deltaTime?",
        options: ["To slow down the game", "To make movement frame-rate independent", "To invert controls", "To save battery"],
        correctIndex: 1,
      },
    },

    // UI/UX Studio Lessons
    {
      courseId: createdCourses[5].id,
      orderIndex: 1,
      titleEn: "Visual Hierarchy & Design Systems",
      titleRu: "Визуальная Иерархия и Дизайн-Системы",
      titleUz: "Vizual Ierarxiya va Dizayn Tizimlari",
      summaryEn: "Color theory, typography scales, contrast ratios, and design tokens.",
      summaryRu: "Теория цвета, типографика, коэффициенты контраста и дизайн-токены.",
      summaryUz: "Ranglar nazariyasi, tipografika va dizayn qoidalari.",
      contentEn: `### Design System Architecture
Maintain consistent padding, typography scales, and cohesive UI color palettes.`,
      contentRu: `### Архитектура Дизайн-Систем
Обеспечьте предсказуемость интерфейса с помощью четких правил отступов и шрифтовых пар.`,
      contentUz: `### Dizayn tizimlari asoslari`,
      codeSnippet: `const tokens = { primary: "#06b6d4", bg: "#090d16", font: "Inter, sans-serif" };\nconsole.log("Design System Tokens Active");`,
      expectedOutput: `Design System Tokens Active`,
      xpReward: 50,
      quizData: {
        question: "What minimum contrast ratio is recommended by WCAG AA for normal text?",
        options: ["2:1", "3:1", "4.5:1", "7:1"],
        correctIndex: 2,
      },
    },
    {
      courseId: createdCourses[5].id,
      orderIndex: 2,
      titleEn: "Figma Components, Auto-Layout & Variants",
      titleRu: "Figma Компоненты, Auto-Layout и Варианты",
      titleUz: "Figma Komponentlari va Auto-Layout",
      summaryEn: "Reusable master components, auto-layout responsive constraints, prototype links.",
      summaryRu: "Мастер-компоненты, адаптивный Auto-Layout и интерактивные прототипы в Figma.",
      summaryUz: "Figma da qayta ishlatiladigan komponentlar va prototiplar.",
      contentEn: `### Figma Prototyping
Design scalable responsive modules that translate 1-to-1 into modern frontend code.`,
      contentRu: `### Прототипирование в Figma
Создавайте компоненты, которые легко переносятся в чистый React и Tailwind код.`,
      contentUz: `### Figma komponentlari`,
      codeSnippet: `console.log("Figma Component: Button[variant=cyber-glow, state=hover]");`,
      expectedOutput: `Figma Component: Button[variant=cyber-glow, state=hover]`,
      xpReward: 60,
      quizData: {
        question: "What does Auto Layout in Figma simulate in CSS?",
        options: ["CSS Float", "Flexbox / CSS Grid", "Table layout", "Fixed positioning"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[5].id,
      orderIndex: 3,
      titleEn: "Micro-Interactions & Motion Design",
      titleRu: "Микро-Взаимодействия и Motion-Дизайн",
      titleUz: "Mikro-Interaksiyalar va Harakat Dizayni",
      summaryEn: "Delightful button hover states, ripple effects, page transitions.",
      summaryRu: "Эффекты наведения, анимации загрузки, плавные переходы и обратная связь.",
      summaryUz: "Tugmalar animatsiyasi va foydalanuvchi qulayligi.",
      contentEn: `### Micro-Interactions
Provide instantaneous visual and tactile feedback for every user interaction.`,
      contentRu: `### Микро-Взаимодействия
Каждое нажатие кнопки должно сопровождаться понятным визуальным откликом.`,
      contentUz: `### Interaktiv effektlar`,
      codeSnippet: `console.log("Interactive Feedback: Ripple + 150ms spring animation");`,
      expectedOutput: `Interactive Feedback: Ripple + 150ms spring animation`,
      xpReward: 70,
      quizData: {
        question: "Why are micro-interactions crucial in modern apps?",
        options: ["They slow down the UI", "They confirm user actions and enhance usability", "They replace code", "They increase file size"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[5].id,
      orderIndex: 4,
      titleEn: "UX Research & Usability Testing",
      titleRu: "UX Исследования и Юзабилити-Тестирование",
      titleUz: "UX Tadqiqotlar va Qulaylik Testlari",
      summaryEn: "User journey maps, heuristic evaluation, A/B testing, and accessibility.",
      summaryRu: "Карты путей пользователей, эвристический анализ интерфейса и A/B тесты.",
      summaryUz: "Foydalanuvchi tajribasi va mahsulotni testlash.",
      contentEn: `### Usability Principles
Reduce cognitive load and simplify critical user conversion funnels.`,
      contentRu: `### Принципы Юзабилити
Снижайте когнитивную нагрузку и делайте пути пользователей интуитивно понятными.`,
      contentUz: `### UX tamoyillari`,
      codeSnippet: `console.log("Usability Score: 98/100 - Zero Cognitive Friction");`,
      expectedOutput: `Usability Score: 98/100 - Zero Cognitive Friction`,
      xpReward: 80,
      quizData: {
        question: "What is cognitive load in UX design?",
        options: ["Internet speed", "Mental effort required to use the user interface", "CPU temperature", "Server memory usage"],
        correctIndex: 1,
      },
    },

    // Database Lab Lessons
    {
      courseId: createdCourses[6].id,
      orderIndex: 1,
      titleEn: "Relational Modeling & Schema Design",
      titleRu: "Реляционное Моделирование и Проектирование Схем",
      titleUz: "Relyatsion Modellashtirish va Sxema Dizayni",
      summaryEn: "Tables, primary keys, foreign keys, normalization (1NF-3NF), and constraints.",
      summaryRu: "Таблицы, первичные и внешние ключи, нормализация данных (1NF-3NF).",
      summaryUz: "Jadvallar, primary/foreign keylar va ma'lumotlar normallashuvi.",
      contentEn: `### Relational Databases & PostgreSQL
Design scalable tables with strong foreign key integrity and constraints.`,
      contentRu: `### Реляционные Базы Данных и PostgreSQL
Проектируйте таблицы с внешними ключами и ограничениями целостности данных.`,
      contentUz: `### Relyatsion ma'lumotlar bazasi asoslari`,
      codeSnippet: `const query = "CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE);";\nconsole.log("Table schema validated.");`,
      expectedOutput: `Table schema validated.`,
      xpReward: 60,
      quizData: {
        question: "What ensures referential integrity between two relational tables?",
        options: ["Index", "Foreign Key Constraint", "View", "Trigger"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[6].id,
      orderIndex: 2,
      titleEn: "Advanced SQL Queries, Joins & Aggregations",
      titleRu: "Сложные SQL Запросы, JOINs и Агрегация",
      titleUz: "Murakkab SQL So'rovlar, JOINlar va Agregatsiya",
      summaryEn: "INNER, LEFT, FULL JOINs, GROUP BY, HAVING, and Window Functions.",
      summaryRu: "Различные типы JOIN, группировки GROUP BY, оконные функции и фильтрация.",
      summaryUz: "JOINlar, GROUP BY va SQL tahliliy so'rovlari.",
      contentEn: `### Complex SQL Queries
Retrieve and aggregate data across multiple tables with high efficiency.`,
      contentRu: `### Сложные SQL Запросы
Эффективно объединяйте таблицы и вычисляйте рейтинги студентов.`,
      contentUz: `### SQL so'rovlar va agregatsiya`,
      codeSnippet: `console.log("SQL Join Query executed: 7 records merged with 0.4ms latency");`,
      expectedOutput: `SQL Join Query executed: 7 records merged with 0.4ms latency`,
      xpReward: 70,
      quizData: {
        question: "Which JOIN returns all rows from the left table even if there is no match in the right table?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[6].id,
      orderIndex: 3,
      titleEn: "Indexes, B-Trees & Query Optimization",
      titleRu: "Индексы, B-Деревья и Оптимизация Запросов",
      titleUz: "Indekslar, B-Tree va So'rovlarni Optimallashtirish",
      summaryEn: "B-Tree indexes, EXPLAIN ANALYZE, query planning, and avoiding full table scans.",
      summaryRu: "B-Tree индексы, анализ планов запросов EXPLAIN ANALYZE и оптимизация.",
      summaryUz: "Indekslar va so'rovlarni tezlashtirish.",
      contentEn: `### Indexing & Performance
Speed up search queries from O(N) linear scans to O(log N) logarithmic index lookups.`,
      contentRu: `### Индексация и Производительность
Ускоряйте поиск по миллионам записей с помощью B-Tree индексов.`,
      contentUz: `### Indekslar va yuqori tezlik`,
      codeSnippet: `console.log("Index scan duration: 0.12ms (Seq Scan replaced)");`,
      expectedOutput: `Index scan duration: 0.12ms (Seq Scan replaced)`,
      xpReward: 80,
      quizData: {
        question: "What SQL command shows the execution plan of a query in PostgreSQL?",
        options: ["SHOW PLAN", "EXPLAIN ANALYZE", "DESCRIBE QUERY", "PROFILE"],
        correctIndex: 1,
      },
    },
    {
      courseId: createdCourses[6].id,
      orderIndex: 4,
      titleEn: "ACID Transactions & Concurrency Control",
      titleRu: "ACID Транзакции и Управление Конкурентностью",
      titleUz: "ACID Tranzaksiyalari va Blokirovkalar",
      summaryEn: "Atomicity, Consistency, Isolation, Durability, MVCC, and pessimistic locking.",
      summaryRu: "Атомарность, согласованность, изоляция, долговечность и транзакции.",
      summaryUz: "ACID tranzaksiyalari va xavfsiz ma'lumotlar saqlash.",
      contentEn: `### ACID Transactions
Ensure financial and academic balance transfers remain 100% consistent under heavy concurrent load.`,
      contentRu: `### ACID Транзакции
Гарантируйте целостность начисления баллов и опыта при любых сбоях.`,
      contentUz: `### ACID tranzaksiyalari`,
      codeSnippet: `console.log("COMMIT TRANSACTION: 100% Data Consistency Guaranteed");`,
      expectedOutput: `COMMIT TRANSACTION: 100% Data Consistency Guaranteed`,
      xpReward: 90,
      quizData: {
        question: "What does the 'A' in ACID stand for?",
        options: ["Availability", "Atomicity", "Accuracy", "Asynchronous"],
        correctIndex: 1,
      },
    },
  ];

  const createdLessons = await db.insert(lessons).values(lessonsData).returning();

  // 4. Enroll main user in courses
  await db.insert(userCourses).values([
    {
      userId: mainUser.id,
      courseId: createdCourses[0].id, // Python
      progress: 50,
      isStarted: true,
      isCompleted: false,
      currentLessonId: createdLessons[1].id,
    },
    {
      userId: mainUser.id,
      courseId: createdCourses[1].id, // Web dev
      progress: 25,
      isStarted: true,
      isCompleted: false,
      currentLessonId: createdLessons[4].id,
    },
  ]);

  // Mark first lesson of python as completed for main user
  await db.insert(userLessons).values([
    {
      userId: mainUser.id,
      lessonId: createdLessons[0].id,
      isCompleted: true,
      submittedCode: `def calculate_academy_rank(xp):\n    if xp > 2000:\n        return "Cyber Master"\n    elif xp > 1000:\n        return "Senior Cadet"\n    return "Novice Developer"\n\nprint(calculate_academy_rank(1250))`,
      completedAt: new Date(),
    },
  ]);

  // 5. Create Achievements
  const achievementsData = [
    {
      code: "first_code",
      titleEn: "First Code Executed",
      titleRu: "Первая строчка кода",
      titleUz: "Birinchi kod",
      descEn: "Run and pass your first lesson in ASAD IT ACADEMY.",
      descRu: "Успешно выполните свой первый интерактивный урок в Академии.",
      descUz: "Akademiyada birinchi interaktiv darsni muvaffaqiyatli yakunlang.",
      icon: "Code2",
      xpReward: 100,
      category: "Learning",
      targetValue: 1,
    },
    {
      code: "streak_3",
      titleEn: "Cyber Streak (3 Days)",
      titleRu: "Кибер Ударник (3 Дня)",
      titleUz: "Ketma-ketlik (3 Kun)",
      descEn: "Maintain learning streak for 3 consecutive days.",
      descRu: "Занимайтесь программированием 3 дня подряд.",
      descUz: "Ketma-ket 3 kun davomida darslarni davom ettiring.",
      icon: "Flame",
      xpReward: 150,
      category: "Dedication",
      targetValue: 3,
    },
    {
      code: "lab_explorer",
      titleEn: "Lab Explorer",
      titleRu: "Исследователь Лабораторий",
      titleUz: "Laboratoriyalar Kashfiyotchisi",
      descEn: "Enter all 7 3D virtual academy labs.",
      descRu: "Посетите все 7 интерактивных 3D-лабораторий Академии.",
      descUz: "Akademiyaning barcha 7 ta 3D laboratoriyalariga tashrif buyuring.",
      icon: "Compass",
      xpReward: 200,
      category: "Exploration",
      targetValue: 7,
    },
    {
      code: "project_creator",
      titleEn: "Architect of Tomorrow",
      titleRu: "Архитектор Будущего",
      titleUz: "Kelajak Arxitektori",
      descEn: "Create and publish a project in MY PROJECTS showcase.",
      descRu: "Создайте и опубликуйте собственный проект в витрине Академии.",
      descUz: "O'z loyihangizni yarating va e'lon qiling.",
      icon: "FolderGit2",
      xpReward: 250,
      category: "Projects",
      targetValue: 1,
    },
    {
      code: "ai_whisperer",
      titleEn: "AI Whisperer",
      titleRu: "Повелитель ИИ",
      titleUz: "Sun'iy Intellekt Ustasi",
      descEn: "Chat with ASAD AI Assistant and solve a coding challenge.",
      descRu: "Задайте вопрос и решите задачу с помощью ASAD AI Ассистента.",
      descUz: "ASAD AI yordamchisidan foydalanib masalani yeching.",
      icon: "Bot",
      xpReward: 120,
      category: "AI",
      targetValue: 1,
    },
    {
      code: "master_rank",
      titleEn: "Elite Cyber Cadet",
      titleRu: "Элитный Кибер-Кадет",
      titleUz: "Elita Cyber Cadet",
      descEn: "Reach Level 5 and collect over 1500 XP.",
      descRu: "Достигните 5-го уровня и наберите свыше 1500 XP.",
      descUz: "5-darajaga yeting va 1500 dan ortiq XP to'plang.",
      icon: "Trophy",
      xpReward: 300,
      category: "Rank",
      targetValue: 1500,
    },
  ];

  const createdAchievements = await db.insert(achievements).values(achievementsData).returning();

  // Unlock first achievement for main user
  await db.insert(userAchievements).values([
    {
      userId: mainUser.id,
      achievementId: createdAchievements[0].id,
      progress: 1,
      isUnlocked: true,
      isClaimed: true,
      unlockedAt: new Date(),
    },
    {
      userId: mainUser.id,
      achievementId: createdAchievements[1].id,
      progress: 3,
      isUnlocked: true,
      isClaimed: false,
      unlockedAt: new Date(),
    },
  ]);

  // 6. Sample Projects
  await db.insert(projects).values([
    {
      userId: mainUser.id,
      title: "CyberPulse 3D Campus Dashboard",
      category: "Fullstack Web",
      description: "Interactive real-time 3D dashboard for university students built with Next.js, Three.js, and PostgreSQL.",
      tags: "Next.js, Three.js, Tailwind, Drizzle",
      demoUrl: "https://asad-academy.uz/demo/cyberpulse",
      repoUrl: "https://github.com/asadbek/cyberpulse-3d",
      likesCount: 28,
    },
    {
      userId: mainUser.id,
      title: "ASAD Neural Code Assistant",
      category: "Artificial Intelligence",
      description: "Intelligent code reviewer and tutor bot that explains algorithmic time complexity and refactoring tips.",
      tags: "AI, Python, FastAPI, Transformers",
      demoUrl: "https://asad-academy.uz/demo/ai-assistant",
      repoUrl: "https://github.com/asadbek/neural-assistant",
      likesCount: 42,
    },
  ]);

  console.log("Database seeded successfully with all ASAD IT ACADEMY courses, lessons, and achievements!");
}
