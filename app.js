const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// data/ klasöründeki tüm JSON dosyalarını (hafta1.json, hafta2.json...) otomatik oku
function getWeeksData() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    return [];
  }
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
  
  const weeks = files.map(file => {
    const rawData = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    return JSON.parse(rawData);
  });

  return weeks.sort((a, b) => a.id - b.id);
}

app.get('/', (req, res) => {
  const weeksData = getWeeksData();
  if (weeksData.length === 0) {
    return res.send("data/ klasöründe henüz hafta verisi bulunamadı.");
  }
  
  // Hem ?hafta=1 hem de ?ders=1 desteklenir
  const weekId = parseInt(req.query.hafta) || parseInt(req.query.ders) || weeksData[0].id;
  const currentWeek = weeksData.find(w => w.id === weekId) || weeksData[0];

  res.render('index', {
    weeks: weeksData,
    week: currentWeek,
    lessons: weeksData,
    lesson: currentWeek
  });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`));
}

module.exports = app;