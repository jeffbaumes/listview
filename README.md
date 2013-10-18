List View Tangelo App
=====================

1. Clone this repository.
```
git clone 
```
2. Install [Tangelo](http://kitware.github.io/tangelo/).
3. Install [MongoDB](http://mongodb.org).
4. Download [Jigsaw](http://www.jigsaw-analytics.net/).
5. Execute
```
/path/to/mongodb-version/bin/mongod --dbpath /some/dir
```
6. In another shell execute
```
python readjig.py /path/to/Jigsaw/datafiles/InfovisVAST-papers.jig
```
7. Add a link into Tangelo for this app
```
ln -s /path/to/listview /path/to/tangelo-build/deploy/web/listview
```
