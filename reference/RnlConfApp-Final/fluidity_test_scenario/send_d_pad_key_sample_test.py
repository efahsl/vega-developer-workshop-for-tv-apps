"""
send_d_pad_key_sample_test.py

Sample test script for sending D-pad key events to a Kepler TV device.
Uses Appium with JSON-RPC to simulate directional input, enabling KPI
measurement scenarios such as UI fluidity testing.

Usage:
    Instantiate TestRunner, then call prep() followed by run().

Reference:
    https://developer.amazon.com/docs/kepler-tv/appium.html
"""

import logging
from typing import Any, Dict, Optional, Union
# Add additional imports here if needed.
import time
 
supportAppiumOptions: bool = True
try:
    from appium.webdriver.webdriver import AppiumOptions
except ImportError:
    supportAppiumOptions = False
 
 
from appium import webdriver
 
# For W3C actions.
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.actions import interaction
from selenium.webdriver.common.actions.action_builder import ActionBuilder
from selenium.webdriver.common.actions.pointer_input import PointerInput
 
appium_url: str = "http://127.0.0.1"
options: Optional[Union[Dict[str, Any], AppiumOptions]] = None
logger = logging.getLogger(__name__)


# Please do not change the name of the class.
class TestRunner:
    _PRESS_DELAY: float = 0.7
    _WARMUP_WAIT: int = 5

    def __init__(self, device_serial_number: str, port: int):
        """Initialize the TestRunner and establish an Appium session.

        Args:
            device_serial_number: Serial number of the target Kepler device.
            port: Port number of the Appium server.
        """
        self.__driver: Optional[webdriver.webdriver.WebDriver] = None
        _capabilities: Dict[str, Any] = {
            "platformName": "Kepler",
            "appium:automationName": "automation-toolkit/JSON-RPC",
            "kepler:device": f"vda://{device_serial_number}",
            "kepler:jsonRPCPort": 8383,
            "newCommandTimeout": 500,
            "appium:deviceName": device_serial_number,
        }
        self.appium_url = f"{appium_url}:{port}"

        if supportAppiumOptions:
            self.__driver = webdriver.Remote(
                self.appium_url, 
                options=AppiumOptions().load_capabilities(_capabilities)
            )
        else:
            self.__driver = webdriver.Remote(self.appium_url, _capabilities)

    # You may also define helper function to modularize
    # functions called within the test scenario.
    def _press_dpad(self, direction: str, interval: float) -> None:
        """Send a single D-pad key event to the Kepler device.

        Reproduces a user's D-pad click behavior by sending a key press with
        no hold duration, then sleeping for the remainder of the target interval.

        Args:
            direction: D-pad key code (e.g. "103"=Up, "105"=Left, "106"=Right, "108"=Down).
                See the full list of supported key codes at:
                https://developer.amazon.com/docs/vega/latest/appium-commands.html#d-pad-navigation
            interval: Target time interval between key press events, in seconds.
                The method sleeps for (interval - command execution time) to maintain
                consistent pacing.
        """
        # We keep "holdDuration" to 0 (no holding) to
        # reproduce D-pad clicking behavior by app users.
        start: float = time.time()
        self.__driver.execute_script(
                "jsonrpc: injectInputKeyEvent",
                [{"inputKeyEvent": direction , "holdDuration": 0}]
            )
        cmd_time: float = time.time() - start
        if interval > cmd_time:
            wait_time: float = interval - cmd_time
            logger.info(f"Sleeping for {wait_time} seconds to give {interval} seconds interval between D-pad press events.")
            time.sleep(wait_time)
 
    def prep(self) -> None:
        """Prepare the device before the test run.

        Waits for the application to warm up before sending any input events.
        No additional setup is required since D-pad keys are sent directly
        to the Home page of the KeplerVideoApp.
        """
        # wait 10 seconds for app to warm up
        logger.info(f"Waiting for application to warm up for {TestRunner._WARMUP_WAIT} seconds")
        time.sleep(TestRunner._WARMUP_WAIT)
        return
 
    def run(self) -> None:
        """Execute D-pad key press sequence during the test run phase.

        This stage is used to measure KPIs (e.g., UI fluidity, background memory)
        while generating directional input events.

        The following interaction sequence is repeated 5 times:
            1. Send "Down" key 5 times
            2. Send "Up" key 5 times
            3. Send "Right" key 5 times
            4. Send "Left" key 5 times
        """
        for _ in range(5):
            print("[RnlConfApp] Scrolling Down 5 Times!")
            for _ in range(5):
                self._press_dpad("108", TestRunner._PRESS_DELAY)

            print("[RnlConfApp] Scrolling UP 5 Times!")
            for _ in range(5):
                self._press_dpad("103", TestRunner._PRESS_DELAY)

            print("[RnlConfApp] Scrolling Right 5 Times!")
            for _ in range(5):
                self._press_dpad("106", TestRunner._PRESS_DELAY)

            print("[RnlConfApp] Scrolling Left 5 Times!")
            for _ in range(5):
                self._press_dpad("105", TestRunner._PRESS_DELAY)
            