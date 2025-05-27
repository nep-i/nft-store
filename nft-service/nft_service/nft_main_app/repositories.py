import pymongo
from decouple import config

class NFTRepository:
    def __init__(self):
        mongo_url = config('MONGO_URL')
        client = pymongo.MongoClient(mongo_url)
        self.db = client.get_database()
        self.collection = self.db['nfts']

    def save_nft(self, nft):
        self.collection.insert_one(nft)
        return nft

    def get_nft(self, nft_id):
        return self.collection.find_one({'id': nft_id})