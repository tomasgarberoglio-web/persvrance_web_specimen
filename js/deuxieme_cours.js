let grille = 28; let marge = 40; let sound; let amp; let font; let font1; let fft; let textsize = 42

let colorListe = [59,327,277,267]; let colorChoisi = 0;
let colorListeFi = [59,327,277,267]; let colorChoisiFi = 0; 
 // Exemple de couleur en HSL (colorMode(HSL) est activé) :
// fill(h, s, l) -> h: teinte 0-360, s: saturation 0-100, l: luminosité 0-100

let fontListe = []; let FontListe = [];
let caractereChoisi = 0; let fontChoisi = 0; let FontChoisi = 0;
let liste = ['a','b','c','d','e','f','g','h','i','j','k','l','m'];
let Liste = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
let chiffres = ['0','1','2','3','4','5','6','7','8','9'];
let chiffreChoisi = 0;
let grille4Size = 28;
let marge4 = 40;
let presetGrille4 = 0;

let MAX_BANDS = 12; // max bandeaux possible (6 weights × 2)
let scrollOffsets = new Array(MAX_BANDS).fill(0);
let lettersCandidates = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let digitsPunctCandidates = '0123456789.,;:!?()[]{}@#&*+-=/<>~_|%$€£¥';
let grille5Chars = [];
for (let _i = 0; _i < MAX_BANDS; _i++) grille5Chars.push([]);
let hoveredBand = -1;
let scrollWheelDelta = 0;
let bandScales = new Array(MAX_BANDS).fill(1);
let currentVariant = 0;
let variantNames = ['Clasique', 'Carré 45°', 'Rectangles 45°D', 'Rectangles 45°G', 'Pixel and Dot', 'Symboles',];
let isSymbolesVariant = [false, false, false, false, false, true]; // true pour variante Symboles uniquement
let variantFonts = []; // sera rempli dans setup
let buttonBarHeight = 50;
let g5; // buffer 2D pour grille5
let footerGfx; // buffer 2D pour le footer
let fontScaleG5 = 1.0; // échelle globale des fonts dans grille5
let signaImg; // image signature
let footerHeight = 50; // hauteur de la zone info en bas

// Mode fullpage pour un bandeau
let isFullPageMode = false;
let selectedBandIndex = -1;
let bandYPositions = []; // Pour mémoriser les positions y des bandeaux

let Grille = 4;


function preload(){
  sound = loadSound('sound/strudel.mp3');

  font = loadFont('Polices/Persvrance-SymbolesDot.otf');
  font1 = loadFont('Polices/Persvrance-SymbolesCarre.otf');
  font2 = loadFont('Polices/Persvrance-SymbolesCarreFusion.otf');
  font3 = loadFont('Polices/Persvrance-SymbCarreFusion-SemiBold.otf');
  font4 = loadFont('Polices/Persvrance-SymbCarreFusion-Bold.otf');
  font5 = loadFont('Polices/Persvrance-SymbCarreFusion-Black.otf');
  font6 = loadFont('Polices/Persvrance-SymbCarreFusion-BlackPlus.otf');

  Font = loadFont('Polices/Persvrance-Dot.otf');
  Font1 = loadFont('Polices/Persvrance-Carre.otf');
  Font2 = loadFont('Polices/Persvrance-Fusion-Regular.otf');
  Font3 = loadFont('Polices/Persvrance-Fusion-SemiBold.otf');
  Font4 = loadFont('Polices/Persvrance-Fusion-Black.otf');
  Font5 = loadFont('Polices/Persvrance-Carre45-regular.otf');
  Font6 = loadFont('Polices/Persvrance-Carre45Fusion.otf');
  Font7 = loadFont('Polices/Persvrance-Carre45Fusion-SemiBold.otf');
  Font8 = loadFont('Polices/Persvrance-Carre45Fusion-Black.otf');

  // Rectangle45 fonts
  Rect45D = loadFont('Polices/Persvrance-Rectangle45D.otf');
  Rect45G = loadFont('Polices/Persvrance-Rectangle45G.otf');
  Rect45FD_Reg = loadFont('Polices/Persvrance-Rectangle45FusionD-Regular.otf');
  Rect45FD_Semi = loadFont('Polices/Persvrance-Rectangle45FusionD1-SemiBold.otf');
  Rect45FD_Bold = loadFont('Polices/Persvrance-Rectangle45FusionD-Bold.otf');
  Rect45FD_Black = loadFont('Polices/Persvrance-Rectangle45FusionD-Black.otf');
  Rect45FD_BlackP = loadFont('Polices/Persvrance-Rectangle45FusionD-BlackPlus.otf');
  Rect45FG_Reg = loadFont('Polices/Persvrance-Rectangle45GFusion-Regular.otf');
  Rect45FG_Semi = loadFont('Polices/Persvrance-Rectangle45FusionG-SemiBold.otf');
  Rect45FG_Bold = loadFont('Polices/Persvrance-Rectangle45FusionG-Bold.otf');
  Rect45FG_Black = loadFont('Polices/Persvrance-Rectangle45FusionG-Black.otf');

  signaImg = loadImage('image/signa_blanc.png');
}

function setup() {
    colorMode(HSL); angleMode(DEGREES); ellipseMode(CENTER); textAlign(CENTER,CENTER);
    createCanvas(windowWidth, windowHeight,WEBGL); frameRate(10);
    // rectMode(CENTER)
    amp = new p5.Amplitude();
    fft = new p5.FFT();
    fontListe = [font, font1, font2, font3, font4, font5, font6];
    FontListe = [Font, Font1, Font2, Font3, Font4, Font5, Font6, Font7, Font8];

    // Définir les groupes de variantes (nombre de graisses variable)
    variantFonts = [
      [Font2, Font3, Font4],                                          // Fusion: Regular, SemiBold, Black
      [Font5,Font6, Font7, Font8],                                          // Carre45Fusion: Regular, SemiBold, BlackD
      [Rect45D, Rect45FD_Reg, Rect45FD_Semi, Rect45FD_Bold, Rect45FD_Black, Rect45FD_BlackP],   // Rect45 Fusion G
      [Rect45G, Rect45FG_Reg, Rect45FG_Semi, Rect45FG_Bold, Rect45FG_Black],                                             // Linéales Rect
      [Font, Font1],                                           // Linéales: Dot, Carre, Carre45
      [font1, font2, font3, font4, font5, font6],                                          // SymbCarreFusion: Regular, SemiBold, Black

    ];

    // Filtrer les caractères disponibles pour la variante courante
    filterGrille5Chars();

    // Créer le buffer 2D pour grille5 (rendu texte beaucoup plus rapide)
    g5 = createGraphics(windowWidth, windowHeight);
    g5.colorMode(HSL);

    // Buffer 2D pour le footer (contrôles + signature)
    footerGfx = createGraphics(windowWidth, windowHeight);
}

// Fonction utilitaire pour afficher les contrôles en bas à gauche (contexte WEBGL, après translate)
function drawFooterControls(controlsText) {
  let fg = footerGfx;
  fg.clear();
  fg.noStroke();
  fg.fill(150);
  fg.textSize(12);
  fg.textAlign(LEFT, BOTTOM);
  fg.textFont('Arial');
  fg.text(controlsText, 15, height - 10);
  // Image signature en bas à droite
  if (signaImg) {
    let imgH = 35;
    let imgW = imgH * (signaImg.width / signaImg.height);
    fg.image(signaImg, width - imgW - 15, height - imgH - 8, imgW, imgH);
  }
  image(fg, 0, 0);
}

let zoom =0.009; let temps =0;

function draw() {
   translate(-width/2,-height/2)
//let spectrum = fft.getEnergy();
   background(0)
    let bass, lowMid, mid, highMid, treble;
 fft.analyze();
//ici on obtient que des valeurs entre 0 et 255  

if (Grille === 0) {
  frameRate(10);
  grille1();
} 
else if (Grille === 1) {
  frameRate(10);
  grille2();
} 
else if (Grille === 2) {
  frameRate(10);
  grille3(); 
}
else if (Grille === 3) {
  frameRate(10);
  grille4();    
}
else if (Grille === 4) {
  frameRate(60);
  grille5();
}
}

function mousePressed(){
 // Clic sur les boutons de variante dans grille5
 if (Grille === 4 && mouseY < buttonBarHeight) {
   let btnW = width / variantNames.length;
   let clickedBtn = floor(mouseX / btnW);
   if (clickedBtn >= 0 && clickedBtn < variantNames.length && clickedBtn !== currentVariant) {
     currentVariant = clickedBtn;
     filterGrille5Chars();
     scrollOffsets = new Array(MAX_BANDS).fill(0);
     bandScales = new Array(MAX_BANDS).fill(1);
     fontScaleG5 = 1.0;
   }
   return;
 }
 
 // Clic sur un bandeau en mode normal pour passer en fullpage
 if (Grille === 4 && !isFullPageMode && mouseY >= buttonBarHeight && mouseY < height - footerHeight) {
   let isSymboles = isSymbolesVariant[currentVariant];
   let fonts5 = variantFonts[currentVariant];
   let numWeights = fonts5.length;
   let numBands = isSymboles ? numWeights : numWeights * 2;
   let availableHeight = height - buttonBarHeight - footerHeight;
   let baseBandHeight = availableHeight / numBands;
   let mY = mouseY - buttonBarHeight;
   
   for (let b = 0; b < numBands; b++) {
     if (mY >= baseBandHeight * b && mY < baseBandHeight * (b + 1)) {
       isFullPageMode = true;
       selectedBandIndex = b;
       return;
     }
   }
 }
 let lecture = sound.isPlaying();
 if(lecture == false){
  sound.play()
 }    
}

function keyPressed(){
  // Quitter le mode fullpage avec Escape
  if (key === 'Escape' && Grille === 4 && isFullPageMode) {
    isFullPageMode = false;
    selectedBandIndex = -1;
    return;
  }
  
  if (key === 'a' || key === 'A') {
  Grille++; Grille = Grille % 5;
  }
  if (key === 'f' || key === 'F') {
  fontChoisi++; fontChoisi = fontChoisi % fontListe.length;
  FontChoisi++; FontChoisi = FontChoisi % FontListe.length; 
}
  if(key=='arrowleft' || key=='ArrowLeft'){
   caractereChoisi++; caractereChoisi = caractereChoisi % liste.length;
   }
if(key=='arrowright' || key=='ArrowRight'){
   colorChoisi++; colorChoisi = colorChoisi % colorListe.length;
   colorChoisiFi++; colorChoisiFi = colorChoisiFi % colorListeFi.length;
}
if (Grille === 3 && key === 'ArrowLeft') {
  chiffreChoisi = (chiffreChoisi + 1) % chiffres.length;
}
if (Grille === 3 && (key === 'g' || key === 'G')) {
  presetGrille4++;
  presetGrille4 = presetGrille4 % 3;

  if (presetGrille4 === 0) {
    grille4Size = 28;
    marge4 = 40;
  }

  if (presetGrille4 === 1) {
    grille4Size = 42;
    marge4 = 80;
  }

  if (presetGrille4 === 2) {
    grille4Size = 66;
    marge4 = 120;
  }
}
if (Grille === 4 && keyCode === UP_ARROW) {
  let numWeightsNow = variantFonts[currentVariant].length;
  let isSymb = isSymbolesVariant[currentVariant];
  let numBandsNow = isSymb ? numWeightsNow : numWeightsNow * 2;
  let maxRatio = 0.95;
  if (numBandsNow > 6) maxRatio = 0.75;
  if (numBandsNow > 8) maxRatio = 0.60;
  let maxScale = maxRatio / 0.75;
  fontScaleG5 = min(fontScaleG5 + 0.1, maxScale);
}
if (Grille === 4 && keyCode === DOWN_ARROW) {
  fontScaleG5 = max(fontScaleG5 - 0.1, 0.3);
}

}
  resizeCanvas(windowWidth, windowHeight);
  if (g5) {
    g5.resizeCanvas(windowWidth, windowHeight);
  }
  if (footerGfx) {
    footerGfx.resizeCanvas(windowWidth, windowHeight);
  }


function mouseWheel(event) {
  if (Grille === 4 && hoveredBand >= 0) {
    scrollWheelDelta += event.delta * 1.5;
    return false; // empêcher le scroll de la page
  }
}

function filterGrille5Chars() {
  let fonts5 = variantFonts[currentVariant];
  let isSymboles = isSymbolesVariant[currentVariant];
  let numWeights = fonts5.length;
  
  // Réinitialiser tous les bandeaux
  for (let i = 0; i < MAX_BANDS; i++) grille5Chars[i] = [];
  
  for (let w = 0; w < numWeights; w++) {
    let otFont = fonts5[w].font;
    
    // Bandeau lettres
    let letIdx = isSymboles ? w : w * 2;
    grille5Chars[letIdx] = [];
    for (let i = 0; i < lettersCandidates.length; i++) {
      let ch = lettersCandidates[i];
      if (otFont.charToGlyphIndex(ch) > 0) grille5Chars[letIdx].push(ch);
    }
    
    // Bandeau chiffres+ponctuation (sauf symboles)
    if (!isSymboles) {
      let dpIdx = w * 2 + 1;
      grille5Chars[dpIdx] = [];
      for (let i = 0; i < digitsPunctCandidates.length; i++) {
        let ch = digitsPunctCandidates[i];
        if (otFont.charToGlyphIndex(ch) > 0) grille5Chars[dpIdx].push(ch);
      }
    }
  }
}

function grille1(){
 let zoom =0.004; let level = amp.getLevel(); let bass;
 fft.analyze();
 bass = fft.getEnergy("bass");
 let bassConverti = map(bass,0,255,0,1)
 temps = temps+level*0.5;
 let rota= mouseX*0.5+mouseX*0.5
 background(0)
 for (let x = marge; x <width-marge; x+=grille) { for (let y = marge; y<height-marge; y+=grille) {
    //  fill(random(frameCount*1.5)) 
    let seed = x*y; let paramX=zoom*x; let paramY=zoom*y; let noise2d = noise(paramX,paramY,temps)*grille*2
    let treshold = noise(paramX,paramY,temps)
    // let s = noise(seed+frameCount*0.01)*grille*2
    fill(0)
    textSize(noise2d*0.6)
    // ellipse(x,y,noise2d)
    //   textSize(noise2d)
    // textFont(font)
    // text("6",x,y)

    if (treshold > 0.5) {   
    push()
    textFont(fontListe[fontChoisi]); rectMode(CENTER); textAlign(CENTER,CENTER); translate( x-grille/4+21, y-grille/4-5);
    let angle = atan2(mouseY - y, mouseX - x);
    rotateZ(angle);
    //  rotateZ(rota+noise2d*5)
    //   square(0, 0, 25) // carré centré, rotation OK
  
    let hue = (frameCount * 2 + degrees(angle)) % 360;
    fill(hue, 100, 80) 
    text(liste[caractereChoisi],-14,noise2d*0.5)
    pop()
    }
    else if(treshold>0.4){
    push()    
    rectMode(CENTER); textAlign(CENTER,CENTER); translate( x-grille/4+21, y-grille/4-5);
    let angle = atan2(mouseY - y, mouseX - x);
    rotateZ(angle);
    textFont(fontListe[fontChoisi]);
    // textSize(30)
    let hue = (frameCount * 2 + degrees(angle)) % 360;
    fill(hue, 80, 45) 
    text(liste[caractereChoisi],-14,noise2d*0.5)
    pop()
    }
    else{  
    push()   
    rectMode(CENTER); textAlign(CENTER,CENTER);
    translate( x-grille/4+21, y-grille/4-5)
    let angle = atan2(mouseY - y, mouseX - x);
    rotateZ(angle);
    textFont(fontListe[fontChoisi]);
    // textSize(30)
    let hue = (frameCount * 2 + degrees(angle)) % 360;
    fill(hue, 40, 20) 
    text(liste[caractereChoisi],-14,noise2d*0.5)
    pop()
    }
   }
 }
 drawFooterControls('Souris : orienter les caractères  |  F : changer de font  |  ← : changer de caractère  |  → : changer de couleur  |  A : changer de grille');
}


function grille2(){
let level = amp.getLevel(); let bass;
fft.analyze();
bass = fft.getEnergy("bass");
let bassConverti = map(bass,0,255,0,1)
temps = temps+level*0.5;
for (let x = marge+60; x <width-marge; x+=grille+80) {
for (let y = marge+60; y<height-marge; y+=grille+80) {
let paramX=x*zoom; let paramY =y*zoom;
//   let paramX=x*zoom;
// let paramY =y*zoom;
strokeWeight(3)
let noise3d = noise(paramX,paramY,temps)*360; let treshold = noise(paramX,paramY,temps)

if(mouseX>200){
  caractereChoisi++; caractereChoisi = caractereChoisi % liste.length;
  colorChoisi++; colorChoisi = colorChoisi % colorListe.length; 
  }
//fill(180,0,noise3d,0.9)
noStroke(); push(); rectMode(CENTER) ;textAlign(CENTER,CENTER) ;translate( x-grille/4+21, y-grille/4-5) ; 
rotateY(mouseX*0.5)
//   rotateX(noise3d)
//   square(0,0,grille-1)
//    circle(grille/2,grille/2,10)
textSize(noise3d*0.2)*bassConverti*10
//  textSize(30)
textFont(fontListe[fontChoisi]);
fill(colorListe[colorChoisi],100,50)
text(liste[caractereChoisi],-16.5,1)
pop()    
  }
 }
 drawFooterControls('Souris : interaction  |  F : changer de font  |  → : changer de couleur  |  A : changer de grille');
}

function grille3(){
let level = amp.getLevel(); let bass; let mid; fft.analyze();
  mid = fft.getEnergy("mid");
  bass = fft.getEnergy("bass");
  let midConverti = map(mid,0,255,0,1); let bassConverti = map(bass,0,255,0,1)
  temps = temps+level*0.5;
  //   for (let x = marge+60; x <width-marge; x+=grille+100) {
  //    for (let y = marge+60; y<height-marge; y+=grille+100) {
  for (let x = marge; x <width-marge; x+=mouseX/10+grille) {
  for (let y = marge; y<height-marge; y+=mouseX/10+grille) {
  let paramX=x*zoom; let paramY =y*zoom;
  //   let paramX=x*zoom;
  // let paramY =y*zoom;
  strokeWeight(3)
  let noise3d = noise(paramX,paramY,temps)*360; let treshold = noise(paramX,paramY,temps)
  //fill(180,0,noise3d,0.9)
  fill(360,100,50)
  noStroke()
textSize(noise3d*0.5)
 if (treshold > 0.5) {   
  push()
  rectMode(CENTER); textAlign(CENTER,CENTER) ; translate( x-grille/4+21, y-grille/4-5)
  //  rotateY(noise3d)
  //   rotateX(noise3d)
  //   square(0,0,grille-1)
  fill(colorListe[colorChoisi], 100, 50) 
  //   circle(-16.5,1,bassConverti*26)
  //  textSize(textsize*bassConverti*2)
  //  textSize(30)
  textFont(fontListe[fontChoisi]);
  //  fill(360,100,50)
  textSize(bassConverti*42)
  text('c',-16.5,1)
  pop()
  if (bassConverti > 0.8) {    
   fontChoisi++; fontChoisi = fontChoisi % fontListe.length; 
  FontChoisi++; FontChoisi = FontChoisi % FontListe.length; 
  
  }    

}
      
 else if(treshold>0.4){
  push()
  rectMode(CENTER); textAlign(CENTER,CENTER); translate( x-grille/4+21, y-grille/4-5)
  //  rotateY(noise3d)
  //   rotateX(noise3d)
  //   square(0,0,grille-1)
  fill(0)
  //    circle(grille/2,grille/2,10)
  textSize(30)
  textFont(fontListe[fontChoisi]);
  //  fill(bassConverti*360,100,50)
  //  fill(60,100,50)

  if (midConverti > 0.5) {    
  fill(327,100,50)
  textSize(42)
  text(Liste[caractereChoisi],-16.5,1)
     caractereChoisi++; caractereChoisi = caractereChoisi % liste.length;
  
  }    

   
  else {
    fill(59,100,50)
  textSize(42)
  text(Liste[caractereChoisi],-16.5,1)
  }
  pop()
}

else{

  fill(277,100,50)
  textSize(42)
 text(Liste[caractereChoisi],-16.5,1)
   
         }
      }
    }
  drawFooterControls('Souris : densité de la grille  |  F : changer de font  |  ← : changer de caractère  |  → : changer de couleur  |  A : changer de grille');
  }

  function grille4(){
    
  let level = amp.getLevel(); let bass;
  fft.analyze();
  bass = fft.getEnergy("bass");
  let bassConverti = map(bass,0,255,0,1)
  temps = temps+level*0.5;
for (let x = marge4; x < width - marge4; x += grille4Size){
for (let y = marge4; y < height - marge4; y += grille4Size) {
  let paramX=x*zoom; let paramY =y*zoom;
  //   let paramX=x*zoom;
  // let paramY =y*zoom;
         strokeWeight(3)
  let noise3d = noise(paramX,paramY,temps)*360; let treshold = noise(paramX,paramY,temps)

  //     if(mouseY>200){
  //    caractereChoisi++; caractereChoisi = caractereChoisi % Liste.length;
  //    caractereChoisi++; caractereChoisi = caractereChoisi % liste.length;
  //    colorChoisi++; colorChoisi = colorChoisi % colorListe.length;
     
  //  }
  // fill(180,0,noise3d,0.9)
  noStroke();
  push()
  rectMode(CENTER); textAlign(CENTER,CENTER) ; translate( x-grille/4+21, y-grille/4-5); 
  // rotateY(mouseX*0.3)
  //   rotateX(noise3d)
  //   square(0,0,grille-1)
  //    circle(grille/2,grille/2,10)
  textSize(noise3d*0.22)
  //  textSize(30)
fill(colorListe[colorChoisi],noise3d,noise3d*0.2)
 textFont(FontListe[FontChoisi]);
   if(mouseX>200){
     caractereChoisi++; caractereChoisi = caractereChoisi % liste.length;
     colorChoisi++; colorChoisi = colorChoisi % colorListe.length;
   }
 // zone 1 → lettres
if (mouseX <= 600) {
  text(Liste[caractereChoisi], -16.5, 1);
}

// zone 2 → chiffres qui changent
else if (mouseX > 600 && mouseX <= 1000) {
  chiffreChoisi++;
  chiffreChoisi = chiffreChoisi % chiffres.length;

  text(chiffres[chiffreChoisi], -16.5, 1);
}

// zone 3 → chiffres figés
else if (mouseX > 1000) {
  fill(colorListeFi[colorChoisiFi],noise3d,noise3d*0.2)
  text(chiffres[chiffreChoisi], -16.5, 1);
  
}


//   if (key === 'c') {
//   textFont(FontListe[FontChoisi]);
//   text(Liste[caractereChoisi],-16.5,1)
// }
//  if (key === 'x') {
//   textFont(fontListe[fontChoisi]);
//   text(liste[caractereChoisi],-16.5,1)
// }
 pop()
}
}
 drawFooterControls('Souris : zones d\'interaction  |  F : changer de font  |  G : changer de preset  |  ← → : caractère/couleur  |  A : changer de grille');
}


function drawBandFullPage(bandIndex) {
  background(0);
  
  let g = g5;
  g.clear();
  g.background(0);
  
  let isSymboles = isSymbolesVariant[currentVariant];
  let fonts5 = variantFonts[currentVariant];
  let numWeights = fonts5.length;
  
  let weightIdx, isLetters;
  if (isSymboles) {
    weightIdx = bandIndex;
    isLetters = true;
  } else {
    weightIdx = floor(bandIndex / 2);
    isLetters = (bandIndex % 2 === 0);
  }
  
  // Mode fullpage - utiliser toute la hauteur disponible
  let bh = height - 60; // laisser de la marge pour le header et footer
  let yCenter = height / 2;
  
  // maxRatio adaptatif
  let baseMaxRatio = 0.95;
  let maxFontFactor = isSymboles ? 0.80 : 0.80;
  let fontSize = min(bh * maxFontFactor * fontScaleG5, height * baseMaxRatio);
  
  let cwBase = isSymboles ? 1.6 : 1.2;
  let cwRange = isSymboles ? 0.4 : 0.4;
  let cwMul = cwBase + (numWeights > 1 ? (weightIdx / (numWeights - 1)) * cwRange : 0);
  let cw = fontSize * cwMul;
  let chars = grille5Chars[bandIndex];
  let totalWidth = chars.length * cw;
  
  if (totalWidth >= 1) {
    // Scroll du bandeau fullpage
    for (let b = 0; b <= bandIndex; b++) {
      scrollOffsets[b] += 3;
    }
    let apply = scrollWheelDelta * 0.3;
    scrollOffsets[bandIndex] += apply;
    scrollWheelDelta -= apply;
    if (abs(scrollWheelDelta) < 0.1) scrollWheelDelta = 0;
    
    // Afficher le bandeau en plein écran
    g.textFont(fonts5[weightIdx]);
    g.textSize(fontSize);
    g.textAlign(CENTER, CENTER);
    
    let offset = ((scrollOffsets[bandIndex] % totalWidth) + totalWidth) % totalWidth;
    let h = (noise(bandIndex * 7.3 + frameCount * 0.008) * 360) % 360;
    g.fill(h, 90, 60);
    
    let nbCopies = ceil(width / totalWidth) + 2;
    for (let c = 0; c < nbCopies; c++) {
      let baseX = -offset + c * totalWidth;
      for (let i = 0; i < chars.length; i++) {
        let cx = baseX + i * cw;
        if (cx > -cw && cx < width + cw) {
          g.text(chars[i], cx, yCenter);
        }
      }
    }
  }
  
  // Afficher le bandeau sélectionné en haut
  g.fill(0, 0, 15);
  g.rect(0, 0, width, 40);
  g.fill(0, 0, 100);
  g.textFont('Arial');
  g.textSize(16);
  g.textAlign(LEFT, CENTER);
  g.text(`← ESC : retour | Scroll : défiler | ↑↓ : taille`, 15, 20);
  
  // Afficher le buffer 2D sur le canvas WEBGL
  image(g, 0, 0);
}

function grille5(){
  background(0);
  
  // Si en mode fullpage, afficher le bandeau sélectionné en plein écran
  if (isFullPageMode && selectedBandIndex >= 0) {
    drawBandFullPage(selectedBandIndex);
    return;
  }
  
  let g = g5;
  g.clear();
  g.background(0);
  
  // --- Barre de boutons en haut ---
  let btnH = buttonBarHeight;
  let btnCount = variantNames.length;
  let btnW = width / btnCount;
  let hoveredBtn = -1;
  
  for (let i = 0; i < btnCount; i++) {
    let bx = i * btnW;
    let isActive = (i === currentVariant);
    let isHover = (mouseY < btnH && mouseX >= bx && mouseX < bx + btnW);
    if (isHover) hoveredBtn = i;
    
    if (isActive) {
      g.fill(0, 0, 100);
    } else if (isHover) {
      g.fill(0, 0, 40);
    } else {
      g.fill(0, 0, 15);
    }
    g.noStroke();
    g.rect(bx, 0, btnW - 2, btnH);
    
    if (isActive) {
      g.fill(0, 0, 0);
    } else {
      g.fill(0, 0, 100);
    }
    g.textSize(14);
    g.textAlign(CENTER, CENTER);
    g.textFont('Arial');
    g.text(variantNames[i], bx + btnW / 2, btnH / 2);
  }
  
  // --- Bandeaux ---
  let availableHeight = height - btnH - footerHeight;
  let isSymboles = isSymbolesVariant[currentVariant];
  let fonts5 = variantFonts[currentVariant];
  let numWeights = fonts5.length;
  let numBands = isSymboles ? numWeights : numWeights * 2;
  let baseBandHeight = availableHeight / numBands;
  let speed = 3;
  let growFactor = 1.12;
  
  let mY = mouseY - btnH;
  hoveredBand = -1;
  if (mY >= 0) {
    for (let b = 0; b < numBands; b++) {
      if (mY >= baseBandHeight * b && mY < baseBandHeight * (b + 1)) {
        hoveredBand = b;
      }
    }
  }
  
  for (let b = 0; b < numBands; b++) {
    let target = (b === hoveredBand) ? growFactor : 1.0;
    bandScales[b] = lerp(bandScales[b], target, 0.12);
  }
  
  let totalScaled = 0;
  let bandHeights = [];
  for (let b = 0; b < numBands; b++) {
    bandHeights[b] = baseBandHeight * bandScales[b];
    totalScaled += bandHeights[b];
  }
  let ratio = availableHeight / totalScaled;
  for (let b = 0; b < numBands; b++) {
    bandHeights[b] *= ratio;
  }
  
  for (let b = 0; b < numBands; b++) {
    scrollOffsets[b] += speed;
  }
  if (hoveredBand >= 0) {
    let apply = scrollWheelDelta * 0.3;
    scrollOffsets[hoveredBand] += apply;
    scrollWheelDelta -= apply;
  }
  if (abs(scrollWheelDelta) < 0.1) scrollWheelDelta = 0;
  
  let yAccum = btnH;
  let fc008 = frameCount * 0.008;
  for (let b = 0; b < numBands; b++) {
    let weightIdx, isLetters;
    if (isSymboles) {
      weightIdx = b;
      isLetters = true;
    } else {
      weightIdx = floor(b / 2);
      isLetters = (b % 2 === 0);
    }
    
    let bh = bandHeights[b];
    let yTop = yAccum;
    // Pour Symboles, centrer exactement (0.5), pour autres variantes légèrement au-dessus (0.48)
    let centerOffset = isSymboles ? 0.58 : 0.48;
    let yCenter = yTop + bh * centerOffset;
    yAccum += bh;
    
    // maxRatio adaptatif : basé sur le nombre de bandeaux
    let baseMaxRatio = 0.95;
    if (numBands > 6) baseMaxRatio = 0.75;
    if (numBands > 8) baseMaxRatio = 0.55;
    // Réduire la taille max pour la variante Symboles pour éviter le chevauchement
    let maxFontFactor = isSymboles ? 0.55 : 0.75;
    let fontSize = min(bh * maxFontFactor * fontScaleG5, bh * baseMaxRatio);
    // Multiplier d'espacement progressif selon le poids (léger → lourd)
    let cwBase = isSymboles ? 1.6 : 1.2;
    let cwRange = isSymboles ? 0.4 : 0.4;
    let cwMul = cwBase + (numWeights > 1 ? (weightIdx / (numWeights - 1)) * cwRange : 0);
    let cw = fontSize * cwMul;
    let chars = grille5Chars[b];
    let totalWidth = chars.length * cw;
    if (totalWidth < 1) continue;
    
    let isGroupSep = isSymboles ? (b > 0) : (b % 2 === 0 && b > 0);
    if (weightIdx >= numWeights) continue; // sécurité
    g.stroke(255, isGroupSep ? 80 : 25);
    g.strokeWeight(isGroupSep ? 2 : 1);
    g.line(0, yTop, width, yTop);
    g.noStroke();
    
    g.textFont(fonts5[weightIdx]);
    g.textSize(fontSize);
    g.textAlign(CENTER, CENTER);
    
    let offset = ((scrollOffsets[b] % totalWidth) + totalWidth) % totalWidth;
    let isHovered = (b === hoveredBand);
    
    if (isHovered) {
      g.fill(0, 0, 100);
      let nbCopies = ceil(width / totalWidth) + 2;
      for (let c = 0; c < nbCopies; c++) {
        let baseX = -offset + c * totalWidth;
        for (let i = 0; i < chars.length; i++) {
          let cx = baseX + i * cw;
          if (cx > -cw && cx < width + cw) {
            g.text(chars[i], cx, yCenter);
          }
        }
      }
    } else {
      let h = (noise(b * 7.3 + fc008) * 360) % 360;
      g.fill(h, 90, 60);
      let nbCopies = ceil(width / totalWidth) + 2;
      for (let c = 0; c < nbCopies; c++) {
        let baseX = -offset + c * totalWidth;
        for (let i = 0; i < chars.length; i++) {
          let cx = baseX + i * cw;
          if (cx > -cw && cx < width + cw) {
            g.text(chars[i], cx, yCenter);
          }
        }
      }
    }
  }
  
  // --- Footer : contrôles + signature ---
  let footerY = height - footerHeight;
  g.stroke(255, 40);
  g.strokeWeight(1);
  g.line(0, footerY, width, footerY);
  g.noStroke();
  
  // Texte contrôles en bas à gauche
  g.fill(0, 0, 60);
  g.textFont('Arial');
  g.textSize(12);
  g.textAlign(LEFT, CENTER);
  g.text('Scroll : défiler le bandeau survolé  |  ↑↓ : taille des caractères  |  A : changer de grille', 15, footerY + footerHeight / 2);
  g.textAlign(CENTER, CENTER);
  g.text('Persvrance', windowWidth/2, footerY + footerHeight / 2);

  // Image signature en bas à droite
  if (signaImg) {
    let imgH = footerHeight - 10;
    let imgW = imgH * (signaImg.width / signaImg.height);
    g.image(signaImg, width - imgW - 15, footerY + 5, imgW, imgH);
  }
  
  // Afficher le buffer 2D sur le canvas WEBGL
  image(g, 0, 0);
}
