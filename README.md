# AnkiDeckGenerator

This is the third iteration of a project I've been working on, which downloads the (freely available) Japanese-English dictionary JMdict, and converts it into a .csv file of flashcards to use with the (freely available) flashcard program Anki.

It is designed to run on Windows simply by double-clicking the script file, but it has two important dependencies: 
First, you must have 7zip on your computer to extract the dictionary file. Simply edit the line that defines ZIP_EXECUTABLE_PATH to point to your own local path.
Second, you must have Microsoft Excel. I will probably make a fourth version of this script that does not rely on Excel, because all I really do with it now is sort the table of data.

After you double-click the script file, it will open up Excel and display progress to you in the StatusBar at the bottom of that window. On my computer, it takes roughly a half hour from start to finish. If the script crashes or is stopped early, you may have hidden instances of Excel running on your computer, and you should close those with Task Manager. When the script completes, it will alert you if it created a new flashcard deck, and will display a brief popup with how long it took to execute. At that point, you can simply import the deck into Anki, with the following settings:

Fields separated by: Comma

Allow HTML in fields = checked

Field 1 of the file is: mapped to Front

Field 2 of the file is: mapped to Back

Field 3 of the file is: mapped to SortBy

Field 4 of the file is: mapped to Tags
