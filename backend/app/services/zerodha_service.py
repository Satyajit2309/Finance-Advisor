import os
from kiteconnect import KiteConnect

class ZerodhaService:
    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.api_secret = api_secret

    def _get_kite_instance(self, access_token: str = None) -> KiteConnect:
        """Returns an initialized KiteConnect instance. Optionally with an access token."""
        kite = KiteConnect(api_key=self.api_key)
        if access_token:
            kite.set_access_token(access_token)
        return kite

    def get_login_url(self) -> str:
        """Returns the Zerodha login URL for OAuth."""
        kite = self._get_kite_instance()
        return kite.login_url()

    def generate_session(self, request_token: str) -> dict:
        """Exchanges a request token for an access token."""
        kite = self._get_kite_instance()
        data = kite.generate_session(request_token, api_secret=self.api_secret)
        return {"access_token": data["access_token"], "public_token": data.get("public_token")}

    def get_holdings(self, access_token: str) -> list:
        """Retrieves user's holdings from Zerodha."""
        kite = self._get_kite_instance(access_token)
        return kite.holdings()

    def get_positions(self, access_token: str) -> dict:
        """Retrieves user's day and net positions from Zerodha."""
        kite = self._get_kite_instance(access_token)
        return kite.positions()
