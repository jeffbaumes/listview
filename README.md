List View Tangelo App
=====================

Clone this repository.

```
git clone https://github.com/jeffbaumes/listview.git
```

Install [Tangelo](http://kitware.github.io/tangelo/).

Install [MongoDB](http://mongodb.org).

Download [Jigsaw](http://www.jigsaw-analytics.net/).

Now start MongoDB:

```
/path/to/mongodb-version/bin/mongod --dbpath /some/dir
```

In another shell execute:

```
python readjig.py /path/to/Jigsaw/datafiles/InfovisVAST-papers.jig
```

Add a link into Tangelo for this app

```
ln -s /path/to/listview /path/to/tangelo-build/deploy/web/listview
```

Now visit http://localhost:8080/listview/ to view the app.