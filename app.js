const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// data/ klasöründeki tüm JSON dosyalarını otomatik oku ve sırala
function getLessonsData() {
  const dataDir = path.join(__dirname, 'data');
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
  
  const lessons = files.map(file => {
    const rawData = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    return JSON.parse(rawData);
  });

  return lessons.sort((a, b) => a.id - b.id);
}

app.get('/', (req, res) => {
  const lessonsData = getLessonsData();
  const lessonId = parseInt(req.query.ders) || lessonsData[0].id;
  const currentLesson = lessonsData.find(l => l.id === lessonId) || lessonsData[0];

  res.render('index', {
    lessons: lessonsData,
    lesson: currentLesson
  });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`));
}

module.exports = app;