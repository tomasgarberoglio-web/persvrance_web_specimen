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
let variantNames = ['Clasique', 'Carré \n 45°', 'Rectangles\n 45°D', 'Rectangles\n 45°G', 'Pixel \nand Dot', 'Symboles',];
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

// Slider pour grille 4 mobile
let g4SliderValue = 0; // 0 = zone 1 (lettres), 1 = zone 2 (chiffres), 2 = zone 3 (figé)
let isG4SliderDragging = false;

let Grille = 4;


function preload(){
  sound = loadSound('sound/strudel.mp3');

  font = loadFont('polices/Persvrance-SymbolesDot.otf');
  font1 = loadFont('polices/Persvrance-SymbolesCarre.otf');
  font2 = loadFont('polices/Persvrance-SymbolesCarreFusion.otf');
  font3 = loadFont('polices/Persvrance-SymbCarreFusion-SemiBold.otf');
  font4 = loadFont('polices/Persvrance-SymbCarreFusion-Bold.otf');
  font5 = loadFont('polices/Persvrance-SymbCarreFusion-Black.otf');
  font6 = loadFont('polices/Persvrance-SymbCarreFusion-BlackPlus.otf');

  Font = loadFont('polices/Persvrance-Dot.otf');
  Font1 = loadFont('polices/Persvrance-Carre.otf');
  Font2 = loadFont('polices/Persvrance-Fusion-Regular.otf');
  Font3 = loadFont('polices/Persvrance-Fusion-SemiBold.otf');
  Font4 = loadFont('polices/Persvrance-Fusion-Black.otf');
  Font5 = loadFont('polices/Persvrance-Carre45-regular.otf');
  Font6 = loadFont('polices/Persvrance-Carre45Fusion.otf');
  Font7 = loadFont('polices/Persvrance-Carre45Fusion-SemiBold.otf');
  Font8 = loadFont('polices/Persvrance-Carre45Fusion-Black.otf');

  // Rectangle45 fonts
  Rect45D = loadFont('polices/Persvrance-Rectangle45D.otf');
  Rect45G = loadFont('polices/Persvrance-Rectangle45G.otf');
  Rect45FD_Reg = loadFont('polices/Persvrance-Rectangle45FusionD-Regular.otf');
  Rect45FD_Semi = loadFont('polices/Persvrance-Rectangle45FusionD1-SemiBold.otf');
  Rect45FD_Bold = loadFont('polices/Persvrance-Rectangle45FusionD-Bold.otf');
  Rect45FD_Black = loadFont('polices/Persvrance-Rectangle45FusionD-Black.otf');
  Rect45FD_BlackP = loadFont('polices/Persvrance-Rectangle45FusionD-BlackPlus.otf');
  Rect45FG_Reg = loadFont('polices/Persvrance-Rectangle45GFusion-Regular.otf');
  Rect45FG_Semi = loadFont('polices/Persvrance-Rectangle45FusionG-SemiBold.otf');
  Rect45FG_Bold = loadFont('polices/Persvrance-Rectangle45FusionG-Bold.otf');
  Rect45FG_Black = loadFont('polices/Persvrance-Rectangle45FusionG-Black.otf');

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
    
    // Activer le support tactile
    checkTouchSupport();
}

// Variables globales pour les boutons virtuels
let virtualButtons = {
  grille: { x: 0, y: 0, w: 38, h: 35, label: 'G', color: [100, 0, 0] },
  font: { x: 0, y: 0, w: 38, h: 35, label: 'F', color: [200, 0, 0] },
  prevChar: { x: 0, y: 0, w: 38, h: 35, label: '←', color: [150, 0, 0] },
  nextColor: { x: 0, y: 0, w: 38, h: 35, label: '→', color: [150, 0, 0] },
  preset: { x: 0, y: 0, w: 38, h: 35, label: 'P', color: [180, 0, 0] },
  plus: { x: 0, y: 0, w: 35, h: 35, label: '+', color: [100, 0, 0] },
  minus: { x: 0, y: 0, w: 35, h: 35, label: '−', color: [100, 0, 0] },
  back: { x: 0, y: 0, w: 38, h: 35, label: '←', color: [100, 0, 0] }
};

// Fonction pour obtenir le texte approprié (PC vs Mobile)
function getControlsText(gridNum, textPC, textMobile) {
  if (!isTouchDevice) {
    return textPC;
  }
  return textMobile;
}

// Dessiner les contrôles en bas à gauche (contexte WEBGL, après translate)
function drawFooterControls(controlsText) {
  let fg = footerGfx;
  fg.clear();
  fg.noStroke();
  fg.fill(150);
  
  // Adapter la taille du texte en fonction du dispositif
  let textSize = isTouchDevice ? 8 : 12;  // Réduit de 10 à 8 pour mobile
  fg.textSize(textSize);
  
  fg.textAlign(LEFT, BOTTOM);
  fg.textFont('Arial');
  fg.text(controlsText, 15, height - 8);  // Descendu pour faire place aux boutons
  
  // Afficher les boutons virtuels sur mobile
  if (isTouchDevice) {
    drawVirtualButtons(virtualButtons, fg);
  }
  
  // Image signature en bas à droite
  if (signaImg) {
    let imgH = isTouchDevice ? 28 : 35;  // Réduit pour mobile
    let imgW = imgH * (signaImg.width / signaImg.height);
    fg.image(signaImg, width - imgW - 12, height - imgH - 12, imgW, imgH);
  }
  image(fg, 0, 0);
}

// Dessiner les boutons virtuels tactiles
function drawVirtualButtons(buttons, fg) {
  if (!isTouchDevice) return;
  
  let btnW = 34;  // Réduit de 38 pour mobile
  let btnH = 30;  // Réduit de 35 pour mobile
  let spacing = 1;  // Réduit de 2
  let startX = 6;
  let startY = height - btnH - 28;  // Monté pour dégager l'espace au-dessous
  let currentX = startX;
  
  let visibleButtons = [];
  
  // En mode fullpage, afficher le bouton retour et G
  if (isFullPageMode) {
    visibleButtons.push('back');
    visibleButtons.push('grille');
  } else {
    // Déterminer quels boutons afficher selon la grille actuelle
    visibleButtons.push('grille');
    
    if (Grille < 4) {
      // Grilles 0-3 : montrer F, ← et →
      visibleButtons.push('font');
      visibleButtons.push('prevChar');
      visibleButtons.push('nextColor');
    }
    
    if (Grille === 3) {
      // Grille 3 (zones) : montrer P pour preset
      visibleButtons.push('preset');
    }
    
    if (Grille === 4) {
      // Grille 4 (bandeaux) : pas de F, pas de +/- car gestures suffisent
    }
  }
  
  // Dessiner les boutons visibles
  for (let key of visibleButtons) {
    let btn = buttons[key];
    btn.x = currentX;
    btn.y = startY;
    btn.w = btnW;
    btn.h = btnH;
    
    // Dessiner le bouton
    fg.fill(...btn.color);
    fg.noStroke();
    fg.rect(btn.x, btn.y, btn.w, btn.h, 2);
    
    // Texte du bouton - très petit pour mobile
    fg.fill(0, 0, 100);
    fg.textSize(7);  // Réduit de 8
    fg.textAlign(CENTER, CENTER);
    fg.textFont('Arial');
    fg.text(btn.label, btn.x + btn.w/2, btn.y + btn.h/2);
    
    currentX += btnW + spacing;
  }
}

// Vérifier si un appui tactile est sur un bouton
function checkVirtualButtonHit(touchX, touchY, buttons) {
  for (let key in buttons) {
    let btn = buttons[key];
    if (touchX >= btn.x && touchX < btn.x + btn.w &&
        touchY >= btn.y && touchY < btn.y + btn.h) {
      return key;
    }
  }
  return null;
}

let zoom =0.009; let temps =0;

// ======== TOUCH SUPPORT ========
let touchStartX = 0, touchStartY = 0;
let touchEndX = 0, touchEndY = 0;
let prevTouchX = 0, prevTouchY = 0;
let isTouchDevice = false;
let touchIdentifier = -1;
let isSwipeScrolling = false;

// Détecter si c'est un appareil tactile
function checkTouchSupport() {
  isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
  console.log('Touch device detected:', isTouchDevice);
}

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

function handleInteractionClick(clickX, clickY) {
 // Clic sur les boutons de variante dans grille5
 if (Grille === 4 && clickY < buttonBarHeight) {
   let btnW = width / variantNames.length;
   let clickedBtn = floor(clickX / btnW);
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
 if (Grille === 4 && !isFullPageMode && clickY >= buttonBarHeight && clickY < height - footerHeight) {
   let isSymboles = isSymbolesVariant[currentVariant];
   let fonts5 = variantFonts[currentVariant];
   let numWeights = fonts5.length;
   let numBands = isSymboles ? numWeights : numWeights * 2;
   let availableHeight = height - buttonBarHeight - footerHeight;
   let baseBandHeight = availableHeight / numBands;
   let mY = clickY - buttonBarHeight;
   
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

function mousePressed(){
  handleInteractionClick(mouseX, mouseY);
}

// ======== TOUCH EVENTS ========
function touchStarted(event) {
  if (event.touches && event.touches.length > 0) {
    touchStartX = mouseX;
    touchStartY = mouseY;
    prevTouchX = mouseX;
    prevTouchY = mouseY;
    touchIdentifier = event.touches[0].identifier;
    isSwipeScrolling = false;
    
    // Vérifier si c'est le slider de grille 4
    if (Grille === 3) {
      if (updateG4SliderFromTouch(mouseX, mouseY)) {
        return false;
      }
    }
    
    // Empêcher le scroll par défaut
    if (Grille === 4 && hoveredBand >= 0) {
      event.preventDefault();
    }
    return false;
  }
}

function touchMoved(event) {
  if (event.touches && event.touches.length > 0) {
    isSwipeScrolling = true;
    
    // Mettre à jour le slider si en train de dragger
    if (isG4SliderDragging && Grille === 3) {
      updateG4SliderFromTouch(mouseX, mouseY);
      event.preventDefault();
      return false;
    }
    
    // Appliquer le scroll horizontal en temps réel pour grille 4 (bandeaux)
    if (Grille === 4) {
      let deltaX = mouseX - prevTouchX;
      
      // En fullpage, scroll le bandeau sélectionné
      if (isFullPageMode && selectedBandIndex >= 0) {
        let startedOnButton = checkVirtualButtonHit(touchStartX, touchStartY, virtualButtons);
        if (!startedOnButton) {
          scrollOffsets[selectedBandIndex] += -deltaX * 2.0;
        }
      }
      // En mode normal, scroll le bandeau survolé en temps réel
      else if (hoveredBand >= 0) {
        scrollOffsets[hoveredBand] += -deltaX * 2.0;
      }
      
      prevTouchX = mouseX;
      prevTouchY = mouseY;
      event.preventDefault();
      return false;
    }
    
    prevTouchX = mouseX;
    prevTouchY = mouseY;
    return false;
  }
}

function touchEnded(event) {
  if (event.changedTouches && event.changedTouches.length > 0) {
    touchEndX = mouseX;
    touchEndY = mouseY;
    
    // Arrêter le dragging du slider
    if (isG4SliderDragging) {
      isG4SliderDragging = false;
      event.preventDefault();
      return false;
    }
    
    let deltaX = touchEndX - touchStartX;
    let deltaY = abs(touchEndY - touchStartY);
    let deltaXAbs = abs(deltaX);
    
    // Clic simple (pas de swipe)
    if (deltaXAbs < 30 && deltaY < 30) {
      // En fullpage, vérifier le bouton retour en haut à droite (mobile)
      if (isFullPageMode && isTouchDevice && Grille === 4) {
        if (touchEndX >= width - 50 && touchEndX <= width - 10 &&
            touchEndY >= 5 && touchEndY <= 35) {
          isFullPageMode = false;
          selectedBandIndex = -1;
          return;
        }
      }
      
      // Vérifier les autres boutons virtuels
      let buttonHit = checkVirtualButtonHit(touchEndX, touchEndY, virtualButtons);
      if (buttonHit) {
        handleVirtualButton(buttonHit);
      } else {
        handleInteractionClick(touchStartX, touchStartY);
      }
    }
    // En mode fullpage, swipe bas est maintenant utilisé par le geste de taille
    // Utiliser le bouton "retour" pour sortir du fullpage
    
    // Détection du swipe horizontal (pour défiler bandeaux)
    else if (deltaXAbs > 50 && deltaY < 100) {
      // Sur grille 4, le scroll a déjà été appliqué en temps réel dans touchMoved
      if (Grille === 4) {
        // Rien à faire, le scroll a déjà été géré
      } else {
        // Sur autres grilles, standardiser: droite=couleur, gauche=char
        if (deltaX > 0) {
          // Swipe droite = couleur suivante
          colorChoisi++; 
          colorChoisi = colorChoisi % colorListe.length;
        } else {
          // Swipe gauche = caractère suivant
          caractereChoisi++; 
          caractereChoisi = caractereChoisi % liste.length;
        }
      }
    }
    // Détection du swipe vertical (seulement pour taille en grille 4)
    else if (deltaY > 80 && deltaXAbs < 50) {
      // Sur grille 5, swipe vertical = changer la taille
      if (Grille === 4) {
        let numWeightsNow = variantFonts[currentVariant].length;
        let isSymb = isSymbolesVariant[currentVariant];
        let numBandsNow = isSymb ? numWeightsNow : numWeightsNow * 2;
        let maxRatio = 0.95;
        if (numBandsNow > 6) maxRatio = 0.75;
        if (numBandsNow > 8) maxRatio = 0.60;
        let maxScale = maxRatio / 0.75;
        
        if (touchEndY < touchStartY) {
          // Swipe haut = augmenter la taille
          fontScaleG5 = min(fontScaleG5 + 0.15, maxScale);
        } else {
          // Swipe bas = diminuer la taille
          fontScaleG5 = max(fontScaleG5 - 0.15, 0.3);
        }
      }
    }
    
    isSwipeScrolling = false;
    event.preventDefault();
    return false;
  }
}

// Gérer les appuis sur les boutons virtuels
function handleVirtualButton(buttonKey) {
  switch(buttonKey) {
    case 'grille':
      Grille++; 
      Grille = Grille % 5;
      break;
    case 'back':
      // Bouton retour en fullpage
      isFullPageMode = false;
      selectedBandIndex = -1;
      break;
    case 'font':
      fontChoisi++; 
      fontChoisi = fontChoisi % fontListe.length;
      FontChoisi++; 
      FontChoisi = FontChoisi % FontListe.length;
      break;
    case 'prevChar':
      caractereChoisi++; 
      caractereChoisi = caractereChoisi % liste.length;
      if (Grille === 3) {
        chiffreChoisi = (chiffreChoisi + 1) % chiffres.length;
      }
      break;
    case 'nextColor':
      colorChoisi++; 
      colorChoisi = colorChoisi % colorListe.length;
      colorChoisiFi++; 
      colorChoisiFi = colorChoisiFi % colorListeFi.length;
      break;
    case 'preset':
      // Changer le preset de grille 4
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
      break;
    case 'plus':
      fontScaleG5 = min(fontScaleG5 + 0.1, 1.5);
      break;
    case 'minus':
      fontScaleG5 = max(fontScaleG5 - 0.1, 0.3);
      break;
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (g5) {
    g5.resizeCanvas(windowWidth, windowHeight);
  }
  if (footerGfx) {
    footerGfx.resizeCanvas(windowWidth, windowHeight);
  }
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
 for (let x = marge; x <width-marge; x+=grille) { for (let y = marge; y<height-100; y+=grille) {
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
 let textPC = 'Souris : orienter les caractères  |  F : changer de font  |  ← : changer de caractère  |  → : changer de couleur  |  A : changer de grille';
 let textMobile = '↻ : Grille  |  F : Font  |  ← : Char  |  → : Couleur  |  Swipe ↑↓ : Grille';
 drawFooterControls(getControlsText(0, textPC, textMobile));
}


function grille2(){
let level = amp.getLevel(); let bass;
fft.analyze();
bass = fft.getEnergy("bass");
let bassConverti = map(bass,0,255,0,1)
temps = temps+level*0.5;
for (let x = marge+60; x <width-marge; x+=grille+80) {
for (let y = marge+60; y<height-100; y+=grille+80) {
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
 let textPC = 'Souris : interaction  |  F : changer de font  |  → : changer de couleur  |  A : changer de grille';
 let textMobile = 'Tap : Interaction  |  F : Font  |  → : Couleur  |  Swipe ↑↓ : Grille';
 drawFooterControls(getControlsText(1, textPC, textMobile));
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
  for (let y = marge; y<height-100; y+=mouseX/10+grille) {
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
  let textPC = 'Souris : densité de la grille  |  F : changer de font  |  ← : changer de caractère  |  → : changer de couleur  |  A : changer de grille';
  let textMobile = 'Tap : Densité  |  F : Font  |  ← : Char  |  → : Couleur  |  Swipe ↑↓ : Grille';
  drawFooterControls(getControlsText(2, textPC, textMobile));
  }

  function grille4(){
    
  let level = amp.getLevel(); let bass;
  fft.analyze();
  bass = fft.getEnergy("bass");
  let bassConverti = map(bass,0,255,0,1)
  temps = temps+level*0.5;
  
  // Calculer les limites des zones basées sur des proportions (identiques sur PC et mobile)
  let zone1Limit = width / 4;
  let zone2Limit = width / 2;
  let zone3Limit = (width * 3) / 4;
  
  // Afficher les délimiteurs visuels des zones (PC uniquement)
  if (!isTouchDevice) {
    stroke(0, 0, 50);
    strokeWeight(2);
    line(zone1Limit, marge4, zone1Limit, height - marge4 - 100);
    line(zone2Limit, marge4, zone2Limit, height - marge4 - 100);
    line(zone3Limit, marge4, zone3Limit, height - marge4 - 100);
  }
  
  // En mobile, afficher le slider
  if (isTouchDevice) {
    drawG4Slider();
  }
  
for (let x = marge4; x < width - marge4; x += grille4Size){
for (let y = marge4; y < height - 100; y += grille4Size) {
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
 textFont(FontListe[FontChoisi]);
 
 // Déterminer la zone (identique sur PC et mobile - basée sur proportions)
 let currentZone;
 if (isTouchDevice) {
   // Sur mobile, utiliser le slider (4 zones)
   currentZone = getG4ZoneFromSlider();
 } else {
   // Sur PC, utiliser mouseX (4 zones - proportionnelles à la largeur)
   if (mouseX <= zone1Limit) currentZone = 1;      // Lettres figées
   else if (mouseX <= zone2Limit) currentZone = 2;  // Lettres aléa
   else if (mouseX <= zone3Limit) currentZone = 3; // Chiffres aléa
   else currentZone = 4;                           // Chiffres figés
 }
 
 // Changer les caractères aléatoirement SEULEMENT en zones 2 et 3
 // Zone 2 : Lettres aléa - change caractereChoisi ET colorChoisi
 if (currentZone === 2) {
   caractereChoisi++; caractereChoisi = caractereChoisi % liste.length;
   colorChoisi++; colorChoisi = colorChoisi % colorListe.length;
 }
 // Zone 3 : Chiffres aléa - change chiffreChoisi ET colorChoisi
 if (currentZone === 3) {
   chiffreChoisi++;
   chiffreChoisi = chiffreChoisi % chiffres.length;
   colorChoisi++; colorChoisi = colorChoisi % colorListe.length;
 }
 
 // Appliquer la couleur appropriée selon la zone
 if (currentZone === 4) {
   fill(colorListeFi[colorChoisiFi], noise3d, noise3d*0.2);
 } else {
   fill(colorListe[colorChoisi], noise3d, noise3d*0.2);
 }
 
 // zone 1 → lettres figées
if (currentZone === 1) {
  text(Liste[caractereChoisi], -16.5, 1);
}

// zone 2 → lettres aléatoires
else if (currentZone === 2) {
  text(Liste[caractereChoisi], -16.5, 1);
}

// zone 3 → chiffres aléatoires
else if (currentZone === 3) {
  text(chiffres[chiffreChoisi], -16.5, 1);
}

// zone 4 → chiffres figés
else if (currentZone === 4) {
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
 let textPC = 'Souris : zones d\'interaction  |  F : changer de font  |  G : changer de preset  |  ← → : caractère/couleur  |  A : changer de grille';
 let textMobile = 'Slider: Zones  |  F : Font  |  G : Preset  |  ← → : Char/Couleur  |  Swipe ↑↓ : Grille';
 drawFooterControls(getControlsText(3, textPC, textMobile));
}

// ========== SLIDER POUR GRILLE 4 MOBILE ==========
function drawG4Slider() {
  if (!isTouchDevice || Grille !== 3) return;
  
  let sliderY = height - 80;
  let sliderX = 20;
  let sliderW = width - 40;
  let sliderH = 8;
  let sliderRadius = 15;
  
  // Fond du slider
  fill(0, 0, 30);
  noStroke();
  rect(sliderX, sliderY, sliderW, sliderH, 4);
  
  // 4 zones de couleur (proportionnelles aux zones)
  let zoneW = sliderW / 4;
  fill(59, 60, 50);     // Zone 1 - Lettres figées
  rect(sliderX, sliderY, zoneW, sliderH, 4);
  fill(59, 100, 50);    // Zone 2 - Lettres aléa
  rect(sliderX + zoneW, sliderY, zoneW, sliderH, 4);
  fill(327, 100, 50);   // Zone 3 - Chiffres aléa
  rect(sliderX + zoneW * 2, sliderY, zoneW, sliderH, 4);
  fill(277, 100, 50);   // Zone 4 - Chiffres figés
  rect(sliderX + zoneW * 3, sliderY, zoneW, sliderH, 4);
  
  // Délimiteurs visuels sur le slider (alignés avec les zones)
  stroke(0, 0, 60);
  strokeWeight(1);
  line(sliderX + zoneW, sliderY - 5, sliderX + zoneW, sliderY + sliderH + 5);
  line(sliderX + zoneW * 2, sliderY - 5, sliderX + zoneW * 2, sliderY + sliderH + 5);
  line(sliderX + zoneW * 3, sliderY - 5, sliderX + zoneW * 3, sliderY + sliderH + 5);
  
  // Curseur
  noStroke();
  let cursorX = sliderX + (g4SliderValue / 3) * sliderW;
  fill(0, 0, 80);
  circle(cursorX, sliderY + sliderH/2, sliderRadius);
  
  // Texte des zones
  fill(0, 0, 100);
  textSize(8);
  textAlign(CENTER, CENTER);
  textFont('Arial');
  text('Lt.fig', sliderX + zoneW/2, sliderY - 12);
  text('Lt.aléa', sliderX + zoneW*1.5, sliderY - 12);
  text('Ch.aléa', sliderX + zoneW*2.5, sliderY - 12);
  text('Ch.fig', sliderX + zoneW*3.5, sliderY - 12);
}

function updateG4SliderFromTouch(touchX, touchY) {
  if (!isTouchDevice || Grille !== 3) return;
  
  let sliderY = height - 80;
  let sliderX = 20;
  let sliderW = width - 40;
  let sliderH = 8;
  let sliderRadius = 15;
  
  // Vérifier si le touch est sur le slider (avec marge)
  if (touchY >= sliderY - sliderRadius && touchY <= sliderY + sliderH + sliderRadius &&
      touchX >= sliderX && touchX <= sliderX + sliderW) {
    
    // Calculer la position en fonction du touch (0-3 pour 4 zones)
    let relX = touchX - sliderX;
    g4SliderValue = constrain((relX / sliderW) * 3, 0, 3);
    isG4SliderDragging = true;
    return true;
  }
  return false;
}

function getG4ZoneFromSlider() {
  // 0-0.75 = zone 1 (lettres figées)
  // 0.75-1.5 = zone 2 (lettres aléa)
  // 1.5-2.25 = zone 3 (chiffres aléa)
  // 2.25-3 = zone 4 (chiffres figés)
  if (g4SliderValue < 0.75) return 1;
  if (g4SliderValue < 1.5) return 2;
  if (g4SliderValue < 2.25) return 3;
  return 4;
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
    // Scroll du bandeau fullpage - appliquer directement pour meilleure synchronisation
    if (scrollWheelDelta !== 0) {
      scrollOffsets[bandIndex] += scrollWheelDelta;
      scrollWheelDelta = 0;
    } else {
      scrollOffsets[bandIndex] += 1;  // Scroll automatique lent
    }
    
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
  let headerSize = isTouchDevice ? 13 : 16;
  g.textSize(headerSize);
  g.textAlign(LEFT, CENTER);
  let headerTextPC = `← ESC : retour | Scroll : défiler | ↑↓ : taille`;
  let headerTextMobile = `Swipe ← → : Défiler | Swipe ↑↓ : Taille | Tap ← : Retour`;
  let headerMsg = getControlsText(4, headerTextPC, headerTextMobile);
  g.text(headerMsg, 15, 20);
  
  // Afficher le bouton retour en fullpage (mobile)
  if (isTouchDevice) {
    g.fill(100, 0, 0);
    g.rect(width - 50, 5, 40, 30, 3);
    g.fill(0, 0, 100);
    g.textSize(14);
    g.textAlign(CENTER, CENTER);
    g.text('←', width - 30, 20);
  }
  
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
    let btnTextSize = isTouchDevice ? 11 : 14;
    g.textSize(btnTextSize);
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
    scrollOffsets[hoveredBand] += scrollWheelDelta;
    scrollWheelDelta = 0;
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
  
  // Afficher le buffer 2D sur le canvas WEBGL
  image(g, 0, 0);
  
  // Afficher les contrôles du footer avec les boutons virtuels
  let footerTextPC = 'Scroll : défiler le bandeau survolé  |  ↑↓ : taille des caractères  |  A : changer de grille';
  let footerTextMobile = 'Swipe ← → : Défiler  |  ↑↓ : Taille  |  G : Grille  |  Tap : Fullpage';
  drawFooterControls(getControlsText(4, footerTextPC, footerTextMobile));
}
