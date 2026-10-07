// server.ts
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

// src/data/quizData.ts
var QUIZ_DURATION_MINUTES = 5;
var QUESTIONS = [
  {
    id: 1,
    question: "Khi Khoa ch\u1EE5p l\u1EA1i b\u1EE9c \u1EA3nh ru\u1ED9ng b\u1EADc thang v\xE0 g\u1EEDi cho An qua th\u01B0 \u0111i\u1EC7n t\u1EED, \u0111\u1EB7c \u0111i\u1EC3m n\xE0o c\u1EE7a th\xF4ng tin s\u1ED1 \u0111\u01B0\u1EE3c th\u1EC3 hi\u1EC7n r\xF5 nh\u1EA5t?",
    options: [
      { key: "A", text: "B\u1EE9c \u1EA3nh g\u1ED1c c\u1EE7a Khoa s\u1EBD t\u1EF1 \u0111\u1ED9ng m\u1EA5t \u0111i sau khi g\u1EEDi cho An." },
      { key: "B", text: "Th\xF4ng tin s\u1ED1 d\u1EC5 d\xE0ng \u0111\u01B0\u1EE3c nh\xE2n b\u1EA3n v\xE0 chia s\u1EBB m\xE0 ng\u01B0\u1EDDi g\u1EEDi kh\xF4ng b\u1ECB m\u1EA5t \u0111i b\u1EE9c \u1EA3nh g\u1ED1c." },
      { key: "C", text: "Th\xF4ng tin s\u1ED1 ch\u1EC9 c\xF3 th\u1EC3 l\u01B0u tr\u1EEF tr\xEAn m\u1ED9t thi\u1EBFt b\u1ECB duy nh\u1EA5t." },
      { key: "D", text: "Th\xF4ng tin s\u1ED1 kh\xF4ng th\u1EC3 g\u1EEDi \u0111i xa n\u1EBFu kh\xF4ng g\u1EB7p tr\u1EF1c ti\u1EBFp ng\u01B0\u1EDDi nh\u1EADn." }
    ],
    correctAnswer: "B",
    explanation: "V\xEC sao B \u0111\xFAng: B\u1EE9c \u1EA3nh s\u1ED1 \u0111\u01B0\u1EE3c t\u1EA1o ra kh\xF4ng t\u1ED1n v\u1EADt li\u1EC7u v\xE0 khi Khoa g\u1EEDi cho An, Khoa kh\xF4ng b\u1ECB m\u1EA5t \u0111i b\u1EE9c \u1EA3nh g\u1ED1c. Th\xF4ng tin s\u1ED1 c\xF3 \u0111\u1EB7c \u0111i\u1EC3m n\u1ED5i b\u1EADt l\xE0 d\u1EC5 d\xE0ng \u0111\u01B0\u1EE3c nh\xE2n b\u1EA3n, sao ch\xE9p v\xE0 chia s\u1EBB qua m\xF4i tr\u01B0\u1EDDng k\u1EF9 thu\u1EADt s\u1ED1."
  },
  {
    id: 2,
    question: "V\xEC sao ng\u01B0\u1EDDi s\u1EED d\u1EE5ng Internet c\u1EA7n ph\u1EA3i c\u1EA9n tr\u1ECDng v\xE0 c\xF3 tr\xE1ch nhi\u1EC7m khi chia s\u1EBB hay \u0111\u0103ng t\u1EA3i th\xF4ng tin l\xEAn m\xF4i tr\u01B0\u1EDDng m\u1EA1ng?",
    options: [
      { key: "A", text: "V\xEC th\xF4ng tin s\u1ED1 m\u1ED9t khi \u0111\xE3 \u0111\u0103ng t\u1EA3i th\xEC d\u1EC5 d\xE0ng b\u1ECB lan truy\u1EC1n v\xE0 r\u1EA5t kh\xF3 b\u1ECB x\xF3a b\u1ECF ho\xE0n to\xE0n." },
      { key: "B", text: "V\xEC dung l\u01B0\u1EE3ng l\u01B0u tr\u1EEF c\u1EE7a m\xE1y ch\u1EE7 Internet s\u1EBD b\u1ECB qu\xE1 t\u1EA3i ngay l\u1EADp t\u1EE9c." },
      { key: "C", text: "V\xEC m\u1ECDi th\xF4ng tin s\u1ED1 s\u1EBD t\u1EF1 \u0111\u1ED9ng b\u1ECB thay \u0111\u1ED5i n\u1ED9i dung sau v\xE0i gi\u1EDD." },
      { key: "D", text: "V\xEC c\xE1c t\u1EC7p th\xF4ng tin s\u1ED1 ch\u1EC9 t\u1ED3n t\u1EA1i \u0111\u01B0\u1EE3c trong m\u1ED9t ng\xE0y r\u1ED3i t\u1EF1 bi\u1EBFn m\u1EA5t." }
    ],
    correctAnswer: "A",
    explanation: "V\xEC sao A \u0111\xFAng: Th\xF4ng tin s\u1ED1 khi \u0111\u01B0\u1EE3c chia s\u1EBB l\xEAn m\u1EA1ng x\xE3 h\u1ED9i hay \u1EE9ng d\u1EE5ng nh\u1EAFn tin s\u1EBD \u0111\u01B0\u1EE3c l\u01B0u tr\u1EEF, \u0111\u1ED3ng b\u1ED9 v\xE0 ti\u1EBFp t\u1EE5c lan truy\u1EC1n nhanh ch\xF3ng \u0111\u1EBFn nhi\u1EC1u ng\u01B0\u1EDDi, khi\u1EBFn th\xF4ng tin \u0111\xF3 r\u1EA5t kh\xF3 b\u1ECB x\xF3a b\u1ECF ho\xE0n to\xE0n. Do \u0111\xF3, ng\u01B0\u1EDDi d\xF9ng c\u1EA7n qu\u1EA3n l\xFD, khai th\xE1c an to\xE0n v\xE0 c\xF3 tr\xE1ch nhi\u1EC7m."
  },
  {
    id: 3,
    question: '\u0110\u1EC3 ki\u1EC3m tra t\xEDnh \u0111\xE1ng tin c\u1EADy c\u1EE7a m\u1ED9t b\xE0i vi\u1EBFt tr\xEAn m\u1EA1ng, ti\xEAu ch\xED \u0111\xE1nh gi\xE1 "T\xEDnh th\u1EDDi s\u1EF1 c\u1EE7a th\xF4ng tin" y\xEAu c\u1EA7u ng\u01B0\u1EDDi \u0111\u1ECDc th\u1EF1c hi\u1EC7n \u0111i\u1EC1u g\xEC?',
    options: [
      { key: "A", text: "\u0110\u1EBFm s\u1ED1 l\u01B0\u1EE3t y\xEAu th\xEDch (like) v\xE0 l\u01B0\u1EE3t chia s\u1EBB (share) c\u1EE7a b\xE0i vi\u1EBFt." },
      { key: "B", text: "Xem x\xE9t th\u1EDDi \u0111i\u1EC3m c\xF4ng b\u1ED1 ho\u1EB7c l\u1EA7n c\u1EADp nh\u1EADt g\u1EA7n nh\u1EA5t c\u1EE7a th\xF4ng tin." },
      { key: "C", text: "Ki\u1EC3m tra xem b\xE0i vi\u1EBFt c\xF3 s\u1EED d\u1EE5ng nhi\u1EC1u h\xECnh \u1EA3nh minh h\u1ECDa hay kh\xF4ng." },
      { key: "D", text: "\u0110\xE1nh gi\xE1 xem giao di\u1EC7n trang web c\xF3 m\xE0u s\u1EAFc b\u1EAFt m\u1EAFt hay kh\xF4ng." }
    ],
    correctAnswer: "B",
    explanation: "V\xEC sao B \u0111\xFAng: Th\u1EDDi \u0111i\u1EC3m c\xF4ng b\u1ED1 th\xF4ng tin r\u1EA5t quan tr\u1ECDng v\xEC n\xF3 quy\u1EBFt \u0111\u1ECBnh th\xF4ng tin \u0111\xF3 c\xF2n gi\xE1 tr\u1ECB hay \u0111\xE3 tr\u1EDF n\xEAn l\u1ED7i th\u1EDDi. Nh\u1EEFng n\u1ED9i dung tr\xEAn trang web \u0111\xE3 l\xE2u kh\xF4ng \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt th\u01B0\u1EDDng c\xF3 \u0111\u1ED9 tin c\u1EADy th\u1EA5p."
  },
  {
    id: 4,
    question: "Trong c\xE1c ph\xE1t bi\u1EC3u sau \u0111\xE2y, ph\xE1t bi\u1EC3u n\xE0o ph\u1EA3n \xE1nh m\u1ED9t s\u1EF1 ki\u1EC7n/d\u1EEF ki\u1EC7n kh\xE1ch quan ch\u1EE9 kh\xF4ng ph\u1EA3i \xFD ki\u1EBFn ch\u1EE7 quan?",
    options: [
      { key: "A", text: '"M\xF4n Tin h\u1ECDc 8 l\xE0 m\xF4n h\u1ECDc hay nh\u1EA5t v\xE0 th\xFA v\u1ECB nh\u1EA5t."' },
      { key: "B", text: '"B\u1ED9 phim ho\u1EA1t h\xECnh n\xE0y r\u1EA5t \u0111\xE1ng xem \u0111\u1ED1i v\u1EDBi l\u1EE9a tu\u1ED5i h\u1ECDc sinh."' },
      { key: "C", text: '"N\u0103m 1642, Blaise Pascal \u0111\xE3 s\xE1ng ch\u1EBF ra chi\u1EBFc m\xE1y t\xEDnh c\u01A1 kh\xED Pascaline."' },
      { key: "D", text: '"T\xF4i tin r\u1EB1ng vi\u1EC7c h\u1ECDc tr\u1EF1c tuy\u1EBFn hi\u1EC7u qu\u1EA3 h\u01A1n h\u1ECDc tr\u1EF1c ti\u1EBFp."' }
    ],
    correctAnswer: "C",
    explanation: "V\xEC sao C \u0111\xFAng: Ph\xE1t bi\u1EC3u C tr\xECnh b\xE0y m\u1ED9t s\u1EF1 ki\u1EC7n l\u1ECBch s\u1EED c\u1EE5 th\u1EC3, c\xF3 m\u1ED1c th\u1EDDi gian v\xE0 b\u1EB1ng ch\u1EE9ng th\u1EF1c t\u1EBF ki\u1EC3m ch\u1EE9ng \u0111\u01B0\u1EE3c, n\xEAn \u0111\xF3 l\xE0 s\u1EF1 ki\u1EC7n kh\xE1ch quan."
  },
  {
    id: 5,
    passage: 'T\xECnh hu\u1ED1ng: H\u1ECDc sinh A th\u1EA5y m\u1ED9t b\xE0i qu\u1EA3ng c\xE1o tr\xEAn m\u1EA1ng x\xE3 h\u1ED9i kh\u1EB3ng \u0111\u1ECBnh: "U\u1ED1ng lo\u1EA1i tr\xE0 th\u1EA3o m\u1ED9c n\xE0y s\u1EBD gi\xFAp th\xF4ng minh h\u01A1n v\xE0 \u0111\u1EA1t \u0111i\u1EC3m t\u1ED1i \u0111a m\u1ECDi k\u1EF3 thi m\xE0 kh\xF4ng c\u1EA7n h\u1ECDc b\xE0i".',
    question: "C\xE1ch x\u1EED l\xFD n\xE0o sau \u0111\xE2y th\u1EC3 hi\u1EC7n k\u1EF9 n\u0103ng \u0111\xE1nh gi\xE1 th\xF4ng tin khoa h\u1ECDc v\xE0 chu\u1EA9n x\xE1c nh\u1EA5t?",
    options: [
      { key: "A", text: "Tin t\u01B0\u1EDFng ngay v\xEC b\xE0i vi\u1EBFt nh\u1EADn \u0111\u01B0\u1EE3c h\xE0ng ngh\xECn b\xECnh lu\u1EADn khen ng\u1EE3i t\u1EEB c\xE1c t\xE0i kho\u1EA3n tr\xEAn m\u1EA1ng." },
      { key: "B", text: "T\xECm ki\u1EBFm b\u1EB1ng ch\u1EE9ng khoa h\u1ECDc, \u0111\u1ED1i ch\u1EE9ng th\xF4ng tin t\u1EEB c\xE1c ngu\u1ED3n uy t\xEDn (nh\u01B0 B\u1ED9 Y t\u1EBF, chuy\xEAn gia) v\xE0 ph\xE2n bi\u1EC7t l\u1EDDi qu\u1EA3ng c\xE1o ph\xF3ng \u0111\u1EA1i v\u1EDBi th\u1EF1c t\u1EBF." },
      { key: "C", text: "Mua v\u1EC1 d\xF9ng th\u1EED ngay l\u1EADp t\u1EE9c v\xEC trang web thi\u1EBFt k\u1EBF r\u1EA5t \u0111\u1EB9p m\u1EAFt v\xE0 chuy\xEAn nghi\u1EC7p." },
      { key: "D", text: "V\u1ED9i v\xE0ng chia s\u1EBB ngay cho b\u1EA1n b\xE8 c\xF9ng l\u1EDBp v\xEC ngh\u0129 th\xF4ng tin n\xE0y c\xF3 l\u1EE3i." }
    ],
    correctAnswer: "B",
    explanation: "V\xEC sao B \u0111\xFAng: Ng\u01B0\u1EDDi b\xE1n h\xE0ng ho\u1EB7c s\u1EA3n xu\u1EA5t c\xF3 th\u1EC3 ph\xF3ng \u0111\u1EA1i l\u1EE3i \xEDch c\u1EE7a d\u1ECBch v\u1EE5 hay s\u1EA3n ph\u1EA9m. \u0110\u1EC3 x\xE1c \u0111\u1ECBnh th\xF4ng tin \u0111\xE1ng tin c\u1EADy, h\u1ECDc sinh c\u1EA7n ph\u1ED1i h\u1EE3p c\xE1c k\u1EF9 n\u0103ng: ki\u1EC3m tra th\u1EA9m quy\u1EC1n/uy t\xEDn c\u1EE7a ngu\u1ED3n c\u1EA5p, ki\u1EC3m tra ch\u1EE9ng c\u1EE9 c\u1EE7a k\u1EBFt lu\u1EADn v\xE0 ph\xE2n bi\u1EC7t gi\u1EEFa nh\u1EADn x\xE9t ch\u1EE7 quan v\u1EDBi s\u1EF1 th\u1EADt kh\xE1ch quan. Vi\u1EC7c n\xE0y gi\xFAp \u0111\u01B0a ra quy\u1EBFt \u0111\u1ECBnh \u0111\xFAng \u0111\u1EAFn v\xE0 tr\xE1nh l\xE3ng ph\xED hay r\u1EE7i ro."
  }
];
function getFeedbackMessage(correctCount) {
  if (correctCount === 5) {
    return "Em th\u1EADt xu\u1EA5t s\u1EAFc";
  } else if (correctCount >= 3) {
    return "Em n\u1EAFm v\u1EEFng ki\u1EBFn th\u1EE9c";
  } else if (correctCount >= 1) {
    return "Em c\u1EA7n xem l\u1EA1i n\u1ED9i dung b\xE0i h\u1ECDc";
  } else {
    return " Em c\u1EA7n c\u1ED1 g\u1EAFng nhi\u1EC1u h\u01A1n";
  }
}

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
var DATA_DIR = path.resolve(__dirname, "data");
var DATA_FILE = path.resolve(DATA_DIR, "submissions.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
}
function readSubmissions() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading submissions:", err);
    return [];
  }
}
function writeSubmissions(submissions) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing submissions:", err);
  }
}
app.use(express.json());
app.get("/api/quiz-info", (req, res) => {
  res.json({
    durationMinutes: QUIZ_DURATION_MINUTES,
    totalQuestions: QUESTIONS.length,
    questions: QUESTIONS.map((q) => ({
      id: q.id,
      passage: q.passage,
      question: q.question,
      options: q.options
    }))
  });
});
app.get("/api/check-device/:deviceId", (req, res) => {
  const { deviceId } = req.params;
  const submissions = readSubmissions();
  const existing = submissions.find((s) => s.deviceId === deviceId);
  if (existing) {
    return res.json({ submitted: true, submission: existing });
  }
  return res.json({ submitted: false });
});
app.post("/api/submit", (req, res) => {
  try {
    const { studentName, studentClass, answers, deviceId } = req.body;
    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ error: "Vui l\xF2ng nh\u1EADp h\u1ECD v\xE0 t\xEAn h\u1ECDc sinh!" });
    }
    if (!studentClass || !studentClass.trim()) {
      return res.status(400).json({ error: "Vui l\xF2ng nh\u1EADp l\u1EDBp h\u1ECDc!" });
    }
    if (!deviceId || !deviceId.trim()) {
      return res.status(400).json({ error: "Kh\xF4ng t\xECm th\u1EA5y th\xF4ng tin thi\u1EBFt b\u1ECB!" });
    }
    const submissions = readSubmissions();
    const alreadySubmitted = submissions.some((s) => s.deviceId === deviceId.trim());
    if (alreadySubmitted) {
      return res.status(400).json({
        error: "Thi\u1EBFt b\u1ECB n\xE0y \u0111\xE3 l\xE0m b\xE0i tr\u01B0\u1EDBc \u0111\xF3. M\u1ED7i thi\u1EBFt b\u1ECB ch\u1EC9 \u0111\u01B0\u1EE3c l\xE0m b\xE0i 1 l\u1EA7n duy nh\u1EA5t!"
      });
    }
    const studentAnswersRecord = {};
    let correctCount = 0;
    const results = QUESTIONS.map((q) => {
      const selected = (answers?.[q.id] || answers?.[String(q.id)] || "").toString().trim().toUpperCase();
      studentAnswersRecord[q.id] = selected;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) {
        correctCount += 1;
      }
      return {
        questionId: q.id,
        question: q.question,
        passage: q.passage,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });
    const scoreRaw = correctCount;
    const scoreScale10 = scoreRaw * 2;
    const feedback = getFeedbackMessage(correctCount);
    const now = /* @__PURE__ */ new Date();
    const submittedAtFormatted = now.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const newSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentName: studentName.trim(),
      studentClass: studentClass.trim(),
      answers: studentAnswersRecord,
      results,
      scoreRaw,
      scoreScale10,
      feedback,
      submittedAt: now.toISOString(),
      submittedAtFormatted,
      deviceId: deviceId.trim()
    };
    submissions.push(newSubmission);
    writeSubmissions(submissions);
    return res.status(200).json({
      success: true,
      submission: newSubmission
    });
  } catch (error) {
    console.error("Submit error:", error);
    return res.status(500).json({ error: "\u0110\xE3 x\u1EA3y ra l\u1ED7i khi l\u01B0u b\xE0i n\u1ED9p. Vui l\xF2ng th\u1EED l\u1EA1i!" });
  }
});
app.post("/api/teacher/auth", (req, res) => {
  const { password } = req.body;
  if (password === "12345678") {
    return res.json({ success: true, token: "gv_auth_token_session_secure" });
  }
  return res.status(401).json({ error: "M\u1EADt kh\u1EA9u gi\xE1o vi\xEAn kh\xF4ng ch\xEDnh x\xE1c!" });
});
function teacherAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer gv_auth_token_session_secure" || req.query.token === "gv_auth_token_session_secure") {
    return next();
  }
  return res.status(401).json({ error: "Y\xEAu c\u1EA7u quy\u1EC1n gi\xE1o vi\xEAn \u0111\u1EC3 truy c\u1EADp!" });
}
app.get("/api/teacher/data", teacherAuthMiddleware, (req, res) => {
  const submissions = readSubmissions();
  const totalSubmissions = submissions.length;
  const totalScore = submissions.reduce((sum, s) => sum + s.scoreScale10, 0);
  const averageScore = totalSubmissions > 0 ? Math.round(totalScore / totalSubmissions * 10) / 10 : 0;
  const questionStats = QUESTIONS.map((q) => {
    let wrongCount = 0;
    let correctCount = 0;
    const optionCounts = { A: 0, B: 0, C: 0, D: 0, blank: 0 };
    submissions.forEach((sub) => {
      const studentAns = sub.answers[q.id] || "";
      if (studentAns === "A") optionCounts.A++;
      else if (studentAns === "B") optionCounts.B++;
      else if (studentAns === "C") optionCounts.C++;
      else if (studentAns === "D") optionCounts.D++;
      else optionCounts.blank++;
      if (studentAns === q.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });
    const wrongRate = totalSubmissions > 0 ? Math.round(wrongCount / totalSubmissions * 100 * 10) / 10 : 0;
    return {
      questionId: q.id,
      questionTitle: q.question,
      passage: q.passage,
      correctAnswer: q.correctAnswer,
      wrongCount,
      wrongRate,
      correctCount,
      optionCounts
    };
  });
  const responseData = {
    submissions,
    totalSubmissions,
    averageScore,
    questionStats
  };
  res.json(responseData);
});
app.post("/api/teacher/reset-all", teacherAuthMiddleware, (req, res) => {
  writeSubmissions([]);
  res.json({ success: true, message: "\u0110\xE3 x\xF3a to\xE0n b\u1ED9 b\xE0i n\u1ED9p th\xE0nh c\xF4ng. C\u01A1 s\u1EDF d\u1EEF li\u1EC7u tr\u1EDF v\u1EC1 r\u1ED7ng." });
});
app.get("/api/download-zip", (req, res) => {
  const zipPath = path.resolve(__dirname, "bai-on-tinhoc8.zip");
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, "bai-on-tinhoc8.zip");
  } else {
    res.status(404).send("File zip ch\u01B0a s\u1EB5n s\xE0ng");
  }
});
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
