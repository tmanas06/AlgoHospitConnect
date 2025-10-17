from typing import Optional

from algosdk.v2client import algod, indexer

from app.config import settings


class AlgorandClients:
    def __init__(self) -> None:
        self._algod: Optional[algod.AlgodClient] = None
        self._indexer: Optional[indexer.IndexerClient] = None

    @property
    def algod(self) -> algod.AlgodClient:
        if self._algod is None:
            self._algod = algod.AlgodClient(settings.algod_token, settings.algod_url)
        return self._algod

    @property
    def indexer(self) -> indexer.IndexerClient:
        if self._indexer is None:
            self._indexer = indexer.IndexerClient("", settings.indexer_url)
        return self._indexer


clients = AlgorandClients()


