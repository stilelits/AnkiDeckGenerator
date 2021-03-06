//script behavior options

/*
this enables a few features that are useful for debugging, primarily forcing new imports and limiting chunk count.
it should almost always be false, unless you really know what you're doing, or if you are me
*/
var DEBUG_MODE = false; 

/*
this is the path to the downloadable JMdict, and is not expected to ever change
*/
var JMDICT_PATH = 'http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz'; 

/*
if you don't have 7zip, it's freely available here: https://www.7-zip.org/download.html
make sure that this path points to "7z.exe", and not "7-ZipPortable.exe" or "7zG.exe" or anything else
also note that backslashes in file paths must be DOUBLED in order for javascript to read them correctly
*/ 
var ZIP_EXECUTABLE_PATH = 'C:\\Users\\stile\\OneDrive\\Documents\\!Apps\\7-ZipPortable\\App\\7-Zip64\\7z.exe'; 

/*
set to null if you want to include ALL words...which is NOT recommended, as even these tags are a HUGE set of words.
i am using ['news1', 'ichi1', 'spec1', 'spec2', 'gai1'] simply because that is what EDict uses to identify common words, 
but there are currently (as of 6/12/2022) over 19000 entries that fit this criteria!
if you are not interested in spending literal years learning a single deck, i HIGHLY recommend cutting this selection down
*/
var INCLUDED_TAGS = ['news1', 'ichi1', 'spec1', 'spec2', 'gai1']; 

/*
if true, your deck will contain cards with a prompt like "一 (kanji)":
you should be able to respond with AT LEAST ONE word using that kanji.
most kanji have dozens or hundreds of entries, so it's not reasonable to expect yourself to recall all or even most of them on the spot.
i find it's helpful to respond with at least one example of each READING for the kanji...
for example, when i see "一 (kanji)", i expect myself to respond with いち, ひとつ, and ついたち
*/
var CREATE_KANJI_CARDS = true; 

/*
if true, your deck will contain cards with a prompt like "一":
you should be able to respond with ALL readings and definitions for that vocab word.
the majority of vocab cards only have a single reading, but there are a few that have two,
and only three words (主, 退く, and 否)) currently have three or more pronunciations,
so you should be able to respond with ALL of them
*/
var CREATE_VOCAB_CARDS = true; 

/*
if true, your deck will contain cards with a prompt like "いち":
you should be able to respond with AT LEAST ONE word using that pronunciation
if you are super hardcore you can require ALL homophones, but i really don't recommend that.
unlike vocab cards, it's quite common for a single reading to correspond to several different words,
each of which would be strongly implied by context anyway, so i think it's fine to just respond with one.
several people i've talked to about this feel strongly that this type of card is not necessary AT ALL,
but i personally have found it VERY helpful, particularly when reading media without kanji, or listening.
if you don't want them, simply set this to false, and your deck will not have them.
(you can also simply delete all cards with the READING_CARD tag)
*/
var CREATE_READING_CARDS = true; 

/*
if true, words that are ONLY katakana will NOT have cards created for them 
most of the pure katakana words are loanwords that clutter things up, so i would recommend keeping this option enabled
*/
var EXCLUDE_PURE_KATAKANA = true; 

/*
if true, words without kanji will sort to the BEGINNING of the deck.
i personally do not recommend this, because it means you will have to get through over 600 entries before you even get to your first kanji,
and many of these entries are onamatopoeia (sound words like "whoosh"), or grammatical constructs, or kana-only forms of words that have kanji elsewhere.
i tried sorting them to the top when i first started using this deck, and i bogged down almost immediately. your mileage may vary.
*/
var NON_KANJI_SORT_TOP = false; 

/*
what to display part of speech in: e.g. "[n, adj-na]" or "<n, adj-na>"
*/
var WRAP_POS_IN = ['[', ']:'];
/*
what to display sense counts in: e.g. "(1) definition (2) another definition" or "<1> definition <2> another definition"
*/
var WRAP_SENSECOUNT_IN = ['<', '>']; 
/*
what to display informational stuff in: e.g. "{参 is used in legal documents}" or "(参 is used in legal documents)"
*/
var WRAP_INF_IN = ['(', ')']; 

/*
where to display the part of speech for entries. 
if true:  "[n, adj-na] (1) first noun definition (2) second noun definition [v5] (3) verb definition"
if false: "(1) [n, adj-na] first noun definition (2) second noun definition (3) [v5] verb definition"
(i personally prefer "true" here, but it might look better to you the other way)
*/
var POS_BEFORE_SENSE_NUMBER = true;    

/*
the next part defines the ORDER in which words will be introduced, which is the core concept behind this entire deck.

makeGradeLevelsBySchoolYear(): 
you will see all the words you can make with grade 1 kanji first, then the words you can make with grade 1 and grade 2 kanji, and so forth.
it is unlikely that these character sets will change often, but if they release an updated jouyou list or whatever,
you can modify the function makeGradeLevelsBySchoolYear() which is purposely located at the VERY bottom of this script.

makeGradeLevelsByStrokeCount():
use this line to sort them by stroke count, according to https://en.wikipedia.org/wiki/List_of_kanji_by_stroke_count
this is experimental, but it could appeal to some types of learners...
for example, going by grade level you would encounter 空 (grade 1) before 工 (grade 2), and long before 穴 (grade 6),
but going by stroke count you would encounter 工 (3 strokes), 穴 (5 strokes), and then 空 (8 strokes),
so you would build on a strong foundation of kanji components which COULD make it easier to learn complex kanji later on.
the downside here is there are a ton of very useful, very common characters with higher stroke counts,
so if you do it this way, it will be a long time before you get to those.
i'd be really interested to hear from anyone who tries studying this way, though! if you have the patience, it could really pay off.

makeGradeLevelsCustom():
modify the contents of this function directly in order to define a custom sort order.
you do not have to list EVERY kanji...anything that is NOT included will simply be tagged as hyougai and sorted to the bottom of the deck.
for example, you could use the kanji from each chapter of your textbook, or from volumes of a manga,
or anything else you like...just make sure you maintain the correct format! if it gets screwed up too badly,
download a fresh version of this script and use it as a template.
*/

/*
any of the "var gradeLevels = " lines can be disabled by putting // in front of it, or enabled by removing the //
note that you can only have exactly ONE of these lines active at once...it will cause an error if you try to have zero, or more than one
*/
var gradeLevels = makeGradeLevelsBySchoolYear();
//var gradeLevels = makeGradeLevelsByStrokeCount(); 
//var gradeLevels = makeGradeLevelsCustom(); 
function makeGradeLevelsCustom(){ if (gradeLevels){fatal('You can only have one grade level type per deck!');} DECK_TITLE = 'CUSTOM.';
 return [
  ['firstsetoffkanji LINE_ENDS_WITH_COMMA', '一七三上下中九二五人休'],
  ['nextsetofkanji LINE_ENDS_WITH_COMMA','万丸交京今会体何作元兄光公'],
  ['lastsetofkanji NOTICE_THERE_IS_NO_COMMA_ON_THE_LAST_LINE_OF_KANJI','丁世両主乗予事仕他代住']
 ];
}

/*
because normal alphabetization jumbles up kanji in non-intuitive ways, this allows you to control how they sort
for example, if you simply put the kanji for 1-10 into excel and sort them alphabetically,
they will sort in order 一七三九二五八六十四, which i think is just insane...
the first line here forces them to sort in numerical order, and the other lines are other sequences that i thought made sense.
please note, this has NO impact on the grade level, and shorter words will still sort before longer words.
*/
var kanjiSubstitutionsForSorting = [ 
 '零〇一二三四五六七八九十百千万億兆京垓𥝱秭穣溝澗正載極', //each kanji string in this array will force those kanji to always sort together and in that order
 '上中下左右内外来前先入出',
 '明朝昼夕日月年火水木金土曜風空天',
 '大小多少',
 '村町市道府県',
 '男女親子父母兄弟姉妹',
 '春夏秋冬',
 '北南東西'
]

/*******************************************************\
*                                                       *
* YOU SHOULDN'T NEED TO ALTER ANYTHING BELOW THIS POINT *
*                                                       *
\*******************************************************/

//script options that are useful for debugging

var DEBUG_IMPORT_PATH = 'C:\\Users\\stile\\OneDrive\\Documents\\!Dev\\Anki\\JMdict_e_DEBUG';

var FOLDER_DELIM = '\\';

var DEFAULT_CHUNK_SIZE = 6000; //roughly 100kB per 6000 lines, will result in ~600 total chunks for all of JMdict as of 6/11/2022

var MAX_CHUNKS = !DEBUG_MODE ? -1 : 10; //only applies if we are in debug mode, limits the number of chunks to 10 (or whatever you put there)

var ALWAYS_IMPORT_NEW_DICTIONARY = DEBUG_MODE; //when this is false, the script will attempt to use pre-existing dictionary and deck files to save time

var jmsentencepath = 'http://ftp.edrdg.org/pub/Nihongo/JMdict_e_examp.gz'; //TODO: integrate example sentences into the cards

//order and sorting of columns in the workbook...the order doesn't matter, but MUST be consistent when loading cards from an existing workbook!
var COLUMNS = {};
var col=1;
COLUMNS.ID = col++;
COLUMNS.KANJI = col++;
COLUMNS.READING = col++;
COLUMNS.SENSE = col++;
COLUMNS.TAGS = col++;
COLUMNS.HEXGRADE = col++;
COLUMNS.SORTGRADE = col++;
COLUMNS.KANJILENGTH = col++;
COLUMNS.READINGLENGTH = col++;
COLUMNS.KANJISORT = col++;
function sortDictionary(rng){
 var xlAscending = 1;
 var xlDescending = 2;
 var sortColumns = [ //this is traversed BACKWARDS, so the highest priority columns should go at the TOP of this array
  [COLUMNS.SORTGRADE,     xlAscending],
  [COLUMNS.KANJILENGTH,   xlAscending],  
  [COLUMNS.KANJISORT,     xlAscending],  
  [COLUMNS.READINGLENGTH, xlAscending],  
  [COLUMNS.READING,       xlAscending]
 ];
 for (var i=sortColumns.length - 1;i>=0;i--){
  rng.Sort(rng.Cells(1,sortColumns[i][0]), sortColumns[i][1]);
 }
}

var ANKI_COLUMN_FRONT = 1;
var ANKI_COLUMN_BACK = 2;
var ANKI_COLUMN_SORTBY = 3;
var ANKI_COLUMN_TAGS = 4;

//global variables

var DECK_TITLE;
var importedNewDictionary = false;
var NONE = "NONE";
if (gradeLevels.length > 34){fatal('Sorry, cannot handle more than 34 distinct grade levels, please remove or consolidate some and try again');}
for (var i=0;i< gradeLevels.length;i++){ //turn the grade level strings into grade level arrays to speed up processing
 switch (gradeLevels[i].length){
 case 1: //if there is only one member in the array, put it into [1] and create null tags for [0]
  gradeLevels[i].push(gradeLevels[i][0].split(''));
  gradeLevels[i][0] = [];
  break;
 case 2: //if there are two members in the array, split both
  gradeLevels[i][0] = gradeLevels[i][0].split(' '); //note that tags must split on space...
  gradeLevels[i][1] = gradeLevels[i][1].split('');  //...while kanji do not need a delimiter as each one is a single character
  break;
 default:
  fatal('Incorrect format in gradeLevels array: each line should be an array of exactly one or two elements'); 
 }
}
for (var i=0;i<kanjiSubstitutionsForSorting.length;i++){ //turn the kanji substitution strings into arrays to speed up processing
 kanjiSubstitutionsForSorting[i] = kanjiSubstitutionsForSorting[i].split('');
}
var fso = new ActiveXObject("Scripting.FileSystemObject"); //fso so we can interact with files
{ //include this block for any flavor of javascript that does not natively support Array.includes() or Array.indexOf()
 Array.prototype.includes = null;  
 Array.prototype.indexOf = null;  
 if (!Array.prototype.includes) {Array.prototype.includes = function (search) {return !!~this.indexOf(search);}  
 }  
 if (!Array.prototype.indexOf) {  
  Array.prototype.indexOf = (function (Object, max, min) {  
   "use strict";  
   return function indexOf(member, fromIndex) {  
    if (this === null || this === undefined) throw TypeError("Array.prototype.indexOf called on null or undefined");  
    var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len);  
    if (i < 0) i = max(0, Len + i); else if (i >= Len) return -1;  
    if (member === void 0) {  
     for (; i !== Len; ++i) if (that[i] === void 0 && i in that) return i;  
    } else if (member !== member) {  
     for (; i !== Len; ++i) if (that[i] !== that[i]) return i;  
    } else for (; i !== Len; ++i) if (that[i] === member) return i;  
     return -1;  
    };  
   }
  )(Object, Math.max, Math.min);  
 } 
}

//actual script logic

if (DEBUG_IMPORT_PATH && !fso.FileExists(DEBUG_IMPORT_PATH)){DEBUG_IMPORT_PATH = undefined;}

if (!CREATE_KANJI_CARDS && !CREATE_VOCAB_CARDS && !CREATE_READING_CARDS){fatal('No card types selected.');}

var startTime = new Date();
var tempTime = new Date();
var tempTimes = [];

var eApp = new ActiveXObject('Excel.Application');
eApp.Visible = true;
var deckBook = eApp.Workbooks.Add();
var deckSheet = deckBook.Worksheets(1);
markTime('Opening Excel');

var dictExtractedFile;
if (DEBUG_IMPORT_PATH){
 dictExtractedFile = fso.GetFile(DEBUG_IMPORT_PATH);
} else {
 eApp.StatusBar = "Downloading dictionary...";
 var dictDownloaded = download(JMDICT_PATH);
 if (dictDownloaded == -1){fatal('Could not download ' + dictpath);}
 markTime('Downloading dictionary');

 if (!ZIP_EXECUTABLE_PATH || !fso.FileExists(ZIP_EXECUTABLE_PATH)){
  fatal('Cannot extract without a valid 7z.exe file in ZIP_EXECUTABLE_PATH. Set this value in the script file and try again.');
 }

 eApp.StatusBar = "Extracting dictionary...";
 var dictExtractFolder = extract(dictDownloaded);
 if (dictExtractFolder == -1){fatal('Could not extract ' + dictDownloaded);}
 dictExtractedFile = dictExtractFolder + '\\JMdict_e';
 fso.DeleteFile(dictDownloaded);
 markTime('Extracting dictionary');
} 

var dictDate = getFileDate(dictExtractedFile) + '_JMDICT';
var savePathStem = localFolder() + dictDate + '.';
var dictBookPath = savePathStem + DECK_TITLE + 'DICTIONARY.xlsx';
var deckBookPath = savePathStem + DECK_TITLE + 'ANKI_DECK.xlsx';
var csvPath = savePathStem + DECK_TITLE + 'ANKI_DECK.csv';
if (ALWAYS_IMPORT_NEW_DICTIONARY && fso.FileExists(csvPath)) {fso.DeleteFile(csvPath);}

var outLine = 0; //the actual first row is 1, but this will always be incremented before output

if (DEBUG_IMPORT_PATH){ALWAYS_IMPORT_NEW_DICTIONARY = true;}
if (ALWAYS_IMPORT_NEW_DICTIONARY && fso.FileExists(dictBookPath)) {fso.DeleteFile(dictBookPath);}

if (!DEBUG_MODE && !fso.FileExists(csvPath)){
 if (!DEBUG_MODE && fso.FileExists(deckBookPath)){
  deckBook.Close();
  deckBook = eApp.Workbooks.Open(deckBookPath);
  deckSheet = deckBook.Worksheets(1);
  eApp.ScreenUpdating = !DEBUG_MODE;
  markTime('Opening existing deck workbook');
 } else {
  //if (!DEBUG_MODE){deckBook.SaveAs(deckBookPath);}
  eApp.ScreenUpdating = !DEBUG_MODE;  
  var dictBook = null;
  var dictSheet = null;
  var eAppHidden = new ActiveXObject('Excel.Application');
  eAppHidden.Visible = DEBUG_MODE; //only show it if we ARE in debug mode
  if (DEBUG_IMPORT_PATH){eAppHidden.Visible = true;}
  if (fso.FileExists(dictBookPath)){ //WScript.Echo('Workbook found, opening.');
   dictBook = eAppHidden.Workbooks.Open(dictBookPath);
   dictSheet = dictBook.Worksheets(1);
   markTime('Opening existing dictionary workbook');
  } else { //WScript.Echo("Generating " + dictWorkbook);
   var chunkFolder = dictExtractedFile + "_CHUNKS\\";
   var chunks = makeXmlChunks(dictExtractedFile);
   if (chunks == -1){fatal('Could not create chunks.');}
   dictBook = eAppHidden.Workbooks.Add();
   dictSheet = dictBook.Worksheets(1);
			if (fso.FileExists(deckBookPath)) {fso.DeleteFile(deckBookPath);}
   if (!DEBUG_MODE){dictBook.SaveAs(dictBookPath);}
   for (var i=0;i<chunks.length;i++){
    eApp.StatusBar = 'Importing chunk ' + (i+1) + ' of ' + chunks.length + '...(' + Math.round(100 * i / chunks.length) + '% complete)';
    importChunk(chunks[i]);
    if (!DEBUG_MODE){dictBook.Save();}
   }
   if (!dictSheet.Cells(1,1).Value2){fatal('No entries imported from dictionary!');}
   markTime('Generating dictionary workbook');
   var importedNewDictionary = true;
  }
		
  sortDictionary(dictSheet.UsedRange);
  dictSheet.Cells.WrapText = false;
  if (!DEBUG_MODE){dictBook.Save();}
 
  makeDeck(dictSheet.UsedRange, deckSheet);
  markTime('Generating flashcard workbook');
		//if (!DEBUG_MODE){deckBook.Save();}
		
		exportToCSV(deckSheet.UsedRange);
  markTime('Exporting deck to CSV file');
	}	
} else {
	markTime('Finding updated CSV file');
}

//clean up and close out the script

if(DEBUG_MODE){
 eAppHidden.Visible = true;
} else {
 dictBook.Saved = true;
 dictBook.Close();
 eAppHidden.Quit();
}
if (fso.FolderExists(dictExtractFolder)){fso.DeleteFolder(dictExtractFolder);}
eApp.Visible = true;
eApp.ScreenUpdating = true;
eApp.StatusBar = false;
if (!DEBUG_MODE){
 deckBook.Saved = true;
 deckBook.Close();
 eApp.Quit();
}
if (importedNewDictionary){
 tempTimes = ['New dictionary version ' + dictDate + ' was found!\nCreated ' + csvPath + '\n'].concat(tempTimes);
}
finalTime('Closing out script');

//functions
function makeSortableKanjiWord(word){
 var result = '"' + word + '"'; //wrap in quotes so that the replacement can correctly identify single-kanji words
 for (var i=0;i<kanjiSubstitutionsForSorting.length;i++){
  for (var j=0;j<kanjiSubstitutionsForSorting[i].length;j++){
   var arr = result.split(kanjiSubstitutionsForSorting[i][j]);
   if (arr.length > 1){
    result = arr.join(String.fromCharCode(i+65) + String.fromCharCode(j+65));
   }
  }
 } 
 result = result.substring(1, result.length - 1); //trim off the quotes
 return result;
}

function markTime(msg){
 var elapsed = new Date() - tempTime;
 tempTimes.push([msg, elapsed]); 
 tempTime = new Date();
}

function finalTime(msg){
 markTime(msg);
 var elapsed = new Date() - startTime;
 var finalMsg = ['Script completed in ' + msToText(elapsed), ''];
 for (var i=0;i<tempTimes.length;i++){
  if (tempTimes[i][0]){
   if (tempTimes[i][1]){
    finalMsg.push(tempTimes[i][0] + ': ' + msToText(tempTimes[i][1]));
   } else {
    finalMsg.push(tempTimes[i][0]);
   }
  }
 }
 WScript.Timeout = 30; //automatically kill this script after 30 seconds
 WScript.Echo(finalMsg.join('\n'));
}

function msToText(ms){
 var num = ms;
 if (num < 1000){return Math.round(num,    0) + 'ms';} num /= 1000;
 if (num <   60){return Math.round(num,    3) + 's';}  num /= 60;
 if (num <   60){return Math.round(num,    1) + 'm';}  num /= 60;
 if (num <   60){return Math.round(num,    1) + 'h';}  num /= 24;
 if (num <    7){return Math.round(num,    1) + 'd';}
 if (num <  365){return Math.round(num / 7,1) + 'w';}  num /= 365;
 return num + 'y';
} 

function exportToCSV(rng){
 if (!rng.Cells(1,1).Value2){fatal('Could not export deck to CSV');}
 var stream = new ActiveXObject('ADODB.Stream');
 stream.LineSeparator = 10 // 10 = line feed
 stream.Type = 2; //2 = adTypeText 
 stream.CharSet = 'UTF-8';
 stream.Open();
 var rowCount = rng.Rows.Count;
 for (var i=1;i<=rowCount;i++){
  eApp.StatusBar = 'Exporting card ' + i + ' of ' + rowCount + ' to CSV...(' + Math.round(100 * i / rowCount) + '% complete)';
  var csvLine = [];
  for (var j=1;j<=4;j++){
   var csvVal = rng.Cells(i,j).Value2;
   if (csvVal.split){ //sometimes the value will just be a number, and javascript won't treat it as a string, so need to check if it has this method
    csvVal = csvVal.split('"').join('""');//note: must replace " with "" for the fields to work properly in CSV
   }
   csvLine.push(csvVal); 
  }
  stream.WriteText('"' + csvLine.join('","') + '"', 1); //1 = write line by line
 }
 stream.SaveToFile(csvPath, 2);
 stream.Close();
}

function makeDeck(rng, deckSheet){ //WScript.Echo('making deck');
 var VOCAB_CARD = 0;
 var READING_CARD = 1;
 var KANJI_CARD = 2;
 
 var allKanji = {};
 for (var i=0;i<gradeLevels.length;i++){
  for (var j=0;j<gradeLevels[i][1].length;j++){
   allKanji[gradeLevels[i][1][j]] = 0;
  }
 }
 
 var vocabs = {};
 var readings = {};
 var kanjis = {};
 var cards = [];
 
 var i = 0;
 var rowCount = rng.Rows.Count;
 while (++i <= rowCount){
  eApp.StatusBar = 'Collecting dictionary entry ' + i + ' of ' + rowCount + '...(' + Math.round(100 * i / rowCount) + '% complete)';
  var vocab = rng.Cells(i,COLUMNS.KANJI).Value2;
  var reading = rng.Cells(i,COLUMNS.READING).Value2;
  var sense = rng.Cells(i,COLUMNS.SENSE).Value2;
  
  for (var kanji in allKanji){
   if (vocab.split(kanji).length > 1){
    if (allKanji[kanji] == 0){
     kanjis[kanji] = [];
     if (CREATE_KANJI_CARDS){cards.push([KANJI_CARD, kanji]);}
     allKanji[kanji] = 1;
    }
    kanjis[kanji].push(vocab + ' (' + reading + ')');
    kanjis[kanji].push(sense);    
   }
  }
  
  if (vocab != reading){
   if (!vocabs[vocab]){
    vocabs[vocab] = [];
    if (CREATE_VOCAB_CARDS){cards.push([VOCAB_CARD, vocab]);}
   }
   vocabs[vocab].push(reading);
   vocabs[vocab].push(sense);  
  }
  
  if (!readings[reading]){
   readings[reading] = [];
   if (CREATE_READING_CARDS){cards.push([READING_CARD, reading]);}
  }
  readings[reading].push(vocab);
  readings[reading].push(sense);
 }
 
 var cardCount = cards.length;
 for (var i=0;i<cardCount;i++){
  eApp.StatusBar = 'Generating card ' + (i + 1) + ' of ' + cardCount + '...(' + Math.round(100 * i / cardCount) + '% complete)';
  switch(cards[i][0]){
  case VOCAB_CARD:
   deckSheet.Cells(i+1,ANKI_COLUMN_FRONT).Value2 = cards[i][1];
   deckSheet.Cells(i+1,ANKI_COLUMN_BACK).Value2 = makeCardBack(vocabs[cards[i][1]]);
   deckSheet.Cells(i+1,ANKI_COLUMN_TAGS).Value2 = makeTagsForWord(cards[i][1]).concat(['VOCAB_CARD']).join(' '); 
   break;
  case READING_CARD:
   deckSheet.Cells(i+1,ANKI_COLUMN_FRONT).Value2 = cards[i][1];
   deckSheet.Cells(i+1,ANKI_COLUMN_BACK).Value2 = makeCardBack(readings[cards[i][1]]);
   deckSheet.Cells(i+1,ANKI_COLUMN_TAGS).Value2 = makeTagsForWord(readings[cards[i][1]][0]).concat(['READING_CARD']).join(' '); 
   break;
  case KANJI_CARD:
   deckSheet.Cells(i+1,ANKI_COLUMN_FRONT).Value2 = cards[i][1] + ' (kanji)';
   deckSheet.Cells(i+1,ANKI_COLUMN_BACK).Value2 = makeCardBack(kanjis[cards[i][1]]);
   deckSheet.Cells(i+1,ANKI_COLUMN_TAGS).Value2 = makeTagsForWord(cards[i][1]).concat(['KANJI_CARD']).join(' '); 
   break;
  default:
   fatal('Unknown card type ' + cards[i][0]);
  }
  deckSheet.Cells(i+1,ANKI_COLUMN_SORTBY).Value2 = i+1;
 }
 eApp.StatusBar = false;
 return deckSheet.UsedRange;
}

function makeCardBack(arr){
 var result = [];
 for (var i=0; i < arr.length; i += 2){
  result.push("<span onclick='toggle(this.lastChild);' data-back>" + escapeForHtml(arr[i]) + "<span style='display:none'><br>" + escapeForHtml(arr[i+1]) + "</span></span>");
 }
 return '<script>function toggle(x){if (x.style.display === "none") {x.style.display = "inline";} else {x.style.display = "none";}}</script><div id="cardBack">' + result.join('<br>') + '</div>';
}

var htmlEscapes;
function escapeForHtml(str){
	var result = str;
	if (!htmlEscapes){
		htmlEscapes = [
		 ['<', '&lt;'],
			['>', '&gt;']
		]
	}
	for (var i=0;i<htmlEscapes.length;i++){
		var arr = result.split(htmlEscapes[i][0]);
  if (arr.length > 1){
   result = arr.join(htmlEscapes[i][1]);
  }	
	}
	return result;
}

function makeTagsForWord(word){
 var result = [dictDate];
 var c = wordToGradeLevel(word).charAt(0);
 switch (c){
 case '': 
 case '0':
 case 'Z':
  return result.concat(['NO_KANJI']);  
 case 'Y':
  return result.concat(['HYOUGAI_KANJI']);
 default: 
  var i = gradeLevelLetterToNumber(c) - 1;
  return result.concat(gradeLevels[i][0]);
 }
}

function importChunk(chunkPath){ //WScript.Echo(chunkPath);
 var stream = new ActiveXObject('ADODB.Stream');
 stream.Type = 2; //2 = adTypeText 
 stream.CharSet = 'UTF-8';
 stream.Open();
 stream.LoadFromFile(chunkPath);
 stream.LineSeparator = 10 // 10 = line feed
 var xml = stream.ReadText(); //no arg = read all
 stream.Close();
 var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
 xmlDoc.loadXML(xml);
 var jmDict = xmlDoc.getElementsByTagName('JMdict')[0];
 var entries = jmDict.getElementsByTagName('entry');
 for (var i=0;i<entries.length;i++){
  importEntry(entries[i]); 
 }
}

function rawTextOf(e){
 var start = e.xml.indexOf('>&') + 2;
 var end = e.xml.indexOf(';<'); 
 return e.xml.substr(start, end - start);
}

function importEntry(entry){
 var words = {};
 var word = NONE;
 words[NONE] = {}; //create a placeholder for any readings with no kanji forms
 words[NONE].tags = [];
 words[NONE].readings = [];
 words[NONE].definition = [];
 var senses = [];
 var id;
 var raw;
 var j=0;
 var useNullKanji = false;
 var kanjiHasPriority = false;
 for (var es = new Enumerator(entry.childNodes); !es.atEnd(); es.moveNext()){
  var e = es.item();
  var restrs = [];
  var reading = NONE;
  //dictSheet.Cells(++outLine, j).Value2 = e.xml; //DEBUGG
  switch(e.tagName){
   case 'ent_seq':
    id = e.text;
    break;
   case 'k_ele':
    for (var ks = new Enumerator(e.childNodes); !ks.atEnd(); ks.moveNext()){   
     var k = ks.item();
     switch(k.tagName){
      case 'keb':
       word = k.text; //save the current word we are on for use with other elements in this k_ele
       words[word] = {};
       words[word].tags = []; //hold tags that apply to ALL readings
       words[word].readings = [];
       words[word].definition = []; //hold definitions that apply to ALL readings
       break;
      case 'ke_inf':       //load this into the sense assortment but only for this particular kanji
       words[word].tags.push(rawTextOf(k));
       words[word].definition.push('[' + k.text + ']');
       break;      
      case 'ke_pri':       //load this into the tags assortment but only for this particular kanji
       kanjiHasPriority = true;
       words[word].tags.push(k.text);
       break;      
      default:
       fatal('Unrecogized tag ' + k.tagName + ' in entry ' + id);
     }
    }
    break;
   case 'r_ele':
    for (var rs = new Enumerator(e.childNodes); !rs.atEnd(); rs.moveNext()){   
     var r = rs.item();
     switch(r.tagName){
      case 'reb':
       reading = r.text; //save the current reading we are on for use with other elements in this k_ele
       for (var word in words){
        words[word].readings[reading] = {};
        words[word].readings[reading].tags = [];
        words[word].readings[reading].definition = [];
       }
       break;
      case 're_inf':       //load this into the sense assortment but only for this particular reading
       for (var word in words){
        if (words[word].readings[reading]){
         words[word].readings[reading].tags.push(rawTextOf(r));
         words[word].readings[reading].definition.push('[' + r.text + ']');
        }
       }
       break;      
      case 're_pri':
       if (!kanjiHasPriority){ //if a reading has a priority tag, but the kanji forms do not, treat them as nokanji words
        words[NONE].tags.push(r.text);
        useNullKanji = true;
       }
       for (var word in words){
        if (words[word].readings[reading]){
         words[word].readings[reading].tags.push(r.text);
        }
       }
       break;      
      case 're_nokanji':  //mark this entry as NOT using any kanji form, by removing it from everything except the 'null' entry
       useNullKanji = true;
       for (word in words){
        if (word != NONE){words[word].readings[reading] = undefined;}
       }
       word = NONE;
       break;
      case 're_restr':    //mark this entry as only applying to ONE or MORE of the possible kanji forms
       restrs.push(r.text);
       break;      
      default:
       fatal('Unrecogized tag ' + r.tagName + ' in entry ' + id);
     }
    }
    if (restrs.length){ //if this array is EMPTY, then the reading applies to ALL words...otherwise, delete the ones that are NOT included
     for (var word in words){
      if (!restrs.includes(word)){
       words[word].readings[reading] = undefined;
      }
     }      
    }
    break;
   case 'sense':
    var sense = {};
    sense.glosses = [];
    sense.poses = [];
    sense.xrefs = [];
    sense.restr = [];
    sense.stagk = [];
    sense.stagr = [];
    sense.miscs = [];
    for (var ss = new Enumerator(e.childNodes); !ss.atEnd(); ss.moveNext()){   
     var s = ss.item();  
     switch(s.tagName){
     case 'pos':
      sense.poses.push(rawTextOf(s));     
      break;
     case 'xref':
      sense.xrefs.push(s.text);     
      break;      
     case 'lsource':
      sense.glosses.push('(' + capitalizeFirstLetter(s.getAttribute('xml:lang')) + ': "' + s.text + '")'); 
      break;     
     case 'gloss':
      var gType = s.getAttribute('g_type');
      if (gType){
       sense.glosses.push('(' + gType + ': ' + s.text + ')');
      } else {
       sense.glosses.push(s.text);
      }
      break;
     case 'dial':  //dialect. use raw text if you prefer {ksb} instead of {Kansai-ben}, i recommend the full version for clarity
					 sense.miscs.push(s.text);     
      break;
     case 's_inf': //information about the word, like "<s_inf>often derog.</s_inf>", there is NO rawTextOf to use instead!
      sense.glosses.push(WRAP_INF_IN[0] + s.text + WRAP_INF_IN[1]);     
      break;
     case 'field': //field of study, use raw text for {gardn} instead of {gardening, horticulture}
     case 'misc': //use raw text if you want {uk} instead of {word usually written using kana alone}
      raw = rawTextOf(s);
      if (raw){
       sense.miscs.push(raw); 
      } else {
       sense.miscs.push(s.text); 
      }
      break;
     case 'ant':
      sense.miscs.push('ant: ' + s.text); 
      break;     
     case 'syn':
      sense.miscs.push('syn: ' + s.text); 
      break;           
     case 'stagk':
      sense.stagk.push(s.text);     
      break;
     case 'stagr':
      sense.stagr.push(s.text);     
      break;
     default:
      fatal('Unrecogized tag ' + s.tagName + ' in entry ' + id);
     }
    }
    senses.push(sense)    
    break;   
   default:
    fatal('Unrecogized tag ' + e.tagName + ' in entry ' + id);
  }
 }
 
 for (word in words){
  
  if (!words[word]){continue;}
  if (words[word] instanceof Array) {continue;}
  if (words[word] instanceof Function) {continue;}
  if (word == NONE && !useNullKanji){continue;} 
  if (INCLUDED_TAGS && !arrayContainsAny(words[word].tags, INCLUDED_TAGS)){continue;} //WScript.Echo(word + ' passed priority check with tags ' + words[word].tags);
  
  for (reading in words[word].readings){   
   if (!words[word].readings[reading]){continue;}
   if (words[word].readings[reading] instanceof Array) {continue;}
   if (words[word].readings[reading] instanceof Function) {continue;}
   if (reading != NONE && INCLUDED_TAGS && !arrayContainsAny(words[word].readings[reading].tags, INCLUDED_TAGS)){continue;}   
   
   var outword = (word != NONE) ? word : reading;  
   if (EXCLUDE_PURE_KATAKANA && isPureKatakana(outword)){continue;}   
   
   outLine++; //increment the output only here, once we know we are using this entry!
   dictSheet.Cells(outLine, COLUMNS.ID).Value2 = id;
   dictSheet.Cells(outLine, COLUMNS.KANJI).Value2 = outword;
   dictSheet.Cells(outLine, COLUMNS.READING).Value2 = reading;
    
   var definition = word == NONE ? [] : words[word].definition.concat([]);
   if (words[word].readings[reading].definition){
    definition = words[word].readings[reading].definition.concat(definition);
   } 
    
   var lastPos = '';
   for (var senseCount = 1; senseCount <= senses.length; senseCount++){
    var sense = senses[senseCount - 1]; 
    if (sense.stagk.length && !sense.stagk.includes(word)){continue;}
    if (sense.stagr.length && !sense.stagr.includes(reading)){continue;}     
    
    if (!POS_BEFORE_SENSE_NUMBER){if (senses.length > 1)  {definition.push(WRAP_SENSECOUNT_IN[0] + senseCount + WRAP_SENSECOUNT_IN[1]);}}
    if (sense.poses.length) {
     var pos = WRAP_POS_IN[0] + sense.poses.join(', ') + WRAP_POS_IN[1];
     if (pos != lastPos){
      definition.push(pos);
      lastPos = pos;
     }
    }
    if (POS_BEFORE_SENSE_NUMBER){if (senses.length > 1)  {definition.push(WRAP_SENSECOUNT_IN[0] + senseCount + WRAP_SENSECOUNT_IN[1]);}}
    
    if (sense.miscs.length) {definition.push('{' + sense.miscs.join('} {') + '}');}
    if (sense.stagk.length || sense.stagr.length) {definition.push('(only ' + sense.stagk.concat(sense.stagr).join(', ') + ')');}
    if (sense.xrefs.length) {definition.push('(see also: ' + sense.xrefs.join(', ') + ')');}
    definition.push(sense.glosses.join(' / '));
   } 
   dictSheet.Cells(outLine, COLUMNS.SENSE).Value2 = definition.join(' ');  
    
   dictSheet.Cells(outLine, COLUMNS.TAGS).Value2 = words[word].readings[reading].tags.join(',');
    
   var grade = wordToGradeLevel(outword);
   dictSheet.Cells(outLine, COLUMNS.HEXGRADE).Value2 = "'" + grade;
   dictSheet.Cells(outLine, COLUMNS.SORTGRADE).Value2 = gradeLevelToSortLevel(grade);
   dictSheet.Cells(outLine, COLUMNS.KANJILENGTH).Value2 = outword.length;
   dictSheet.Cells(outLine, COLUMNS.READINGLENGTH).Value2 = reading.length;
   dictSheet.Cells(outLine, COLUMNS.KANJISORT).Value2 = makeSortableKanjiWord(outword);
   
  }
 }
}

function capitalizeFirstLetter(str){
 return str.charAt(0).toUpperCase() + str.substring(1);
}

function arrayContainsAny(arrToSearch, arrToFind){
 if (arrToSearch.length){
  for (var i=0;i<arrToFind.length;i++){
   if (arrToSearch.includes(arrToFind[i])){return true;}
  }
 }
 return false;
}

function wordToGradeLevel(word){
 var arr = [];
 for (var i=0;i<word.length;i++){
  arr.push(charToGradeLevel(word.charAt(i)));
 }
 arr.sort();
 arr.reverse(); //put the HIGHEST grades first...a word with levels [5, C, 2] needs to sort with the other level Cs, not the other 2s or 5s
 var result = arr.join('');
 if (result.length == 0){result = NON_KANJI_SORT_TOP ? '0' : 'Z';}
 return result;
}

function gradeLevelNumberToLetter(num){ 
 if (num >= 0){
  if (num == 0){return '';}
  if (num < 10){return num;} //javascript will be able to interpret a single digit number as a string
  if (num < 36){return String.fromCharCode(num + 55);} //65 is A, so a value of 10 would result in A, 11 would be B, etc
 }
 fatal('Invalid grade level number ' + num);
}

function gradeLevelLetterToNumber(letter){
 return parseInt(letter, 36);
}

function charToGradeLevel(c){
 for (var i=0;i<gradeLevels.length;i++){
  if (gradeLevels[i][1].includes(c)){
   return gradeLevelNumberToLetter(i + 1); //add 1 because we want levels to start at 1, not at 0 like the array is
  }
 }
 var charCode = c.charCodeAt(0);
 if (charCode >= 0x4e00 && charCode <= 0x9faf){
  return 'Y'; //hyougai kanji should sort below ALL listed kanji
 } else { 
  return ''; //blank means non-kanji...do NOT use 0 or Z here, because either way it will screw up the non-kanji sorting!
 }
}

function gradeLevelToSortLevel(gradeLevel){
 var result = 0;
 var mult;
 for (var i=0;i<gradeLevel.length;i++){
  var mult = parseInt(gradeLevel.charAt(i), 36);
  result += mult / Math.pow(36, i);
 }
 return result;
}

function makeXmlChunks(xmlFile, chunkFolder, chunkSize){ //WScript.Echo(xmlFile);  
 if (!chunkSize){chunkSize = DEFAULT_CHUNK_SIZE;}
 if (!chunkFolder){chunkFolder = xmlFile + "_CHUNKS\\";}
 
 if (fso.FolderExists(chunkFolder)){fso.GetFolder(chunkFolder).Delete();}
 fso.CreateFolder(chunkFolder);
 
 var line;
 var lines = [];
 var headerString;
 var inHeader = true;
 var chunkCount = 0;
 var chunkFile;
 var chunkFiles = [];
 var stream = new ActiveXObject('ADODB.Stream');
 stream.Type = 2; //2 = adTypeText 
 stream.CharSet = 'UTF-8';
 stream.Open();
 stream.LoadFromFile(xmlFile);
 stream.LineSeparator = 10 // 10 = line feed
 while (!stream.EOS){
  var line = stream.ReadText(-2); //-2 = read single line
  lines.push(line);
  if (inHeader){
   if (line === '<JMdict>'){
    if (chunkSize > lines.length){chunkSize -= lines.length;}
    headerString = lines.join('\n');
    inHeader = false;
    lines = [];
   }
  } else {
   if (line === '</entry>' && lines.length > chunkSize){
    lines.push('</JMdict>');
    chunkFile = chunkFolder + padWithZeros(chunkCount++, 4);
    if (MAX_CHUNKS > 0 && chunkCount > MAX_CHUNKS){break;} //DEBUGG
    eApp.StatusBar = 'Creating chunk ' + chunkCount + '...(' + Math.round(100 * stream.Position / stream.Size) + '% complete)';
    makeChunk(chunkFile, headerString, lines);
    chunkFiles.push(chunkFile);
    lines = [];
   }
  }
 } 
 chunkFile = chunkFolder + padWithZeros(chunkCount++, 4);
 makeChunk(chunkFile, headerString, lines);
 chunkFiles.push(chunkFile);
 stream.Close();
 eApp.StatusBar = false;
 return chunkFiles;
}

function makeChunk(outFile, headerString, lines){ //WScript.Echo("Making chunk: " + outFile);
 var stream = new ActiveXObject('ADODB.Stream');
 stream.Type = 2; //2 = adTypeText 
 stream.CharSet = 'UTF-8';
 stream.Open();
 stream.WriteText(headerString);
 stream.WriteText(lines.join('\n'));
 stream.SaveToFile(outFile, 2); //2 = adSaveCreateOverWrite
 stream.Close();
}

function getFileDate(file){
 if (!fso.FileExists(file)){return '0000';}
 var date = new Date(fso.GetFile(file).DateLastModified);
 return date.getFullYear() + '_' + padWithZeros(date.getMonth() + 1,2) + '_' + padWithZeros(date.getDate(),2)+ '_' + padWithZeros(date.getHours(),2)+ '_' + padWithZeros(date.getMinutes(),2)+ '_' + padWithZeros(date.getSeconds(),2);
}

function padWithZeros(num, length){
 var result = new String(num);
 while(result.length < length){result = '0' + result;}
 return result;
}

function extract(zipFile, destination){ //WScript.Echo("Extracting contents of " + zipFile);
 var destination = zipFile + '_EXTRACTED';
 var cmd = '"' + ZIP_EXECUTABLE_PATH + '" e "' + zipFile + '" -o"' + destination + '" -aoa'; //WScript.Echo(cmd);
 if (new ActiveXObject('WScript.Shell').Run(cmd, 0, true) != 0){return -1;}
 return destination;
}

function fatal(msg){
 if (eApp){
  eApp.Visible = true;
  eApp.ScreenUpdating = true;
 }
 if (eAppHidden){
  eAppHidden.Visible = true;
  eAppHidden.ScreenUpdating = true;
 }
 if (dictSheet instanceof Object && dictSheet && dictSheet.UsedRange){
  dictSheet.UsedRange.WrapText = false;
 }
 if (msg){WScript.Echo("Fatal Error: " + msg);} else {WScript.Echo("Fatal Error");}
 WScript.Quit();
}

function localFolder(){
 return fso.GetParentFolderName(WScript.ScriptFullName) + FOLDER_DELIM;
}

function download(url, localPath){
 
 if (!localPath){
  var urlSplit = url.split('/');
  var pathSplit = WScript.ScriptFullName
  localPath = localFolder() + urlSplit[urlSplit.length - 1];
 }
 
 if (fso.FileExists(localPath)){
  return localPath; //TODO: prompt the user with the option to overwrite
 }
 //WScript.Echo("Downloading from " + url + " to " + localPath);
 
 var httpRequest = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
 httpRequest.Open("GET", url, false);
 httpRequest.Send()
 if (httpRequest.Status != 200){return -1;} 
 
 var stream = new ActiveXObject("ADODB.Stream");
 stream.Type = 1; //1 = adTypeText
 stream.Open();
 stream.Write(httpRequest.responseBody);
 stream.SaveToFile(localPath, 2); //2 = adSaveCreateOverWrite
 
 return localPath;
}

function isPureKatakana(word){
 for (var i=0;i<word.length;i++){
  var charCode = word.charCodeAt(i);
  if (charCode < 0x30a0  || charCode > 0x30ff ){
   return false;
  }
 }
 return true;
}
 
function makeGradeLevelsByStrokeCount(){ if (gradeLevels){fatal('You can only have one grade level type per deck!');} DECK_TITLE = 'BY_STROKE_COUNT.';
 return [
  ['One_Stroke_Kanji','一乙〇'],
  ['Two_Stroke_Kanji','丁七九了二人入八刀力十又乃'],
  ['Three_Stroke_Kanji','万丈三上下丸久亡凡刃千口土士夕大女子寸小山川工己干弓才之巾乞于也々勺'],
  ['Four_Stroke_Kanji','不与中丹予互五井仁今介仏元公六内円冗凶分切刈化匹区升午厄及友双反収天太夫孔少尺屯幻弔引心戸手支文斗斤方日月木欠止比毛氏水火父片牛犬王巴允爪牙匂勾乏勿'],
  ['Five_Stroke_Kanji','出世付仕代仙他以令兄只史号叶𠮟(叱)加占可句司召台古右石四囚凸凹冬処皮奴功巧包去圧庁広刊北半外央失矢尻尼左布平幼弁必打払斥丘未末本札正母民氷永汁氾犯生主玉巨用冊田由甲申白旧旦甘皿目且矛示礼写立市穴它玄辺込弘瓦丼丙叫'],
  ['Six_Stroke_Kanji','両争交仮仰仲件任企伏伐休会伝充兆先光全共再刑列劣匠印危各合吉同名后吏吐向回因団在地壮多好如妃妄存宅宇守安寺尽州巡帆年式弐当忙成旨早旬曲有朱朴机朽次死毎気汗汚江池灯灰百竹米糸缶羊羽老考耳肉肌自至舌舟色芋芝虫血行衣西迅字伊旭庄亘圭汐伎臼汎'],
  ['Seven_Stroke_Kanji','乱亜伯伴伸伺似但位低住佐体何余作克児兵冷初判別利助努励労医即却卵君吟否含吸吹呈呉告困囲図坂均坊坑声壱売妊妙妥妨孝完対寿尾尿局岐希床序廷弟形役忌忍志忘応快我戒戻扱扶批技抄把抑投抗折抜択改攻更杉材村束条来求決汽沈沖没沢災状狂男町社秀私究系肖肝臣良花芳芸見角言谷豆貝赤走足身車辛酉迎近返邦里防麦串李那沙呂杏冶汰肘阪弄沃妖吾园'],
  ['Eight_Stroke_Kanji','並乳事享京佳併使例侍供依価侮免具典到制刷券刺刻効劾卒卓協参叔取受周味呼命和固国坪垂夜奇奉奔妹妻姉始姓委季学宗官宙定宜宝実尚居屈届岬岳岩岸幸底店府延弦彼往征径忠念怖性怪房所承披抱抵抹押抽担拍拐拒拓拘招拝拠拡放斉昆昇明易昔服杯東松板析林枚果枝枠枢欧武歩殴毒河沸油治沼沿況泊泌法泡波泣泥注泳炉炊炎牧物画的盲直知祈祉空突者肢肥肩肪肯育舎芽苗若苦英茂茎表迫迭述邪邸金長門阻附雨青非奈阿昌虎弥茅拙朋苑於尭旺采侃宛岡玩股呪刹狙妬阜枕拉版'],
  ['Nine_Stroke_Kanji','乗亭侯侵便係促俊俗保信冒冠則削前勅勇卑南卸厘厚叙咲単哀品型垣城変奏契姻姿威孤客宣室封専屋峠峡巻帝帥幽度建弧待律後怒思怠急恒恨悔括拷拾持指挑挟政故施星映春昨昭是昼枯架柄某染柔柱柳査栄段泉洋洗洞洒津洪活派浄浅海炭点為牲狩独狭珍甚界畑疫発皆皇盆相盾省看県砂研砕祖祝秋科秒窃糾紀約紅美耐肺胃胆背胎胞臭茶草荒荘衷要訂計貞負赴軌軍迷追退送逃逆郊郎重限面革音風飛食首香彦胡虹眉怨咽畏拶柵拭栃訃昧勃侶柿姦|'],
  ['Ten_Stroke_Kanji','修俳俵俸倉個倍倒候借倣値倫倹俺党兼准凍剖剛剣剤勉匿原員哲唆唇唐埋姫娘娠娯夏孫宮宰害宴宵家容射将展峰島差師席帯帰座庫庭弱徐徒従恋恐恥恩恭息恵悟悦悩扇挙振挿捕捜敏料旅既時書朕朗栓校株核根格栽桃案桑桜桟梅殉殊残殺泰流浜浦浪浮浴浸消涙烈特珠班瓶畔留畜畝疲疾病症益真眠砲破神祥秘租秩称竜笑粉粋紋納純紙級紛素紡索翁耕耗胴胸能脂脅脈致航般荷華虐蚊蚕衰被討訓託記財貢起軒辱透逐逓途通逝速造連郡酌配酒針降陛院陣除陥隻飢馬骨高鬼浩栗桂桐拳唄冥挨挫桁恣脊凄芯捉捗酎剝(剥)脇哺釜'],
  ['Eleven_Stroke_Kanji','乾偏停健側偵偶偽副剰動勘務唯唱商問啓喝圏域執培基堀堂婆婚婦宿寂寄密尉崇崎崩巣帳常庶康庸張強彩彫得悠患悪悼情惜惨捨据掃授排掘掛採探接控推措掲描救敗教斎斜断旋族曹望械欲殻涯液涼淑淡深混添清渇済渉渋渓猛猟猫率現球理産略異盗盛眺眼票祭移窒窓章笛符第粒粗粘粛粧累細紳紹紺終組経翌習脚脱脳舶船菊菌菓菜著虚蛇蛍術街袋規視訟訪設許訳豚貧貨販責赦軟転逮週進逸部郭郵郷都酔釈野釣閉陪陰陳陵陶陸険隆雪頂魚鳥麻黄黒鹿梨亀淳猪笹渚爽陳淫葛崖苛惧痕頃梗舷斬埼戚羞袖曽堆唾貪捻'],
  ['Twelve_Stroke_Kanji','偉傍傘備割創勝募博善喚喜喪喫営堅堕堤堪報場塀塁塔塚奥婿媒富寒尊尋就属帽幅幾廃廊弾御復循悲惑惰愉慌扉掌提揚換握揮援揺搭敢散敬晩普景晴晶暁暑替最朝期棋棒棚棟森棺植検業極欺款歯殖減渡渦温測港湖湯湾湿満滋無焦然焼煮猶琴番畳疎痘痛痢登着短硝硫硬程税童筆等筋筒答策紫結絞絡給統絵絶腐腕落葉葬蛮衆裁裂装裕補覚訴診証詐詔評詞詠象貫貯貴買貸費貿賀超越距軸軽遂遅遇遊運遍過道達酢量鈍開閑間陽隅隊階随雄集雇雰雲項順飯飲智須萩敦媛嵐椎翔喬巽湧茨椅喉腎痩貼斑喩勤'],
  ['Thirteen_Stroke_Kanji','傑催債傷傾働僧勢勧嗣嘆園塊塑塗塩墓夢奨嫁嫌寛寝幕幹廉微想愁意愚愛感慈慎慨戦損搬携搾摂数新暇暖暗棄楼楽歳殿源準溝溶滅滑滝滞漠漢煙照煩献猿環痴盟睡督碁禁福稚節絹継続罪置署群義聖腰腸腹艇蒸蓄虜虞裏裸褐解触試詩詰話該詳誇誉誠豊賃賄資賊跡路跳践較載辞農違遠遣酪酬鈴鉄鉛鉢鉱隔雅零雷電靴預頑頒飼飽飾鼓睦彙詣窟僅嗅傲隙腫嫉塞詮煎羨頓塡(填)溺蜂慄楷賂毀'],
  ['Fourteen_Stroke_Kanji','像僕僚嘱塾境増墨奪嫡察寨寡寧層彰徳徴態慕慢憎摘旗暦暮概構様模歌歴滴漁漂漆漏演漫漬漸獄疑碑磁禅禍種稲穀端箇算管精維綱網綿総緑緒練罰聞膜製複誌認誓誘語誤説読豪踊適遭遮酵酷酸銀銃銅銘銭関閣閥際障隠雌雑需静領駄駅駆髪魂鳴鼻熊聡槙漱瑠璃萎裾遜遡箋綻蜜貌辣瘍'],
  ['Fifteen_Stroke_Kanji','儀億劇勲器噴墜墳審寮導履幣弊影徹慣慮慰慶憂憤戯摩撃撤撮撲敵敷暫暴槽標権横歓潔潜潟潤潮澄熟熱監盤確稼稿穂窮窯箱範緊線締編緩縁縄罷膚舗舞蔵衝褒誕課調談請論諸諾謁賓賛賜賞賠賦質趣踏輝輩輪遵遷選遺鋭鋳閲震霊養餓駐魅黙駒憧嬉潰稽憬畿餌摯踪嘲緻誰膝箸罵蝟'],
  ['Sixteen_Stroke_Kanji','儒凝墾壁壇壊壌奮嬢憩憲憶憾懐擁操整曇橋機激濁濃燃獣獲磨積穏築樹篤糖緯縛縦縫繁膨興薄薦薪薫薬融衛衡親諭諮謀謡賢輸避還鋼錠錬錯録隣隷頭頼館龍錦骸蓋諧醒膳賭諦麺頰(頬)錮'],
  ['Seventeen_Stroke_Kanji','償優厳嚇懇懲擦擬濯燥爵犠療矯礁縮績繊翼聴覧謄謙講謝謹購轄醜鍛霜頻鮮磯瞳瞭曖韓臆鍵鍋謎闇蔑璧餅'],
  ['Eighteen_Stroke_Kanji','曜濫癒癖瞬礎穫簡糧織繕繭翻職臨藩襟覆覇観贈鎖鎮闘離難題額顔顕類騎騒験蔽藤鎌藍鯉顎戴'],
  ['Nineteen_Stroke_Kanji','瀬爆璽簿繰羅臓藻識譜警鏡霧韻願髄鯨鶏麗艶蹴麓'],
  ['Twenty_Stroke_Kanji','懸欄競籍議譲醸鐘響騰'],
  ['Twenty-one_Stroke_Kanji','艦護躍露顧魔鶴櫻'],
  ['Twenty-two_Stroke_Kanji','襲驚籠攣龕'],
  ['Twenty-three_Stroke_Kanji','鑑靨'],
  ['Twenty-four_Stroke_Kanji','鷹魘'],
  ['Twenty-nine_Stroke_Kanji','鬱'],
  ['Thirty_Stroke_Kanji','驫鸞'],
  ['Thirty-three_Stroke_Kanji','麤'],
  ['Thirty-four_Stroke_Kanji','䯂']
 ];
} 

function makeGradeLevelsBySchoolYear(){ if (gradeLevels){fatal('You can only have one grade level type per deck!');} DECK_TITLE = 'BY_GRADE_LEVEL.';
 return [
  ['KANKEN_LEVEL_10 GRADE_ONE_KANJI KYOUIKU_KANJI JOUYOU_KANJI', '一七三上下中九二五人休先入八六円出力十千口右名四土夕大天女子字学小山川左年手文日早月木本村林校森正気水火犬玉王生田男町白百目石空立竹糸耳花草虫見貝赤足車金雨青音'],
  ['KANKEN_LEVEL_9 GRADE_TWO_KANJI KYOUIKU_KANJI JOUYOU_KANJI','万丸交京今会体何作元兄光公内冬刀分切前北午半南原友古台合同回図国園地場声売夏外多夜太妹姉室家寺少岩工市帰広店弓引弟弱強当形後心思戸才教数新方明星春昼時晴曜書朝来東楽歌止歩母毎毛池汽活海点父牛理用画番直矢知社秋科答算米紙細組絵線羽考聞肉自船色茶行西親角言計記話語読谷買走近通週道遠里野長門間雪雲電頭顔風食首馬高魚鳥鳴麦黄黒'],
  ['KANKEN_LEVEL_8 GRADE_THREE_KANJI KYOUIKU_KANJI JOUYOU_KANJI','丁世両主乗予事仕他代住使係倍全具写列助勉動勝化区医去反取受号向君味命和品員商問坂央始委守安定実客宮宿寒対局屋岸島州帳平幸度庫庭式役待急息悪悲想意感所打投拾持指放整旅族昔昭暑暗曲有服期板柱根植業様横橋次歯死氷決油波注泳洋流消深温港湖湯漢炭物球由申界畑病発登皮皿相県真着短研礼神祭福秒究章童笛第筆等箱級終緑練羊美習者育苦荷落葉薬血表詩調談豆負起路身転軽農返追送速進遊運部都配酒重鉄銀開院陽階集面題飲館駅鼻'],
  ['KANKEN_LEVEL_7 GRADE_FOUR_KANJI KYOUIKU_KANJI JOUYOU_KANJI','不争付令以仲伝位低例便信倉候借停健側働億兆児共兵典冷初別利刷副功加努労勇包卒協単博印参史司各告周唱喜器囲固型堂塩士変夫失好季孫完官害察巣差希席帯底府康建径徒得必念愛成戦折挙改救敗散料旗昨景最望未末札材束松果栄案梅械極標機欠歴残殺毒氏民求治法泣浅浴清満漁灯無然焼照熱牧特産的省祝票種積競笑管節粉紀約結給続置老胃脈腸臣航良芸芽英菜街衣要覚観訓試説課議象貨貯費賞軍輪辞辺連達選郡量録鏡関陸隊静順願類飛飯養験'],
  ['KANKEN_LEVEL_6 GRADE_FIVE_KANJI KYOUIKU_KANJI JOUYOU_KANJI','久仏仮件任似余価保修俵個備像再刊判制券則効務勢厚句可営因団圧在均基報境墓増夢妻婦容寄富導居属布師常幹序弁張往復徳志応快性恩情態慣承技招授採接提損支政故敵断旧易暴条枝査格桜検構武比永河液混減測準演潔災燃版犯状独率現留略益眼破確示祖禁移程税築精素経統絶綿総編績織罪群義耕職肥能興舌舎術衛製複規解設許証評講謝識護豊財貧責貸貿賀資賛質輸述迷退逆造過適酸鉱銅銭防限険際雑非預領額飼'],
  ['KANKEN_LEVEL_5 GRADE_SIX_KANJI KYOUIKU_KANJI JOUYOU_KANJI','並乱乳亡仁供俳値傷優党冊処刻割創劇勤危卵厳収后否吸呼善困垂城域奏奮姿存孝宅宇宗宙宝宣密寸専射将尊就尺届展層己巻幕干幼庁座延律従忘忠憲我批担拝拡捨探推揮操敬映晩暖暮朗机枚染株棒模権樹欲段沿泉洗派済源潮激灰熟片班異疑痛皇盛盟看砂磁私秘穀穴窓筋策簡糖系紅納純絹縦縮署翌聖肺背胸脳腹臓臨至若著蒸蔵蚕衆裁装裏補視覧討訪訳詞誌認誕誠誤論諸警貴賃遺郵郷針鋼閉閣降陛除障難革頂骨'],
  ['KANKEN_LEVEL_4 JOUYOU_KANJI','丈与丘丹乾互井介仰伺依侵俗倒偉傍傾僧儀兼冒凡凶刈到刺剣剤劣勧匹占即却及叫召吐含吹咲唐嘆噴圏坊執堅堤塔壁壊壱奇奥奴妙姓威娘婚寂寝尋尽尾屈峠峰巡巨帽幅幾床弐弾彩影彼征御微徴忙怒怖恋恐恒恥恵悩惑惨慎慢慮憶戒戯扇払扱抗抜抱抵押拍拓拠振捕掘描握援搬摘撃攻敏敷斜旨旬是普暇暦曇更替朱朽杯枯柄柔桃欄歓歳殖殿汗汚沈沖沢沼況泊浜浮浸涙淡添渡溶滴漫澄濁濃為烈煙煮燥爆狂狩狭猛獣獲玄珍環甘畳疲療皆盆盗監盤盾眠瞬矛砲祈秀称稲稿突端箇範粒紋紫紹絡継維網緯縁繁繰罰翼耐肩肪胴脂脚脱腐腕腰膚致舗舞舟般芋芝茂荒菓蓄薄薪被襲触訴詰詳誇誉謡豪販賦贈越趣距跡跳踊踏躍軒較載輝輩込迎迫逃透途遅違遣避郎釈鈍鉛鋭鎖鑑闘陣陰隠隣隷雄雅雌離雷需震霧露響項頼飾香駆騒驚髪鬼鮮麗黙鼓齢'],
  ['KANKEN_LEVEL_3 JOUYOU_KANJI','乏乙了企伏伐伴伸佳侍促倣倹偶催債克免冗冠凍凝刑削励勘募匠匿卑卓卸厘又双吉吏哀哲啓喚喫嘱坑埋塊塗墜墨墳墾壇奉契奪如妨姫娯婆婿嫁嬢孔孤宴審寿封尿岐岳峡崩巧帆帝幻幽廉廊弧彫徐忌怠怪恨悔悟悦惜愚慈慌慕慨慰憂憎憩房抑択抽拘掃掌排掛控措掲揚換揺携搾摂撮擁擦敢斗斤斥施既昇晶暫架某桑棄棋楼概欧欺殊殴没泌浪湾湿滅滑滝滞漂漏潜潤濫瀬炉炊炎焦牲犠猟獄甲畔畜疾痘癖硬碑礎祉稚穂穏穫窒符篤簿籍粋粗粘糧紛紺絞綱緊締緩縛縫繕翻聴肝胆胎胞脅膜膨芳苗菊華葬藩虐虚蛮衝衰袋裂裸覆訂託詠該誘請諮諾謀譲豚貫賊賢赦赴超軌軸辛辱逮遂遇遭遵邦邪郊郭酔酵鋳錠錬錯鍛鎮鐘閲阻陪陳陵陶隆随隔隻雇零霊顧飽餓駐騎髄魂魅魔鯨鶏'],
  ['KANKEN_LEVEL_2.5 JOUYOU_KANJI','且丙亜享亭仙伯但佐併侮侯俊俸倫偏偵偽傑傘僕僚儒償充准凸凹刃剖剛剰劾勅勲升厄叔叙吟呈呉唆唇唯喝喪嗣嚇囚坪垣培堀堕堪塀塁塑塚塾壌壮奔奨妃妄妊妥姻娠媒嫌嫡宜宰宵寛寡寧寮尉尚尼履屯岬崇崎帥幣庶庸廃廷弊弔弦彰循徹忍恭悠患悼惰愁愉慶憤憾懇懐懲懸戻扉扶抄把披抹拐拒拙括拷挑挟挿捜据搭摩撤撲擬斉斎旋昆暁曹朕朴杉析枠枢柳栓核栽桟棚棟棺槽款殉殻汁江沸泡泥泰洞津洪浄浦涯涼淑渇渉渋渓渦溝滋漆漠漬漸潟濯煩爵猫献猶猿珠琴璽瓶甚畝疎疫症痢痴癒盲眺睡督矯砕硝硫碁磨礁祥禅禍租秩稼窃窮窯竜筒粛粧糾紡索累紳緒縄繊繭缶罷羅翁耗肌肖肢肯臭舶艇艦茎荘菌薦薫藻虜虞蚊蛇蛍融衡衷裕褐褒襟覇訟診詐詔誓諭謁謄謙謹譜貞貢賄賓賜賠購践軟轄迅迭逐逓逝逸遍遮遷還邸酌酢酪酬酷醜醸釣鈴鉢銃銘閑閥附陥隅雰霜靴韻頑頒頻顕飢駄騰麻'],
  ['KANKEN_LEVEL_2 HYOUGAI_KANJI','串丼乞亀伎侶俺傲僅冥冶凄刹剥勃勾匂叱呂呪咽哺唄唾喉喩嗅嘲埼堆塞填奈妖妬媛嫉宛尻岡崖嵐巾弄弥彙怨恣惧慄憧憬戚戴拉拭拳拶挨挫捉捗捻摯斑斬旦旺昧曖曽枕柵柿栃桁梗梨椅椎楷毀氾汎汰沃沙淫湧溺潰煎熊爪爽牙狙玩瑠璃璧瓦畏畿痕痩瘍眉睦瞭瞳稽窟箋箸籠綻緻罵羞羨肘股脇脊腎腫腺膝膳臆臼舷艶芯苛茨萎葛蓋蔑蔽藍藤虎虹蜂蜜袖裾訃詣詮誰諦諧謎貌貪貼賂賭踪蹴辣遜遡那酎醒采釜錦錮鍋鍵鎌闇阜阪隙韓頃須頓頬顎餅餌駒骸鬱鶴鹿麓麺'],
  ['KANKEN_LEVEL_1.5 HYOUGAI_KANJI','丑丞乃之乍乎也云亘亙些亥亦亨亮什仇仔伊伍伶伽佃佑佼侃侠俄俣倖倦倭倶偲傭僑僻儘儲允兇兔兜其冴凋凌凧凪凰凱函剃劃劉劫勿匙匝匡匪卜卦卯卿厭叉叛叡叢叩只叶吃吊吋吠吻吾呆呑咳哉哨哩唖啄喋喧喬喰嘉嘗嘘嘩噂噌噛噸噺嚢圃圭坐坤坦垢埜埠埴堰堵堺塘塙塵壕壬壺夙夷奄套妓妾姐姑姥姦姪姶娃娩娼婁嬉嬬嬰孜孟宋宍宏宕宥寅寓寵尖尤尭屍屑屡岨岱峨峯峻嵩嵯嶋嶺巌巳巴巷巽帖幌幡庄庇庖庚庵廏廓廚廟廠廻廿弗弘弛弼彊彦彪彬徽忽怜怯恕恢恰悉悌悶惇惚惟惣惹愈慧慾憐戊戎或戟托扮按挺挽捌捧捲捷捺掠掩掬掴掻揃揖摸摺撒撚撞撫播撰擢擾攪敦斌斐斡斧斯於旭昂昌昏晃晋晒晦智暢曙曝曳朋朔李杏杓杖杜杢杭杵杷枇柁柊柏柑柘柚柴柾栂栖栗栴桂桐桓桔桝桶梁梓梢梧梯梱梶棉棲椀椋椙椛椴椿楊楓楚楠楢楯楳榊榎榛槌槍槙槻樋樗樟樫樵樺樽橘橡橢橿檀檎檜檮櫓櫛欣欽歎此歪殆毅毘汀汐汝汲沌沓沫洛洩洲浩浬涌涜淀淋淘淳淵渚渠渥湊湘湛溌溜溢溯漉漑漕漣澗澱濠濡濤瀕瀞瀦瀧灌灘灸灼烏烹焔焚煉煤煽燈燐燕燦燭爺爾牌牒牝牟牡牢牽犀狐狗狛狸狼狽猪猷獅玖玲珂珊珪琉琢琳琵琶瑚瑛瑞瑳瓜瓢甑甜甥甫畠畢畦畷疋疏疹痔癌皐盃盈瞥矧矩砥砦砧硯硲碇碍碓碧碩磐磯礦礪祁祇祐祷禄禎禦禰禽禾禿秤秦稀稔稗稜穆穎穣穿窄窪窺竈竣竺竿笈笠笥笹筈筏筑箔箕箪箭篇篠篦簸簾籾粁粂粍粕粟粥糊糎糞糟糠紐紗紘紬絃絢綜綬綴綾緋緬縞繋繍纂纏罫翠翫翰耀而耶耽聡聯聾肇肋肱肴胡胤脆腔腿膏膿臥舘舛舜舵艮芙芥芭芹苅苑苒苓苔苧苫茄茅茜茸荊荏荻莞莫莱菅菖菟菩菰菱萄萌萩萱葎葡董葦葱葵葺蒋蒐蒔蒙蒜蒲蒼蓉蓑蓬蓮蔀蔓蔚蔦蔭蕃蕉蕊蕎蕗蕨蕩蕪薗薙薩薯藁藪藷蘇蘭虻蚤蛋蛙蛛蛤蛭蛸蛾蜘蝉蝋蝕蝦蝶螺蟹蟻蠅蠣衿袈袴袷裟裡裳襖覗訊訣註詑詫誹誼諏諒諜諫諺謂謬讚豎豹貰賑賤贋赫趨跨蹄蹟躯輔輯輿轍轟轡辰辻辿迂迄迦迺逗這逢逼遁遥遼邇邑郁鄭酉酋醇醍醐醗醤釘釦釧鈷鉤鉦鉾銚鋒鋤鋪鋲鋸錆錐錨錫鍍鍔鍬鍾鎔鎗鎚鎧鏑鐙鐸鑓閃閏閤阿陀隈隼雀雁雛雫霞靖靭鞄鞍鞘鞠鞭韃韭頁頗頸顛飴餐餠饗馨馳馴駁駈駕駿騨髭魁魯鮎鮒鮪鮫鮭鯉鯖鯛鰍鰐鰭鰯鰹鰺鰻鱈鱒鱗鳩鳳鳶鴇鴎鴛鴦鴨鴫鴻鵜鵠鵡鵬鶯鷲鷹鷺鸚鹸麒麟麹麿黍黛鼎鼠龍龝'],
  ['KANKEN_LEVEL_1 HYOUGAI_KANJI','丐丕丗个丱丶丿乂乕乖乘乢亂亅亊于亞亟亠亢亰亳亶仂仄仆仍从仗仞仟仭价伉伜估佇佗佚佛佝佞佩佯佰佶佻來侈侏侑侖侘侫侭俎俐俑俔俘俚俛俟俤俥俯俶俾倅倆倏們倔倚倡倥倨倩倪倬偃假偈偐偕偖做偬偸傀傅傚傳傴僂僉僊僖僞僣僥僭僮僵價儁儂儉儔儕儖儚儡儷儺儻儼儿兀兌兎兒兢兩兪兮冀冂冉册冏冐冑冓冕冖冢冤冦冨冩冪冫冰冱冲决况冽凅凉凖凛凜几凩凭凵凾刄刋刎刔刧刪刮刳剄剋剌剏剔剞剩剪剱剳剴剽剿劈劍劑劒劔劬劭劵劼勁勍勒勗勞勠勣勦勳勵勸勹匆匈匍匏匐匕匚匣匯匱匳匸區卅卆卉卍卞卩卮卷卻厂厖厠厥厦厨厩厮厰厶參叟叨叭叮叺吁吝吩听吭吮吶吼吽呀呎呟呰呱呵呶呷呻咀咄咆咋咎咏咐咒咢咤咥咨咫咬咯咸咼咾哂哄哇哈哘哢哥哦哭哮哽唏唔售唳唸唹啀啅啌啖啗啜啝啣啻啼啾喀喃喇喊喘喙喞喟喨單嗄嗇嗔嗚嗜嗟嗤嗷嗹嗽嗾嘔嘖嘛嘯嘴嘶嘸噎噐噤噪噫噬嚀嚆嚊嚏嚔嚠嚥嚮嚴嚶嚼囀囁囂囃囈囎囑囓囗囘囮囹囿圀圄圈圉國圍圓圖團圜圦圷圸圻址坎坏坡坩坿垈垉垓垠垤垪垰垳埀埃埆埒埓埔埖埣堊堋堙堝堡堯堽塋塒塢塰塲塹墅墟墫墮墸墹墺墻壅壑壓壗壘壙壜壞壟壤壥壯壷壹壻壼壽夂夊夐夘夛夥夬夭夲夸夾奎奐奕奘奚奠奢奧奩奬奸妁妍妛妝妣妲姆姙姚姜姨娉娑娚娜娟娥娵娶婀婉婢婪婬媚媼媽媾嫂嫋嫐嫖嫗嫣嫦嫩嫺嫻嬋嬌嬖嬪嬲嬶嬾孀孃孅孑孕孚孛孥孩孰孱孳孵學孺宀它宦宸寃寇寉寐寔寞寢寤寥實寨寫寰寳寶尅將專對尓尠尢尨尸尹屁屆屎屏屐屓屠屬屮屶屹岌岑岔岫岶岷岻岼岾峅峇峙峩峪峭峺峽崋崑崔崕崗崘崙崚崛崟崢嵋嵌嵎嵒嵜嵬嵳嵶嶂嶄嶇嶌嶐嶝嶢嶬嶮嶷嶼嶽巉巍巒巓巖巛巫已巵帋帑帙帚帛帶帷幀幃幄幇幎幔幗幟幢幤幵并幺广庠廁廂廈廐廖廛廝廡廢廣廨廩廬廰廱廳廴廸廼廾弃弉弋弌弍弑弖弩弭弯弸彁彈彌彎彑彖彗彜彝彡彭彳彷彿徂徃徇很徊徑徘徙從徠徨徭徼忖忝忤忰忱忸忻忿怎怏怐怕怙怛怡怦怩怫怱怺恁恂恃恆恊恍恙恚恟恠恤恪恫恬恷悁悃悄悋悍悒悖悗悚悛悧悳悴悵悸悽惆惓惘惠惡惱惴惶惷惺惻愀愃愆愍愎愕愡愧愨愬愴愼愽愾愿慂慇慊慍慓慘慙慚慝慟慥慫慯慱慳慴慵慷憇憊憑憔憖憙憚憫憮憺懃懆懈應懊懋懌懍懣懦懴懶懷懺懼懽懾懿戀戈戉戌戍戔戛戝戞戡截戮戰戲戳扁扈扎扛扞扠扣扨扼找抂抃抉抒抓抔抖抛抬抻拂拆拇拈拊拌拏拑拔拗拜拮拯拱拵拿挂挈挌挧挾捍捏捐捩捫捶掀掉掎掏掖掟掣掫掵掾揀揄揆揉插揣揩揶搆搏搓搖搗搜搦搨搴搶摎摧摶撈撓撕撥撩撹撻撼擂擅擇擒擔擘據擠擡擣擧擯擱擲擴擶擺擽攀攅攘攜攝攣攤攫攬攴攵收攷攸效敍敕敖敘敝敞敲數斂斃斈斛斟斫斷旁旃旄旆旌旒旙旛无旡旱旻昃昊昜昴昵昶昿晁晄晉晏晝晞晟晢晤晧晨晰暃暄暈暉暎暘暝暸暹暼暾曁曄曉曚曠曦曩曰曵曷曼曾會朏朖朞朦朧朮朶朷朸朿杁杆杙杞杠杣杤杪杰杲杳杼枅枉枋枌枡枦枩枳枴枷枸枹柆柎柝柞柢柤柧柩柬柮柯栞栢栩栫栲桀框桍桎桙档桧桴桷桾桿梃梍梏梔梛條梟梠梦梭梳梵梹梺梼棆棊棍棔棕棗棘棠棡棣棧棯棹椁椄椈椌椏椒椚椡椢椣椥椦椨椪椰椶椹椽楔楕楙楜楝楞楡楪楫楮楴楸楹楾榁榑榔榕榜榠榧榮榱榲榴榻榾榿槁槃槇槊槎槐槓槝槞槧槨槫槭槲槹槿樂樅樊樌樒樓樔樛樞樢樣樮樶樸橄橇橈橙橦橲橸檄檍檐檗檠檢檣檪檬檳檸檻櫁櫂櫃櫑櫚櫞櫟櫨櫪櫺櫻欅權欒欖欝欟欷欸欹歃歇歉歐歔歙歛歟歡歸歹歿殀殃殄殍殕殘殞殤殪殫殯殱殲殳殷殼毆毋毓毟毫毬毯毳氈氓气氛氣氤汕汞汢汨汪汳汾沁沂沍沐沒沚沛沮沱沺沽沾泄泅泓泗泙泛泝泪泯泱洌洒洙洟洫洳洵洶洸洽浙浚浣浤浹涅涎涓涕涛涵涸淅淆淇淌淒淕淙淞淤淦淨淪淬淮淹淺渊渕渙渝渟渣渤渫渭渮游渺渾湃湍湎湟湫湮湲湶溂溏溘溟溥溪溲溷溽滂滄滉滌滓滔滕滬滯滲滷滸滾滿漓漱漲漾漿潁潅潘潛潦潭潯潴潸潺潼澀澁澂澆澎澑澡澣澤澪澳澹濂濆濔濕濘濛濟濬濮濱濳濶濺濾瀁瀉瀋瀏瀑瀘瀚瀛瀝瀟瀰瀲瀾灑灣炒炙炬炮炯炳炸烋烙烝烟烱烽焉焙焜煌煕煖煢煥煦煬熄熈熏熔熕熙熨熬熹熾燉燎燒燔燗營燠燧燬燮燵燹燻燼燿爍爐爛爨爬爭爰爲爻爼爿牀牆牋牘牴牾犁犂犇犒犖犢犧犲犹狃狄狆狎狒狠狡狢狷狹猊猖猗猜猝猥猩猯猴猾獎獏獗獨獪獰獵獸獺獻玳玻珀珈珎珞珥珮珱珸琅琥琲琺琿瑁瑕瑙瑜瑟瑣瑤瑩瑪瑯瑰瑶瑾璋璞璢瓊瓏瓔瓠瓣瓧瓩瓮瓰瓱瓲瓷瓸甃甄甅甌甍甎甓甕甞甦甬甸甼畄畆畉畊畋畍畚畛畤畧畩畫畭畴當畸疂疆疇疉疊疔疚疝疣疥疱疳疵疸疼疽痂痃痊痍痒痙痞痣痰痲痳痺痼痾痿瘁瘉瘋瘟瘠瘡瘢瘤瘧瘰瘴瘻癆癇癈癘癜癡癢癧癨癩癪癬癰癲癶癸發皀皃皈皋皎皓皖皙皚皰皴皷皸皹皺盂盍盒盖盜盞盡盥盧盪盻眄眇眈眛眞眤眥眦眩眷眸睇睚睛睥睨睫睹睾睿瞋瞎瞑瞞瞠瞰瞶瞹瞻瞼瞽瞿矇矍矗矚矜矣矮矼砌砒砠砺砿硅硴硼碆碌碎碕碗碚碣碪碯碵碼碾磅磆磊磋磑磔磚磧磬磴磽礇礑礒礙礫礬祀祓祕祗祚祟祠祢祺祿禀禊禝禧禪禮禳禹禺秉秕秡秣秧秬稈稍稘稙稟稠稱稷稻稾穃穉穐穗穡穢穩穰穹穽窈窕窖窗窘窩窰窶窿竃竄竅竇竊竍竏竒竓竕站竚竝竟竡竢竦竪竭竰竸笂笄笆笊笋笏笘笙笞笨笳笵笶筅筌筍筐筝筥筧筬筮筰筱筴筵筺箆箍箏箒箘箙箚箜箝箟箴篁篆篋篌篏篝篥篩篭篳篶篷簀簇簍簑簒簓簔簗簟簣簧簪簫簷簽籀籃籌籏籐籔籖籘籟籤籥籬籵粃粐粡粢粤粨粫粭粮粱粲粳粹粽糀糂糅糒糘糜糢糯糲糴糶糺紂紆紊紕紜紮紲紵紿絅絆絋絎絏絖絛絣絨絮絲絳絽綉綏經綛綟綢綣綫綮綯綰綵綸綺綽緇緕緘緜緝緞緡緤緲縅縉縊縋縒縟縡縢縣縱縲縵縷縹縺縻總繃繆繖繙繚繝繞繦繧繩繪繹繻繼繽繿纃纈纉續纎纐纒纓纔纖纛纜缸缺罅罌罍罎罐网罔罕罘罟罠罧罨罩罸罹羂羃羆羇羈羌羔羚羝羣羮羯羲羶羸羹翅翆翊翔翕翡翦翩翳翹耄耆耋耒耘耙耜耡耨耻耿聆聊聒聘聚聟聢聨聰聲聳聶聹聽聿肄肅肆肓肚肛肬肭胄胖胙胚胛胝胥胯胱胼脉脛脣脩脯脾腆腋腑腓腟腥腦腮腱腴膀膂膃膈膊膓膕膠膣膤膩膰膵膸膺膽膾臀臂臈臉臍臑臘臙臚臟臠臧臺臻臾舁舂舅與舉舊舍舐舒舖舩舫舮舳舸艀艘艙艚艝艟艢艤艨艪艫艱艷艸艾芍芒芟芦芫芬芻苙苜苞苟苡苣苳苴苹苺苻范茆茉茖茗茘茣茫茯茱茲茴茵茹荀荅荐荳荵荼莅莇莉莊莎莓莖莚莟莠莢莨莪莵莽菁菎菘菠菫菲菴菷菻菽萃萇萋萍萓萠萢萪萬萵萸萼葆葢葩葫葭葮葯葷葹蒂蒄蒟蒡蒭蒹蒻蒿蓁蓆蓊蓍蓐蓖蓙蓚蓴蓼蓿蔆蔔蔕蔗蔘蔟蔡蔬蕀蕁蕈蕋蕕蕘蕚蕣蕭蕷蕾薀薇薈薊薐薑薔薛薜薤薨薮薹薺藉藏藐藕藜藝藥藹藺藾蘂蘆蘊蘋蘓蘖蘗蘚蘢蘯蘰蘿虍虔處號虧虱蚋蚌蚓蚣蚩蚪蚫蚯蚰蚶蛄蛆蛉蛎蛔蛞蛟蛩蛬蛯蛹蛻蜀蜃蜆蜈蜉蜊蜍蜑蜒蜚蜥蜩蜴蜷蜻蜿蝌蝎蝓蝗蝙蝟蝠蝣蝨蝪蝮蝴蝸蝿螂螟螢螫螯螳螻螽蟀蟄蟆蟇蟋蟐蟒蟠蟯蟲蟶蟷蟾蠍蠎蠏蠑蠕蠖蠡蠢蠧蠱蠶蠹蠻衂衄衍衒衙衞衢衫衲衵衽衾袁袂袍袒袗袙袞袢袤袮袰袱袵袿裃裄裔裘裙裝裨裲裴裹裼褂褄褊褌褓褝褞褥褪褫褶褸褻襁襃襄襌襍襞襠襤襦襪襭襯襴襷襾覃覈覊覓覘覡覦覩覬覯覲覺覽覿觀觚觜觝觧觴觸訌訐訖訛訝訥訶詁詆詈詒詛詢詬詭詼誂誄誅誑誚誡誣誥誦誨諂諄諌諍諚諛諞諠諡諢諤諱諳諷謇謌謐謔謖謗謚謠謦謨謫謳謾譁證譌譎譏譖譚譛譟譫譬譯譱譴譽讀讃變讌讎讐讒讓讖讙谺谿豁豈豌豐豕豢豫豬豸豺豼貂貅貉貊貍貎貔貘貭貮貲貳貶貽賁賈賍賎賚賣賺賻賽贄贅贇贊贍贏贐贓贔贖赧赭赱赳趁趙趺趾跂跋跌跏跖跚跛跟跣跪跫跼跿踈踉踐踝踞踟踰踴踵蹂蹇蹈蹉蹊蹌蹐蹕蹙蹠蹣蹤蹲蹶蹼躁躄躅躇躊躋躑躓躔躙躡躪躬躰躱躾軅軆軈軋軛軣軫軻軼軾輅輊輌輒輓輕輙輛輜輟輦輳輹輻輾轂轅轆轉轌轎轗轜轢轣轤辜辟辧辨辭辮辯辷迚迢迥迩迪迯迴迸迹逅逋逍逎逑逕逖逞逡逧逵逶逹逾遉遏遐遑遒遖遘遙遞遨遯遲遶遽邀邁邂邃邉邊邏邨邯邱邵郛郢郤鄂鄒鄙鄰鄲酊酖酘酣酥酩酲酳醂醉醋醢醪醫醯醴醵醺釀釁釆釉釋釐釖釛釟釡釵釶釼釿鈎鈑鈔鈕鈞鈩鈬鈿鉅鉈鉉鉋鉐鉗鉚鉞銓銕銖銛銜銷銹鋏鋩鋺錏錙錚錢錣錵錺錻鍄鍖鍜鍠鍮鍼鎬鎭鎰鎹鏃鏈鏐鏖鏗鏘鏝鏤鏥鏨鐃鐇鐐鐓鐔鐚鐡鐫鐵鐶鐺鑁鑄鑒鑚鑛鑞鑠鑢鑪鑰鑵鑷鑼鑽鑾鑿钁閂閇閊閔閖閘閙閠閧閨閭閹閻閼閾闃闊闌闍闔闕闖關闡闢闥阡阨阮阯陂陋陌陏陜陝陞陟陦陬陲陷隋隍隕隗隘隧隨險隰隱隲隴隶隸隹雉雋雍雎雕雖雙雜雹霄霆霈霍霎霏霑霓霖霙霤霪霰霸霹霽霾靂靄靆靈靉靜靠靡靤靦靨靫靱靹靺靼鞁鞅鞆鞋鞏鞐鞜鞣鞦鞨鞫鞳鞴韆韈韋韜韮韲韵韶頌頏頚頡頤頴頷頽顆顋顏顫顯顰顱顳顴颪颯颱颶飃飄飆飜飩飫飭飮餃餉餒餔餘餝餞餡餤餬餮餽餾饂饅饉饋饌饐饑饒饕馗馘馥馭馮馼駑駘駛駝駟駢駭駮駱駲駸駻騁騅騏騙騫騷騾驀驂驃驅驍驕驗驛驟驢驤驥驩驪驫骭骰骼髀髏髑髓體髞髟髢髣髦髫髮髯髱髴髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲鬻魃魄魍魎魏魑魘魴鮃鮑鮓鮖鮗鮟鮠鮨鮴鮹鯀鯆鯊鯏鯑鯒鯔鯡鯢鯣鯤鯰鯱鯲鯵鰄鰆鰈鰉鰊鰌鰒鰓鰔鰕鰛鰡鰤鰥鰮鰰鰲鰾鱆鱇鱚鱠鱧鱶鱸鳧鳫鳬鳰鴃鴆鴈鴉鴒鴕鴟鴣鴪鴬鴾鴿鵁鵄鵆鵈鵐鵑鵙鵝鵞鵤鵯鵲鵺鶇鶉鶚鶤鶩鶫鶲鶸鶺鶻鷁鷂鷄鷆鷏鷓鷙鷦鷭鷯鷸鷽鸛鸞鹵鹹鹽麁麈麋麌麑麕麝麥麩麪麭麸麼麾黌黎黏黐黔默黜黝點黠黥黨黯黴黶黷黹黻黼黽鼇鼈鼕鼡鼬鼾齊齋齎齏齒齔齟齠齡齣齦齧齪齬齲齶齷龕龜龠'],
  ['JINMEIYOU_KANJI','丑丞乃之乎乘也云亙亘些亞亥亦亨亮來仔伊伍伽佃佑伶佛侃侑俄俣俐侮俠倖倭俱倦偲傭傳僞僧價儉儲允尭兎兒兜其巽冨冴凌凉凛凜凱凧凪凰函剩劉劍劫勁勉勤勳勺勿匁匡廿卑卜卯卷卽卿厩厨叉叡叢叶只吾吻吞哉哨啄哩喬喰喧喋單嘩嘉嘗噌嘆噂器嚴圃圈國圓團圭坐坦埴堵埜堰堺堯塙增墨壕壘壞壬壯壽夷奄奎套奧奬娃姥姪娩嬉孃孜孟宏宋宕宥寅寓實寢寬寵將專尖尤屑層峨峻峯峽崚嵯嵩嶋嶺巌巖巢巷巳巴已帖帶幌幡庄庇庚庵廊廟廣廳廻弘弛彈彌彗彦彪彬從徠徵德徽怜恢恰恆悌悔惟惚惇惺愼憎憐懷忽恕悉惹惣惡惠慧應懲戊或戟戰戲托拔拂按挺掬捷捺挽捧掠捲揃搜揭搖摺摑撒撰撞播撫擢攝拜擊敍收敏敦斐斡斧斯於旭昂昏昌昊昴晦晃晒晋晏晄晟晝晨晚智暉暑暢曉曆曙曝曳曾朋朔朗杏杖杜李杵杭杷枇柑柘柏柊柾柚桔桐栗桂柴栖桧栞梓桶梶椛梧梢梯梁條梛梅棲椋椀榊楯楚楕槌椿楢楠楓楊椰榎樺榛槍樋槙榮槇樫樟槻樂樣橘檎樽橙橫櫛檀檜檢櫂櫓櫻欄欣欽盜歎此步歷殆毅每毘毬氣汀汲汐汝沌沫洲洛洸洵浬浩海涉淳渚淀淋淨淚渥湘湛淵湊渚渴溢溜漣滉溫漕漱滯漢澁澪濡濕瀧瀨瀕灘沓灸灼焚煉焰煤煌燈燒燎燦燭燿烏煮熙燕爭爲爾牒牟牡牽犀狼狹猪猪獅狀默獸玖珂珊玲珈珀琢琉瑛琶琵琳琥琢瑚瑞瑶瑳瓜瓢甥甫畠畢疊疋疏瘦皐皓盃盡眞眸瞥矩砧砥砦硯碓碗碎碑碩碧磐磯祁祇祢祐祷禄禎禰社祉祈祕祐祖祝神祥祿禍禎福禪禮禱禽禾秦秤稀稔稜稟稻穀穗穣穰穹突窄穿窪窺竣竪竺竿笈笠笹笙筑筈箔箕篇節篠簞簾籾粟粥粹糊紘紗紐絃紬絆絢綾綜綴緋綺綸綠緖緣練縞縣縱繁繡繫纂纏纖署羚翔翠耀者而耶耽聡聽肇肋肴胤胡脩腔脹膏臟臥臭與舜舵芦芥芹芭芙苑茄茅苔苺茉茜茸荻莞莫莊莉菖菅萄菱菩萌菫萠萊葵萱董萩葡葺萬著葦蒲蒔蒐蒼蓬蓑蒙蓉蓮蔭蔦蔓蔣蕎蕉蕃蕪蕨薗薙蕗蕾薩藁藏薰藝藥蘇蘭虛虜蝦蝶螺蟬蟹蠟衞衿袴裡襖袈裟裝裳視覽訊訣註詫詢誼諏諒諄謂諺諸謁謠謹讃讓豹貰賑賓賣賴贈赳跨蹄蹟輔輯輿轉轟辰辻迂辿迄迦迪逢逗這遁遥遼逞逸遙郁郞都鄭邑酉醇醉醐醍醬釀釉釘釧銑鋒鋸錆錫錐錘錄鍬鍊鎧鎭鑄閃閏閤阿陀陷隈險隼雀雁雛雜難雫霞靖靜鞄鞍鞘鞠鞭響頁頌頗顚類顯颯飜饗馨馳馴駕駈駿騷驍驗髮魁魯鮎鯉鯛鰯鱒鱗鳩鳶鳳鴨鴻鵜鵬鷄鷗鷲鷺鷹麒麟麿黃黎黛黑鼎齊龍']
 ];
}
