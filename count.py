import pymongo
import json

def run(attribute="authors", filter_attribute=None, filter_value=None):
    conn = pymongo.Connection("localhost")
    collection = conn["xdata"]["infovis"]
    pipeline = []
    if filter_attribute:
        pipeline.append({"$match": {filter_attribute: json.loads(filter_value)}})
    if attribute.endswith("s"):
        pipeline.append({"$unwind": "$" + attribute})
    pipeline.append({"$group": {"_id": "$" + attribute, "count": {"$sum": 1}}})
    pipeline.append({"$sort": {"count": -1}})
    return {"result": collection.aggregate(pipeline)["result"], "error": None}
