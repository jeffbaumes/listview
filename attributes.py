import pymongo
import bson

def run():
    conn = pymongo.Connection("localhost")
    collection = conn["xdata"]["infovis"]
    out = conn["xdata"]["infovis_attributes"]
    out.drop()
    map = bson.code.Code("function() { for (var key in this) { emit(key, null); } }")
    reduce = bson.code.Code("function(key, stuff) { return null; }")
    out = collection.map_reduce(map, reduce, "infovis_attributes")
    return {"result": out.distinct("_id"), "error": None}
