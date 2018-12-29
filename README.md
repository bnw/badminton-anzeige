Score board for badminton matches
===

This software consists of:
* A score board web page, meant to be displayed on a large screen (e.g. smart TV).
* A controller web page to update the current score, meant to be used on a smart phone.
* A nodejs script that hosts the above web pages and handles the communication between them.

Usage
===
```
git clone https://github.com/bnw/badminton-anzeige.git
cd badminton-anzeige
npm install
npm run build
npm run run 8080
```
The two websites should now be hosted at `http://localhost:8080`.


Screenshots
===
* Viewer / score board:   
 ![Viewer / score board](https://raw.githubusercontent.com/bnw/badminton-anzeige/master/doc/viewer.png)
* Controller:   
 ![Controller](https://raw.githubusercontent.com/bnw/badminton-anzeige/master/doc/controller.png)
 
 
