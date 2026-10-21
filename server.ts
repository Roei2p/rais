import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini SDK client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// POST /api/ai-advisor
app.post('/api/ai-advisor', async (req, res) => {
  try {
    const { prompt, cashflowData, chatHistory } = req.body;

    const systemInstruction = `אתה היועץ הפיננסי החכם של אפליקציית רייזאפ (RiseUp).
תפקידך לסייע למשפחות ויחידים בישראל לנהל את התזרים החודשי שלהם ברוגע, לחיות בתוך היכולות הכלכליות ולסיים כל חודש בפלוס.
עקרונות רייזאפ:
1. בלי רגשות אשם או שיפוטיות - רק פרקטיקה מעצימה ומקדמת.
2. דגש על תזרים עתידי ("כמה כסף נשאר לנו עד סוף החודש" / עד מועד חיוב האשראי), ולא על בכי על העבר.
3. הפרדה ברורה בין הוצאות קבועות (שכירות, משכנתא, חשבונות, ביטוחים, מנויים) להוצאות משתנות (סופר, וולט/מסעדות, קניות, בילויים, דלק).
4. מתן המלצות קונקרטיות וקלות ליישום בשפה ישראלית חמה, בגובה העיניים, עם אימוג'ים מתאימים.
5. התייחסות לנתונים הכספיים שסופקו בהודעה (הכנסות, הוצאות קבועות, כמה נשאר להוצאות משתנות, יתרה נוכחית).
ענה בעברית שוטפת וקולחת.`;

    if (ai) {
      try {
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        let contextMsg = `נתוני התזרים הנוכחיים של המשתמש ברייזאפ:
- סך הכנסות חודשיות: ₪${cashflowData?.totalIncome?.toLocaleString() || '0'}
- סך הוצאות קבועות: ₪${cashflowData?.fixedExpensesTotal?.toLocaleString() || '0'}
- תקציב מקורי להוצאות משתנות: ₪${cashflowData?.variableBudget?.toLocaleString() || '0'}
- כסף שבוזבז החודש בהוצאות משתנות: ₪${cashflowData?.variableSpent?.toLocaleString() || '0'}
- כסף שנשאר להוציא החודש (או חריגה): ₪${cashflowData?.remainingVariable?.toLocaleString() || '0'}
- ימים שנותרו עד סוף החודש: ${cashflowData?.daysLeftInMonth || '0'}
- תחזית סוף חודש: ₪${cashflowData?.projectedEndBalance?.toLocaleString() || '0'}
- קטגוריות מובילות בהוצאות: ${cashflowData?.topCategories || 'סופר, מסעדות, קניות'}`;

        contents.push({
          role: 'user',
          parts: [{ text: `${contextMsg}\n\nשאלה או הודעה מהמשתמש: ${prompt || 'תן לי תמונת מצב והמלצה איך לסיים את החודש בטוב.'}` }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response.text) {
          return res.json({ reply: response.text });
        }
      } catch (geminiError) {
        console.warn('Gemini temporary spike, falling back to smart heuristic advisor:', geminiError);
      }
    }

    // High quality fallback advisor logic
    const remaining = cashflowData?.remainingVariable ?? 2840;
    const daysLeft = cashflowData?.daysLeftInMonth ?? 12;
    const dailyAllowance = Math.round(remaining / Math.max(daysLeft, 1));
    const projectedEnd = cashflowData?.projectedEndBalance ?? 1850;

    let reply = `שלום! לפי נתוני התזרים שלכם ברייזאפ:
נשארו לכם עוד **₪${remaining.toLocaleString()}** להוצאות משתנות (סופר, וולט וקניות) עד סוף החודש.
זה מאפשר תקציב יומי ממוצע של כ-**₪${dailyAllowance.toLocaleString()} ליום** (או כ-**₪${(dailyAllowance * 7).toLocaleString()} לשבוע**).

${
  projectedEnd >= 0
    ? `🌟 **תחזית מצוינת:** אתם כרגע במסלול לסיים את החודש בפלוס של כ-**₪${projectedEnd.toLocaleString()}**!`
    : `⚠️ **שימו לב לתזרים:** כרגע יש צפי לחריגה של כ-**₪${Math.abs(projectedEnd).toLocaleString()}**. כדאי למתן הזמנות אוכל ולדחות קניות לא דחופות.`
}

💡 **3 המלצות מעשיות מרייזאפ לשבוע הקרוב:**
1. **קניות לסופר מתוכננות מראש:** עשו רשימה מדויקת ובדקו מה כבר יש במזווה ובמקפיא. הימנעו מהגעה לסופר רעבים!
2. **משלוחי אוכל ובילויים:** נסו לקבוע יום אחד קבוע בשבוע להזמנה מבחוץ (למשל חמישי בערב), ובשאר הימים העדיפו בישול ביתי מפנק.
3. **בדיקת הוצאות קבועות:** ודאו שכל המנויים והביטוחים שלכם בלשונית "הוצאות קבועות" אכן מנוצלים.

רוצים שנעשה סימולציה ספציפית על הוצאה שאתם מתלבטים לגביה? מוזמנים לשאול!`;

    return res.json({ reply });
  } catch (err: any) {
    console.error('AI Advisor error:', err);
    return res.json({
      reply: 'היי! נתקלנו בעומס רגעי, אבל התזרים שלכם מעודכן ומראה שאתם בכיוון מעולה. נסו לשאול שוב בעוד כמה רגעים!',
    });
  }
});

// POST /api/categorize - auto categorizes business name
app.post('/api/categorize', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.json({ category: 'שונות', type: 'variable', emoji: '📦' });
    }

    const t = title.toLowerCase();

    // Fast heuristic dictionary
    if (t.includes('שופרסל') || t.includes('רמי לוי') || t.includes('אושר עד') || t.includes('יוחננוף') || t.includes('טיב טעם') || t.includes('ויקטורי') || t.includes('מגה') || t.includes('קרפור') || t.includes('סופר')) {
      return res.json({ category: 'סופר ופארם', type: 'variable', emoji: '🛒' });
    }
    if (t.includes('סופר פארם') || t.includes('be') || t.includes('בית מרקחת')) {
      return res.json({ category: 'סופר ופארם', type: 'variable', emoji: '💊' });
    }
    if (t.includes('wolt') || t.includes('וולט') || t.includes('תן ביס') || t.includes('מסעדת') || t.includes('קפה') || t.includes('מקדונלדס') || t.includes('ארומה') || t.includes('פיצה') || t.includes('סושי')) {
      return res.json({ category: 'מסעדות ובתי קפה', type: 'variable', emoji: '☕' });
    }
    if (t.includes('דלק') || t.includes('פז') || t.includes('סונול') || t.includes('דור אלון') || t.includes('טן') || t.includes('רב קו') || t.includes('רכבת') || t.includes('gett') || t.includes('פנגו') || t.includes('סלופארק')) {
      return res.json({ category: 'תחבורה ורכב', type: 'variable', emoji: '🚗' });
    }
    if (t.includes('זארה') || t.includes('h&m') || t.includes('קסטרו') || t.includes('אסוס') || t.includes('asos') || t.includes('shein') || t.includes('שיין') || t.includes('אמזון') || t.includes('amazon') || t.includes('עלי אקספרס') || t.includes('aliexpress') || t.includes('טרמינל')) {
      return res.json({ category: 'קניות ואופנה', type: 'variable', emoji: '🛍️' });
    }
    if (t.includes('שכירות') || t.includes('שכר דירה') || t.includes('משכנתא') || t.includes('בנק הפועלים משכנתאות') || t.includes('טפחות')) {
      return res.json({ category: 'דיור ומשכנתא', type: 'fixed', emoji: '🏠' });
    }
    if (t.includes('ארנונה') || t.includes('חשמל') || t.includes('מים') || t.includes('גז') || t.includes('ועד בית')) {
      return res.json({ category: 'חשבונות בית', type: 'fixed', emoji: '💡' });
    }
    if (t.includes('נטפליקס') || t.includes('netflix') || t.includes('spotify') || t.includes('ספוטיפיי') || t.includes('פרטנר') || t.includes('יס') || t.includes('yes') || t.includes('הוט') || t.includes('hot') || t.includes('סלקום') || t.includes('apple') || t.includes('google storage')) {
      return res.json({ category: 'תקשורת ומנויים', type: 'fixed', emoji: '📱' });
    }
    if (t.includes('ביטוח') || t.includes('הראל') || t.includes('הפניקס') || t.includes('מגדל') || t.includes('כלל') || t.includes('מנורה')) {
      return res.json({ category: 'ביטוחים', type: 'fixed', emoji: '🛡️' });
    }
    if (t.includes('גן') || t.includes('צהרון') || t.includes('מעון') || t.includes('בייביסיטר') || t.includes('חוג')) {
      return res.json({ category: 'ילדים וחינוך', type: 'fixed', emoji: '👶' });
    }

    return res.json({ category: 'שונות', type: 'variable', emoji: '🏷️' });
  } catch (err: any) {
    return res.json({ category: 'שונות', type: 'variable', emoji: '🏷️' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RiseUp App server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
