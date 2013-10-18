import xml.dom.minidom
import json
import datetime
import pymongo
import sys
from bson.son import SON

# Get text under element n
def getText(n):
  rc = []
  for node in n.childNodes:
    if node.nodeType == node.TEXT_NODE:
      rc.append(node.data)
  return ''.join(rc)

conn = pymongo.Connection("localhost")
collection = conn["xdata"]["infovis"]
collection.drop()

content = '<?xml version="1.0" encoding="windows-1252"?>\n' + open(sys.argv[1]).read()
xmlDom = xml.dom.minidom.parseString(content)
for xmlDoc in xmlDom.getElementsByTagName("document"):
    doc = {"concepts": [], "terms": [], "keywords": [], "authors": []}
    for e in xmlDoc.getElementsByTagName("docID"):
        doc["_id"] = getText(e)
    for e in xmlDoc.getElementsByTagName("docDate"):
        doc["date"] = datetime.datetime.strptime(getText(e), "%m/%d/%Y")
    for e in xmlDoc.getElementsByTagName("year"):
        doc["year"] = int(getText(e))
    for e in xmlDoc.getElementsByTagName("conference"):
        doc["conference"] = getText(e)
    for e in xmlDoc.getElementsByTagName("journal"):
        doc["journal"] = getText(e)
    for e in xmlDoc.getElementsByTagName("docText"):
        doc["text"] = getText(e)
    for e in xmlDoc.getElementsByTagName("docSource"):
        doc["source"] = getText(e)
    for e in xmlDoc.getElementsByTagName("concept"):
        doc["concepts"].append(getText(e))
    for e in xmlDoc.getElementsByTagName("indexterm"):
        doc["terms"].append(getText(e))
    for e in xmlDoc.getElementsByTagName("keyword"):
        doc["keywords"].append(getText(e))
    for e in xmlDoc.getElementsByTagName("author"):
        doc["authors"].append(getText(e))
    print collection.insert(doc)
