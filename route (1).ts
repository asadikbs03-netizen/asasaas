import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, achievements, userAchievements } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, language = "RU" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const [user] = await db.select().from(users).limit(1);

    // Unlock AI whisperer achievement if not yet unlocked
    if (user) {
      const [aiAch] = await db.select().from(achievements).where(eq(achievements.code, "ai_whisperer")).limit(1);
      if (aiAch) {
        const [existing] = await db.select().from(userAchievements).where(and(eq(userAchievements.userId, user.id), eq(userAchievements.achievementId, aiAch.id))).limit(1);
        if (!existing) {
          await db.insert(userAchievements).values({
            userId: user.id,
            achievementId: aiAch.id,
            progress: 1,
            isUnlocked: true,
            isClaimed: false,
            unlockedAt: new Date(),
          });
        }
      }
    }

    // Generate high-quality intelligent response based on topic and language
    const lower = message.toLowerCase();
    let responseText = "";

    if (language === "RU") {
      if (lower.includes("raycast") || lower.includes("three") || lower.includes("3d") || lower.includes("график")) {
        responseText = `### 🎮 3D Raycasting в Three.js и WebGL

**Raycasting (Трассировка лучей)** используется для определения пересечения луча из координат камеры с 3D-объектами в виртуальном пространстве.

#### Пример реализации:
\`\`\`javascript
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onPointerDown(event) {
  // Нормализуем координаты клика от -1 до +1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Обновляем луч от камеры
  raycaster.setFromCamera(mouse, camera);

  // Находим пересечения с лабораториями Академии
  const intersects = raycaster.intersectObjects(academyLabsGroup.children, true);
  if (intersects.length > 0) {
    const clickedLab = intersects[0].object.userData;
    console.log("Войти в лабораторию:", clickedLab.name);
  }
}
\`\`\`

💡 *Рекомендую пройти курс **Game Development Lab: 3D Graphics & Physics** в Академии для глубокого освоения!*`;
      } else if (lower.includes("индекс") || lower.includes("sql") || lower.includes("postgres") || lower.includes("баз")) {
        responseText = `### ⚡ Оптимизация SQL и Индексы в PostgreSQL

Для ускорения запросов в высоконагруженных системах используйте **B-Tree индексы** и анализ планов:

1. **Создание составного индекса:**
\`\`\`sql
-- Индекс по пользователю и статусу завершения урока
CREATE INDEX idx_user_lessons_lookup 
ON user_lessons (user_id, is_completed) 
INCLUDE (completed_at);
\`\`\`

2. **Проверка плана выполнения:**
\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM courses 
WHERE category = 'Fullstack Web' 
ORDER BY xp_reward DESC;
\`\`\`

💡 *Пройдите курс **Database Lab: PostgreSQL & High-Load** в нашей 3D лаборатории!*`;
      } else if (lower.includes("xss") || lower.includes("защит") || lower.includes("безопасн") || lower.includes("cyber") || lower.includes("хакинг")) {
        responseText = `### 🛡️ Защита веб-приложений от XSS и SQL-инъекций

1. **SQL-инъекции:** Всегда используйте параметризованные запросы или Drizzle ORM вместо склейки строк.
2. **XSS (Межсайтовый скриптинг):**
   - React экранирует данные по умолчанию в \`{variable}\`.
   - Не используйте \`dangerouslySetInnerHTML\` без санитизации (DOMPurify).
   - Установите HTTP-заголовки безопасности: \`Content-Security-Policy\`, \`X-Frame-Options: DENY\`.
3. **Хеширование паролей:** Используйте **Argon2id** или **bcrypt** с солью.

💡 *Изучите подробнее в курсе **Cybersecurity Lab: Ethical Hacking**!*`;
      } else if (lower.includes("list comprehension") || lower.includes("python") || lower.includes("списк")) {
        responseText = `### 🐍 Генераторы списков (List Comprehension) в Python

Генераторы списков позволяют фильтровать и трансформировать коллекции в одну элегантную строку:

\`\`\`python
# Фильтрация лучших студентов Академии с XP > 1000
students = [
    {"name": "Asadbek", "xp": 1250},
    {"name": "Rustam", "xp": 2450},
    {"name": "Novice", "xp": 200},
]

top_cadets = [s["name"].upper() for s in students if s["xp"] >= 1000]
print(top_cadets) # ['ASADBEK', 'RUSTAM']
\`\`\`

💡 *Полный интерактивный трек доступен в **Python Lab: Core & Algorithms**!*`;
      } else if (lower.includes("server component") || lower.includes("next") || lower.includes("react")) {
        responseText = `### ⚛️ React Server Components (RSC) в Next.js 15

- **По умолчанию** все компоненты в \`app/\` являются серверными. Они не загружаются в JS-бандл браузера.
- Если вам нужен интерактивный клик, хуки (\`useState\`, \`useEffect\`) или анимации — добавьте директиву \`'use client'\` в первой строке файла.
- Серверные компоненты могут напрямую обращаться к базе данных:
\`\`\`tsx
// app/courses/page.tsx (Server Component)
import { db } from "@/db";
import { courses } from "@/db/schema";

export default async function CoursesPage() {
  const allCourses = await db.select().from(courses);
  return <CoursesList items={allCourses} />;
}
\`\`\`

💡 *Откройте курс **Web Development Lab: Next.js & React** для практики!*`;
      } else {
        responseText = `### 🚀 Ответ ASAD AI Ассистента

По вашему вопросу: **"${message}"**

В ASAD IT ACADEMY мы обучаем передовым практикам разработки:
1. **Чистая архитектура** — разделение логики, валидация данных и модульность.
2. **Типобезопасность** — TypeScript и Drizzle ORM защищают от ошибок на этапе компиляции.
3. **Интерактивная практика** — проверяйте код прямо в уроках и получайте XP!

💡 *Вы можете выбрать любую из 7 лабораторий в меню **Курсы** или подойти к ней в **3D Кампусе**!*`;
      }
    } else if (language === "UZ") {
      if (lower.includes("three") || lower.includes("3d") || lower.includes("raycast")) {
        responseText = `### 🎮 Three.js va 3D Raycasting asoslari

**Raycasting** — bu kamera koordinatalaridan 3D olamdagi obyektlarga nur yo'naltirish va foydalanuvchi bosgan obyektni aniqlash texnologiyasi.

\`\`\`javascript
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects(labsGroup.children);
if (intersects.length > 0) {
  console.log("Laboratoriyaga kirish:", intersects[0].object.name);
}
\`\`\`

💡 *Akademiyadagi **Game Development Lab** kursida to'liq o'rganing!*`;
      } else if (lower.includes("sql") || lower.includes("postgres") || lower.includes("baza")) {
        responseText = `### ⚡ PostgreSQL da so'rovlarni optimallashtirish

Indekslar yordamida millionlab yozuvlar ichidan qidiruv tezligini bir necha millisekundga tushirish mumkin:

\`\`\`sql
CREATE INDEX idx_cadets_xp ON users(xp DESC);
EXPLAIN ANALYZE SELECT * FROM users WHERE xp > 1000;
\`\`\`

💡 *Tafsilotlar **Database Lab: PostgreSQL** kursida mavjud!*`;
      } else {
        responseText = `### 🚀 ASAD AI Maslahati

Sizning savolingiz: **"${message}"**

ASAD IT ACADEMY dasturlash, sun'iy intellekt, 3D modellashtirish va xavfsizlik bo'yicha eng kuchli bilimlarni beradi. 

💡 *Bilimingizni oshirish uchun kerakli kursni tanlang yoki 3D Kampus laboratoriyalariga kiring!*`;
      }
    } else {
      // English default
      if (lower.includes("raycast") || lower.includes("three") || lower.includes("3d")) {
        responseText = `### 🎮 3D Raycasting in Three.js

Raycasting projects a ray from screen mouse coordinates into the 3D scene to detect object intersections:

\`\`\`typescript
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouseVector, camera);
const hits = raycaster.intersectObjects(scene.children);
if (hits.length > 0) {
  console.log("Target Lab:", hits[0].object.name);
}
\`\`\`

💡 *Check out the **Game Dev Lab** in our 3D Campus for hands-on exercises!*`;
      } else if (lower.includes("sql") || lower.includes("postgres") || lower.includes("index")) {
        responseText = `### ⚡ SQL Optimization & B-Tree Indexes

Speed up queries from linear O(N) table scans to logarithmic O(log N) lookups:

\`\`\`sql
CREATE INDEX idx_user_xp ON users (xp DESC);
EXPLAIN ANALYZE SELECT * FROM users WHERE xp >= 1000;
\`\`\`

💡 *Dive deeper in the **Database Lab: PostgreSQL** course!*`;
      } else {
        responseText = `### 🚀 ASAD AI Tutor Advice

Regarding your inquiry: **"${message}"**

In ASAD IT ACADEMY, you can practice real-world engineering across our 7 specialized cyber laboratories:
- 🐍 **Python Lab** (Algorithms & Backend)
- 🌐 **Web Dev Lab** (Next.js 15 & React 19)
- 🧠 **AI Lab** (LLMs & Transformers)
- 🛡️ **Cybersecurity Lab** (Ethical Hacking)
- 🎮 **Game Dev Lab** (Three.js & Graphics)
- 🎨 **UI/UX Studio** (Design Systems)
- 🗄️ **Database Lab** (PostgreSQL High-Load)

💡 *Click **Start Course** or enter any Lab in the 3D Campus to begin!*`;
      }
    }

    return NextResponse.json({
      reply: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json({ error: "AI service temporarily unavailable" }, { status: 500 });
  }
}
